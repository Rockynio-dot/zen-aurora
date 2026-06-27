import { extractPalette } from "./palette.ts";
import { loadTheme, saveTheme } from "../core/state.ts";
import { applyTheme } from "../core/cssEngine.ts";

let dynamicTimer: ReturnType<typeof setInterval> | null = null;
let faviconObserverCleanup: (() => void) | null = null;

// ── Pref helpers ──────────────────────────────────────────────────────────────

function sp(key: string, def: string): string {
  try { return Services.prefs.getStringPref(key, def) || def; } catch { return def; }
}
function np(key: string, def: number): number {
  const v = parseFloat(sp(key, String(def)));
  return isNaN(v) ? def : v;
}

// ── Colour math ───────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}

function hexToRgb(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  return [
    parseInt(c.slice(0, 2), 16),
    parseInt(c.slice(2, 4), 16),
    parseInt(c.slice(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}

function lerpHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex(lerp(ar, br, t), lerp(ag, bg, t), lerp(ab, bb, t));
}

// Boost saturation of a colour in HSL space
function boostSaturation(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return hex;
  let s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
  s = Math.min(1, s * factor);
  // HSL back to RGB
  const c  = (1 - Math.abs(2 * l - 1)) * s;
  const x  = c * (1 - Math.abs(((  (max === r ? ((g - b) / (max - min)) % 6 :
                                    max === g ? (b - r) / (max - min) + 2 :
                                               (r - g) / (max - min) + 4) ) % 6) - 1));
  const m  = l - c / 2;
  let rr = 0, gg = 0, bb2 = 0;
  const hh = (max === r ? ((g - b) / (max - min) * 60 + 360) % 360 :
               max === g ? (b - r) / (max - min) * 60 + 120 :
                          (r - g) / (max - min) * 60 + 240);
  if      (hh < 60)  { rr = c;  gg = x;  }
  else if (hh < 120) { rr = x;  gg = c;  }
  else if (hh < 180) { gg = c;  bb2 = x; }
  else if (hh < 240) { gg = x;  bb2 = c; }
  else if (hh < 300) { rr = x;  bb2 = c; }
  else               { rr = c;  bb2 = x; }
  return rgbToHex((rr + m) * 255, (gg + m) * 255, (bb2 + m) * 255);
}

// Darken a hex colour by factor (0 = black, 1 = original)
function darken(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r * factor, g * factor, b * factor);
}

// ── Day / Night ───────────────────────────────────────────────────────────────

function getDayNightFactor(): number {
  const dayH   = np("mod.aurora.dynamic.day_hour",   7);
  const nightH = np("mod.aurora.dynamic.night_hour", 20);
  const transM = np("mod.aurora.dynamic.transition_minutes", 60);
  const transH = transM / 60;

  const now = new Date();
  const h   = now.getHours() + now.getMinutes() / 60;

  const dayEnd   = dayH   + transH;
  const nightEnd = nightH + transH;

  // Daytime
  if (h >= dayEnd && h < nightH) return 0;
  // Full night
  if (h >= nightEnd || h < dayH) return 1;
  // Morning transition
  if (h >= dayH && h < dayEnd)   return 1 - (h - dayH) / transH;
  // Evening transition
  if (h >= nightH && h < nightEnd) return (h - nightH) / transH;
  return 0;
}

function applyDayNight(doc: Document): void {
  const t = getDayNightFactor();

  const dayAccent  = sp("mod.aurora.dynamic.day_accent",  "#4a90d9");
  const dayBg      = sp("mod.aurora.dynamic.day_bg",      "#1a2035");
  const dayText    = sp("mod.aurora.dynamic.day_text",    "#dde8ff");
  const nightAccent= sp("mod.aurora.dynamic.night_accent","#e07840");
  const nightBg    = sp("mod.aurora.dynamic.night_bg",    "#1f1510");
  const nightText  = sp("mod.aurora.dynamic.night_text",  "#ffe0cc");

  const theme = loadTheme();
  const merged = {
    ...theme,
    colors: {
      ...theme.colors,
      accent:     lerpHex(dayAccent,  nightAccent, t),
      panelBg:    lerpHex(dayBg,      nightBg,     t),
      toolbarBg:  lerpHex(darken(dayBg, 0.85), darken(nightBg, 0.85), t),
      sidebarBg:  lerpHex(darken(dayBg, 0.75), darken(nightBg, 0.75), t),
      panelText:  lerpHex(dayText,    nightText,   t),
      browserBg:  lerpHex(darken(dayBg, 0.6),  darken(nightBg, 0.6),  t),
      urlbarFocus:lerpHex(dayAccent,  nightAccent, t),
      tabActiveBg:lerpHex(darken(dayBg, 1.5),  darken(nightBg, 1.5),  t),
    },
  };
  applyTheme(merged, doc);
}

// ── Material You ──────────────────────────────────────────────────────────────

async function applyMaterialTheme(doc: Document): Promise<void> {
  const theme = loadTheme();
  if (!theme.images.browserBg) return;

  const palette = await extractPalette(theme.images.browserBg);
  const intensity = np("mod.aurora.dynamic.material_intensity", 0.75);

  function blend(dynamic: string, original: string): string {
    return lerpHex(original, dynamic, intensity);
  }

  const merged = {
    ...theme,
    colors: {
      ...theme.colors,
      accent:     blend(palette.primary,   theme.colors.accent),
      panelBg:    blend(palette.surface,   theme.colors.panelBg),
      toolbarBg:  blend(darken(palette.surface, 0.85), theme.colors.toolbarBg),
      sidebarBg:  blend(darken(palette.surface, 0.75), theme.colors.sidebarBg),
      panelText:  blend(palette.onSurface, theme.colors.panelText),
      border:     blend(palette.secondary, theme.colors.border),
      browserBg:  blend(darken(palette.surface, 0.6), theme.colors.browserBg),
      tabActiveBg:blend(darken(palette.surface, 1.5), theme.colors.tabActiveBg),
      urlbarFocus:blend(palette.primary,   theme.colors.urlbarFocus),
    },
  };
  applyTheme(merged, doc);
}

// ── Tab favicon accent ────────────────────────────────────────────────────────

async function extractFaviconColor(): Promise<string | null> {
  try {
    const tab = (window as Record<string, unknown>).gBrowser?.selectedTab as { linkedBrowser?: { currentURI?: { spec?: string } } } | undefined;
    if (!tab) return null;

    // Get favicon from Zen/Firefox's Places API
    const uri  = tab.linkedBrowser?.currentURI?.spec;
    if (!uri || uri.startsWith("about:") || uri.startsWith("moz-extension:")) return null;

    const faviconURL = await new Promise<string | null>((resolve) => {
      try {
        const svc = (ChromeUtils as unknown as { import: (u: string) => Record<string, unknown> })
          .import("resource://gre/modules/PlacesUtils.sys.mjs") as { PlacesUtils?: { favicons?: {
            getFaviconURLForPage: (uri: unknown, cb: (faviconUri: { spec: string } | null) => void) => void;
          }}};
        const PlacesUtils = svc.PlacesUtils;
        if (!PlacesUtils?.favicons) { resolve(null); return; }
        const pageURI = Services.io.newURI(uri);
        PlacesUtils.favicons.getFaviconURLForPage(pageURI, (faviconUri) => {
          resolve(faviconUri?.spec ?? null);
        });
      } catch { resolve(null); }
    });

    if (!faviconURL) return null;

    // Draw favicon to OffscreenCanvas and extract dominant color
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = faviconURL;
    });

    const canvas = new OffscreenCanvas(16, 16);
    const ctx    = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, 16, 16);
    const data = ctx.getImageData(0, 0, 16, 16).data;

    // Average non-transparent pixels
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 128) continue;
      r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
    }
    if (count === 0) return null;

    const satBoost = np("mod.aurora.dynamic.favicon_saturation_boost", 1.2);
    const raw = rgbToHex(r / count, g / count, b / count);
    return boostSaturation(raw, satBoost);
  } catch {
    return null;
  }
}

let lastTabFaviconColor = "";

async function applyTabAccent(doc: Document): Promise<void> {
  const fallback = sp("mod.aurora.dynamic.favicon_fallback", "#7c6af7");
  const color    = (await extractFaviconColor()) ?? fallback;

  if (color === lastTabFaviconColor) return;
  lastTabFaviconColor = color;

  const theme  = loadTheme();
  const merged = {
    ...theme,
    colors: {
      ...theme.colors,
      accent:      color,
      urlbarFocus: color,
      tabActiveBg: darken(color, 0.3),
    },
  };
  applyTheme(merged, doc);
}

// ── Public API ────────────────────────────────────────────────────────────────

export function initDynamicTheme(doc: Document): void {
  stopDynamicTheme();
  const theme = loadTheme();

  if (theme.dynamicMode === "material") {
    applyMaterialTheme(doc).catch(() => {/* silent */});
    dynamicTimer = setInterval(() => applyMaterialTheme(doc).catch(() => {/* */}), 5 * 60 * 1000);

  } else if (theme.dynamicMode === "daynight") {
    applyDayNight(doc);
    // Update every minute for smooth transitions
    dynamicTimer = setInterval(() => applyDayNight(doc), 60 * 1000);

  } else if (theme.dynamicMode === "tab_accent") {
    applyTabAccent(doc).catch(() => {/* */});
    // Listen for tab selection changes
    const onTab = () => applyTabAccent(doc).catch(() => {/* */});
    doc.addEventListener("TabSelect", onTab, { capture: true });
    // Also poll for URL changes (SPAs)
    dynamicTimer = setInterval(() => applyTabAccent(doc).catch(() => {/* */}), 5000);
    faviconObserverCleanup = () => {
      doc.removeEventListener("TabSelect", onTab, true);
    };
  }
}

export function stopDynamicTheme(): void {
  if (dynamicTimer !== null) { clearInterval(dynamicTimer); dynamicTimer = null; }
  faviconObserverCleanup?.();
  faviconObserverCleanup = null;
  lastTabFaviconColor    = "";
}

// Info for the panel status display
export function getDynamicStatus(): string {
  try {
    const mode = Services.prefs.getStringPref("mod.aurora.dynamic_mode", "off");
    if (mode === "off") return "Vypnuto";
    if (mode === "material") {
      const i = np("mod.aurora.dynamic.material_intensity", 0.75);
      return `Material You — intenzita ${Math.round(i * 100)}%`;
    }
    if (mode === "daynight") {
      const t  = getDayNightFactor();
      const pct = Math.round(t * 100);
      const label = pct < 10 ? "🌞 Den" : pct > 90 ? "🌙 Noc" : `🌆 Přechod ${pct}% noc`;
      const dayH   = np("mod.aurora.dynamic.day_hour",   7);
      const nightH = np("mod.aurora.dynamic.night_hour", 20);
      return `${label} (den od ${dayH}:00, noc od ${nightH}:00)`;
    }
    if (mode === "tab_accent") {
      return `Favicon akcent${lastTabFaviconColor ? `: ${lastTabFaviconColor}` : " — čekám na záložku"}`;
    }
    return mode;
  } catch { return "—"; }
}

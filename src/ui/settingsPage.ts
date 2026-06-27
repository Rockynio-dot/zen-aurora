// Runs inside chrome://aurora/content/settings.html — full chrome privileges
import { GLOBAL_COLORS, SPACE_COLORS, SPACE_COUNT, spaceColorPref } from "./colorDefs.ts";
import { initColorPicker, openColorPicker } from "./colorPicker.ts";
import {
  getPref, getBoolPref, setPref, setBoolPref,
  buildToggle, buildSlider, buildSelect, buildTextInput, buildSectionHeading,
} from "./controls.ts";
import { AURORA_COLOR_DEFAULTS } from "../core/state.ts";

// ── CSS ───────────────────────────────────────────────────────────────────────

const CSS = `
*, *::before, *::after { box-sizing: border-box; }
body {
  margin: 0; padding: 0; display: flex; height: 100vh; overflow: hidden;
  font-family: system-ui, -apple-system, sans-serif; font-size: 13px;
  color: #e0e0ff; background: #10102a;
}
.ao-nav {
  width: 180px; flex-shrink: 0; background: #0b0b1f;
  border-right: 1px solid #1e1e44; display: flex; flex-direction: column;
  padding: 16px 0 8px; overflow-y: auto;
}
.ao-nav-logo {
  padding: 0 16px 16px; font-size: 16px; font-weight: 800; color: #a89bff;
  border-bottom: 1px solid #1e1e44; margin-bottom: 8px;
}
.ao-nav-item {
  display: flex; align-items: center; gap: 10px; padding: 9px 16px;
  cursor: pointer; color: #6660aa; border-left: 2px solid transparent;
  transition: color .1s, background .1s, border-color .1s;
  user-select: none; font-size: 12.5px;
}
.ao-nav-item:hover { color: #c0b4ff; background: #12123a; }
.ao-nav-item.active { color: #c0b4ff; background: #16163a; border-left-color: #7c6af7; font-weight: 600; }
.ao-nav-icon { font-size: 15px; width: 18px; text-align: center; }
.ao-nav-sep { height: 1px; background: #1e1e44; margin: 8px 16px; }
.ao-nav-btn {
  padding: 7px 10px; border: 1px solid #2d2d5c; border-radius: 8px;
  background: #0f0f28; color: #8880cc; font-size: 11px; cursor: pointer;
  font-family: inherit; transition: background .1s, color .1s, border-color .1s;
  display: flex; align-items: center; gap: 6px; text-align: left;
}
.ao-nav-btn:hover { background: #1a1a3a; color: #c0b4ff; border-color: #4a4a8a; }
.ao-nav-btn.danger { border-color: #4a1a1a; color: #c06060; }
.ao-nav-btn.danger:hover { background: #2a1010; border-color: #8a2a2a; color: #ff8080; }
.ao-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.ao-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 24px; border-bottom: 1px solid #1e1e44; background: #0d0d22; flex-shrink: 0;
}
.ao-header-title { font-size: 15px; font-weight: 700; color: #c0b4ff; display: flex; align-items: center; gap: 8px; }
.ao-header-sub { font-size: 11px; color: #5550aa; font-weight: 400; margin-left: 4px; }
.ao-header-close {
  background: #1a1a38; border: 1px solid #2d2d5c; border-radius: 8px;
  color: #8880cc; font-size: 13px; cursor: pointer; padding: 5px 12px;
  font-family: inherit; transition: background .1s, color .1s;
}
.ao-header-close:hover { background: #2a2a4e; color: #e0e0ff; }
.ao-content { flex: 1; overflow-y: auto; padding: 24px; }
.ao-content::-webkit-scrollbar { width: 4px; }
.ao-content::-webkit-scrollbar-thumb { background: #2d2d5c; border-radius: 4px; }
.ao-section { display: none; }
.ao-section.active { display: block; }

/* Controls */
.aoc-section-heading {
  font-size: 10px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase;
  color: #4a4a8a; padding: 16px 0 8px; margin-top: 8px;
}
.aoc-section-heading:first-child { padding-top: 0; margin-top: 0; }
.aoc-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 0; border-bottom: 1px solid #16163a; gap: 12px; min-height: 40px;
}
.aoc-row:last-child { border-bottom: none; }
.aoc-label { color: #b0b0d0; font-size: 12.5px; flex: 1; }
.aoc-color-swatch {
  width: 28px; height: 28px; border-radius: 7px; border: 2px solid #2d2d5c;
  cursor: pointer; flex-shrink: 0; transition: border-color .12s, transform .12s;
}
.aoc-color-swatch:hover { border-color: #7c6af7; transform: scale(1.08); }
.aoc-color-hex {
  width: 74px; background: #0d0d22; border: 1px solid #2d2d5c; border-radius: 6px;
  color: #c0b4ff; font-size: 11px; font-family: monospace;
  padding: 5px 6px; text-align: center; flex-shrink: 0;
}
.aoc-color-hex:focus { outline: 1px solid #7c6af7; border-color: #7c6af7; }
.aoc-toggle {
  width: 36px; height: 20px; border-radius: 10px; background: #2a2a4e;
  flex-shrink: 0; position: relative; cursor: pointer; transition: background .15s; outline: none;
}
.aoc-toggle.on { background: #7c6af7; }
.aoc-thumb { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 8px; background: #fff; transition: left .15s; }
.aoc-toggle.on .aoc-thumb { left: 18px; }
.aoc-row-slider { flex-direction: column; align-items: stretch; gap: 4px; }
.aoc-slider-header { display: flex; justify-content: space-between; align-items: center; }
.aoc-slider-val { color: #7c6af7; font-size: 12px; font-family: monospace; }
.aoc-slider { width: 100%; height: 4px; cursor: pointer; -webkit-appearance: none; appearance: none; background: #2d2d5c; border-radius: 2px; }
.aoc-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #7c6af7; cursor: pointer; box-shadow: 0 0 0 2px #0d0d22; }
.aoc-select { background: #0d0d22; border: 1px solid #2d2d5c; border-radius: 6px; color: #c0b4ff; font-size: 12px; font-family: inherit; padding: 5px 8px; cursor: pointer; flex-shrink: 0; min-width: 180px; }
.aoc-select:focus { outline: 1px solid #7c6af7; border-color: #7c6af7; }
.aoc-input { background: #0d0d22; border: 1px solid #2d2d5c; border-radius: 6px; color: #c0b4ff; font-size: 12px; font-family: inherit; padding: 5px 8px; flex: 1; min-width: 0; }
.aoc-input:focus { outline: 1px solid #7c6af7; border-color: #7c6af7; }

/* Quick settings */
.ao-quick-swatch-big {
  width: 64px; height: 64px; border-radius: 14px; border: 3px solid #2d2d5c;
  cursor: pointer; flex-shrink: 0; transition: border-color .12s, transform .12s;
}
.ao-quick-swatch-big:hover { border-color: #7c6af7; transform: scale(1.04); }
.ao-quick-preview { display: flex; gap: 6px; flex-wrap: wrap; margin: 12px 0; }
.ao-quick-preview-dot { width: 24px; height: 24px; border-radius: 6px; border: 1px solid #2d2d5c; }
.ao-apply-btn {
  padding: 10px 20px; background: #7c6af7; border: none; border-radius: 8px;
  color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit;
  transition: background .1s, transform .1s;
}
.ao-apply-btn:hover { background: #9080ff; transform: translateY(-1px); }
.ao-apply-btn:active { transform: translateY(0); }

/* Badge */
.ao-badge {
  display: inline-block; font-size: 9px; font-family: monospace;
  background: #141430; border: 1px solid #252550; border-radius: 3px;
  color: #5550aa; padding: 1px 4px; margin-left: 6px; vertical-align: middle;
}

/* Note */
.ao-note {
  font-size: 11.5px; color: #5550aa; line-height: 1.6; padding: 8px 12px;
  background: #0d0d22; border: 1px solid #1e1e44; border-radius: 6px; margin-bottom: 12px;
}

/* Space tabs */
.ao-space-tabs { display: flex; gap: 4px; margin-bottom: 16px; flex-wrap: wrap; }
.ao-space-tab {
  padding: 5px 12px; border-radius: 6px; border: 1px solid #2d2d5c;
  background: #0d0d22; color: #6660aa; font-size: 12px; cursor: pointer; font-family: inherit;
  transition: background .1s, color .1s, border-color .1s;
}
.ao-space-tab:hover { color: #c0b4ff; border-color: #4a4a8a; }
.ao-space-tab.active { background: #1e1e3e; color: #c0b4ff; border-color: #7c6af7; }
.ao-space-content { display: none; }
.ao-space-content.active { display: block; }

/* Presets */
.ao-preset-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.ao-preset-item {
  display: flex; align-items: center; gap: 8px; padding: 10px 14px;
  background: #0d0d22; border: 1px solid #1e1e44; border-radius: 8px; transition: border-color .1s;
}
.ao-preset-item:hover { border-color: #2d2d5c; }
.ao-preset-swatch-row { display: flex; gap: 3px; flex-shrink: 0; }
.ao-preset-swatch { width: 14px; height: 14px; border-radius: 3px; }
.ao-preset-name-view { flex: 1; color: #c0b4ff; font-size: 12.5px; }
.ao-preset-name-edit {
  flex: 1; background: #141432; border: 1px solid #7c6af7; border-radius: 4px;
  color: #c0b4ff; font-size: 12px; font-family: inherit; padding: 3px 7px; min-width: 0;
}
.ao-preset-time { color: #5550aa; font-size: 11px; white-space: nowrap; }
.ao-preset-btn {
  padding: 4px 10px; border-radius: 5px; font-size: 11px;
  border: 1px solid #2d2d5c; background: #141432; color: #8880cc;
  cursor: pointer; font-family: inherit; transition: background .1s, color .1s;
}
.ao-preset-btn:hover { background: #1e1e44; color: #c0b4ff; }
.ao-preset-btn.load { border-color: #7c6af7; color: #a89bff; }
.ao-preset-btn.load:hover { background: #1e1e4a; }
.ao-preset-btn.save { border-color: #3a6a3a; color: #80c080; }
.ao-preset-btn.save:hover { background: #1a2a1a; }
.ao-preset-btn.del:hover { border-color: #8a2a2a; color: #ff8080; }
.ao-preset-save-row { display: flex; gap: 8px; align-items: center; margin-top: 4px; }
.ao-preset-name-in {
  flex: 1; background: #0d0d22; border: 1px solid #2d2d5c; border-radius: 6px;
  color: #c0b4ff; font-size: 12px; font-family: inherit; padding: 7px 10px;
}
.ao-preset-name-in:focus { outline: 1px solid #7c6af7; border-color: #7c6af7; }
.ao-preset-save-btn {
  padding: 7px 16px; background: #7c6af7; border: none; border-radius: 6px;
  color: #fff; font-size: 12px; cursor: pointer; font-family: inherit; transition: background .1s;
}
.ao-preset-save-btn:hover { background: #9080ff; }

/* About */
.ao-about-card { padding: 16px; background: #0d0d22; border: 1px solid #1e1e44; border-radius: 10px; margin-bottom: 12px; }
.ao-about-title { font-size: 18px; font-weight: 700; color: #a89bff; margin-bottom: 4px; }
.ao-about-sub { font-size: 12px; color: #5550aa; }

/* Status */
.ao-status { font-size: 11px; height: 16px; color: #5550aa; padding: 2px 0; transition: color .2s; }
.ao-status.ok  { color: #60c060; }
.ao-status.err { color: #c06060; }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────

function status(el: HTMLElement, msg: string, cls: "ok" | "err" | ""): void {
  el.textContent = msg; el.className = `ao-status ${cls}`;
  if (cls) setTimeout(() => { el.textContent = ""; el.className = "ao-status"; }, 2400);
}
function note(doc: Document, text: string): HTMLElement {
  const n = doc.createElement("div"); n.className = "ao-note"; n.textContent = text; return n;
}
function badge(doc: Document, text: string): HTMLElement {
  const b = doc.createElement("span"); b.className = "ao-badge"; b.textContent = text; return b;
}

// ── Color row ─────────────────────────────────────────────────────────────────

function colorRow(
  doc: Document, container: HTMLElement,
  label: string, pref: string, def: string, st: HTMLElement,
  cssTarget?: string,
): void {
  const row = doc.createElement("div"); row.className = "aoc-row";
  const lbl = doc.createElement("span"); lbl.className = "aoc-label"; lbl.textContent = label;
  if (cssTarget) lbl.appendChild(badge(doc, cssTarget));
  const cur = getPref(pref, def);
  const sw  = doc.createElement("div"); sw.className = "aoc-color-swatch"; sw.style.background = cur || def || "#555";
  const hex = doc.createElement("input") as HTMLInputElement;
  hex.type = "text"; hex.className = "aoc-color-hex"; hex.value = cur || def; hex.maxLength = 9;
  const sync = (v: string) => { sw.style.background = v; hex.value = v; setPref(pref, v); status(st, "✓", "ok"); };
  sw.addEventListener("click", (e) => { e.stopPropagation(); openColorPicker(sw, hex.value || def, sync); });
  hex.addEventListener("change", () => { const v = hex.value.trim(); sync(v.startsWith("#") ? v : `#${v}`); });
  row.appendChild(lbl); row.appendChild(sw); row.appendChild(hex);
  container.appendChild(row);
}

// ── Palette generator ─────────────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h = 0, s = 0; const l = (max+min)/2;
  if (max !== min) {
    const d = max-min; s = l > .5 ? d/(2-max-min) : d/(max+min);
    switch (max) {
      case r: h = ((g-b)/d+(g<b?6:0))/6; break;
      case g: h = ((b-r)/d+2)/6; break;
      case b: h = ((r-g)/d+4)/6; break;
    }
  }
  return [Math.round(h*360), Math.round(s*100), Math.round(l*100)];
}
function hslHex(h: number, s: number, l: number): string {
  s/=100; l/=100; const a = s*Math.min(l,1-l);
  const f = (n: number) => { const k=(n+h/30)%12, c=l-a*Math.max(Math.min(k-3,9-k,1),-1); return Math.round(255*c).toString(16).padStart(2,"0"); };
  return `#${f(0)}${f(8)}${f(4)}`;
}

interface PaletteData {
  colors: Record<string, string>;
  strings: Record<string, string>;
  booleans: Record<string, boolean>;
}

function generateDarkPalette(accent: string): PaletteData {
  const [h, s] = hexToHsl(accent); const sat = Math.min(s, 40);
  return {
    colors: {
      "mod.aurora.color.accent":               accent,
      "mod.aurora.color.urlbar_focus":         accent,
      "mod.aurora.color.workspace_dot_active": accent,
      "mod.aurora.color.browser_bg":           hslHex(h, Math.min(sat,20),  7),
      "mod.aurora.color.workspace_strip_bg":   hslHex(h, Math.min(sat,25),  8),
      "mod.aurora.color.toolbar_bg":           hslHex(h, Math.min(sat,28), 10),
      "mod.aurora.color.sidebar_bg":           hslHex(h, Math.min(sat,28),  9),
      "mod.aurora.color.panel_bg":             hslHex(h, Math.min(sat,28), 12),
      "mod.aurora.color.tab_inactive_bg":      hslHex(h, Math.min(sat,26), 12),
      "mod.aurora.color.urlbar_bg":            hslHex(h, Math.min(sat,30), 14),
      "mod.aurora.color.tab_active_bg":        hslHex(h, Math.min(sat,42), 19),
      "mod.aurora.color.tab_hover_bg":         hslHex(h, Math.min(sat,35), 16),
      "mod.aurora.color.button_bg":            hslHex(h, Math.min(sat,42), 18),
      "mod.aurora.color.button_hover":         hslHex(h, Math.min(sat,38), 22),
      "mod.aurora.color.border":               hslHex(h, Math.min(sat,42), 24),
      "mod.aurora.color.urlbar_border":        hslHex(h, Math.min(sat,42), 26),
      "mod.aurora.color.workspace_dot":        hslHex(h, Math.min(sat,38), 26),
      "mod.aurora.color.scrollbar":            hslHex(h, Math.min(sat,38), 28),
      "mod.aurora.color.selection_bg":         accent + "40",
      "mod.aurora.color.panel_text":           hslHex(h, 20, 90),
      "mod.aurora.color.tab_text":             hslHex(h, 15, 82),
      "mod.aurora.color.urlbar_text":          hslHex(h, 20, 90),
      "mod.aurora.color.tab_close_hover":      "#ff6b6b",
    },
    strings: {
      "mod.aurora.effect.panel_opacity":      "1.0",
      "mod.aurora.effect.panel_blur":         "0px",
      "mod.aurora.effect.panel_border_style": "solid",
      "mod.aurora.animation_speed":           "normal",
      "mod.aurora.animation.easing":          "ease",
      "mod.aurora.layout.toolbar_mode":       "multi",
      "mod.aurora.layout.no_gap_bg":          hslHex(h, Math.min(sat,20), 4),
      "mod.aurora.layout.no_gap_mode":        "all",
    },
    booleans: {
      "mod.aurora.effect.tab_shadow":                      false,
      "mod.aurora.effect.accent_glow":                     false,
      "mod.aurora.layout.no_gap_mod":                      false,
      "mod.aurora.layout.no_gap_remove_split_highlight":   false,
      "mod.aurora.layout.no_gap_remove_box_shadow":        false,
      "mod.aurora.style.tabs":                             true,
      "mod.aurora.style.urlbar":                           true,
      "mod.aurora.style.sidebar":                          true,
      "mod.aurora.style.toolbar":                          true,
      "mod.aurora.style.workspace_strip":                  true,
      "mod.aurora.style.menus":                            true,
      "mod.aurora.style.individual_text_colors":           false,
    },
  };
}

function generateLightPalette(accent: string): PaletteData {
  const [h, s] = hexToHsl(accent); const sat = Math.min(s, 45);
  return {
    colors: {
      "mod.aurora.color.accent":               accent,
      "mod.aurora.color.urlbar_focus":         accent,
      "mod.aurora.color.workspace_dot_active": accent,
      // Backgrounds — výrazně tmavší než dříve pro viditelný gradient
      "mod.aurora.color.browser_bg":           hslHex(h, Math.min(sat,16), 82),
      "mod.aurora.color.workspace_strip_bg":   hslHex(h, Math.min(sat,32), 62),
      "mod.aurora.color.toolbar_bg":           hslHex(h, Math.min(sat,28), 72),
      "mod.aurora.color.sidebar_bg":           hslHex(h, Math.min(sat,28), 68),
      "mod.aurora.color.panel_bg":             hslHex(h, Math.min(sat,22), 76),
      "mod.aurora.color.tab_inactive_bg":      hslHex(h, Math.min(sat,30), 64),
      "mod.aurora.color.urlbar_bg":            hslHex(h, Math.min(sat,14), 80),
      "mod.aurora.color.tab_active_bg":        hslHex(h, Math.min(sat,40), 52),
      "mod.aurora.color.tab_hover_bg":         hslHex(h, Math.min(sat,34), 58),
      "mod.aurora.color.button_bg":            hslHex(h, Math.min(sat,38), 52),
      "mod.aurora.color.button_hover":         hslHex(h, Math.min(sat,30), 44),
      "mod.aurora.color.border":               hslHex(h, Math.min(sat,36), 40),
      "mod.aurora.color.urlbar_border":        hslHex(h, Math.min(sat,32), 36),
      "mod.aurora.color.workspace_dot":        hslHex(h, Math.min(sat,42), 34),
      "mod.aurora.color.scrollbar":            hslHex(h, Math.min(sat,28), 42),
      "mod.aurora.color.selection_bg":         accent + "35",
      "mod.aurora.color.panel_text":           hslHex(h, 12,  6),
      "mod.aurora.color.tab_text":             hslHex(h,  9, 10),
      "mod.aurora.color.urlbar_text":          hslHex(h, 12,  6),
      "mod.aurora.color.tab_close_hover":      "#cc2222",
    },
    strings: {
      "mod.aurora.effect.panel_opacity":      "1.0",
      "mod.aurora.effect.panel_blur":         "0px",
      "mod.aurora.effect.panel_border_style": "solid",
      "mod.aurora.animation_speed":           "normal",
      "mod.aurora.animation.easing":          "ease",
      "mod.aurora.layout.toolbar_mode":       "multi",
      "mod.aurora.layout.no_gap_bg":          hslHex(h, Math.min(sat,16), 60),
    },
    booleans: {
      "mod.aurora.effect.tab_shadow":                      false,
      "mod.aurora.effect.accent_glow":                     false,
      "mod.aurora.layout.no_gap_mod":                      false,
      "mod.aurora.layout.no_gap_remove_split_highlight":   false,
      "mod.aurora.layout.no_gap_remove_box_shadow":        false,
      "mod.aurora.style.tabs":                             true,
      "mod.aurora.style.urlbar":                           true,
      "mod.aurora.style.sidebar":                          true,
      "mod.aurora.style.toolbar":                          true,
      "mod.aurora.style.workspace_strip":                  true,
      "mod.aurora.style.menus":                            true,
      "mod.aurora.style.individual_text_colors":           false,
    },
  };
}

function applyPalette(data: PaletteData): void {
  for (const [k, v] of Object.entries(data.colors))   { try { Services.prefs.setStringPref(k, v); } catch {} }
  for (const [k, v] of Object.entries(data.strings))  { try { Services.prefs.setStringPref(k, v); } catch {} }
  for (const [k, v] of Object.entries(data.booleans)) { try { Services.prefs.setBoolPref(k, v);   } catch {} }
}

// ── 1. Rychlé nastavení ───────────────────────────────────────────────────────

function buildQuick(doc: Document, el: HTMLElement, st: HTMLElement): void {
  el.appendChild(note(doc, "Vyberte jeden akcent a Aurora vygeneruje celou paletu — barvy, efekty, animace, style přepínače. Stejně jako \"Upravit motiv\" v Zenu."));

  buildSectionHeading(doc, el, "Akcent");
  const accentRow = doc.createElement("div"); accentRow.style.cssText = "display:flex;gap:16px;align-items:center;padding:8px 0;";
  const curAccent = getPref("mod.aurora.color.accent", "#7c6af7");
  const swBig = doc.createElement("div"); swBig.className = "ao-quick-swatch-big"; swBig.style.background = curAccent;
  const accentHex = doc.createElement("input") as HTMLInputElement;
  accentHex.type = "text"; accentHex.className = "aoc-color-hex"; accentHex.style.cssText = "width:90px;font-size:13px;height:36px;";
  accentHex.value = curAccent; accentHex.maxLength = 9;
  const syncAccent = (v: string) => { swBig.style.background = v; accentHex.value = v; updatePreview(v); };
  swBig.addEventListener("click", (e) => { e.stopPropagation(); openColorPicker(swBig, accentHex.value || "#7c6af7", syncAccent); });
  accentHex.addEventListener("change", () => { const v = accentHex.value.trim(); syncAccent(v.startsWith("#") ? v : `#${v}`); });

  const modeSelect = doc.createElement("select"); modeSelect.className = "aoc-select"; modeSelect.style.minWidth = "120px";
  for (const [val, lbl] of [["dark","🌙 Tmavý"],["light","☀️ Světlý"]]) {
    const opt = doc.createElement("option"); opt.value = val; opt.textContent = lbl; modeSelect.appendChild(opt);
  }
  accentRow.appendChild(swBig); accentRow.appendChild(accentHex); accentRow.appendChild(modeSelect);
  el.appendChild(accentRow);

  buildSectionHeading(doc, el, "Náhled palety");
  const preview = doc.createElement("div"); preview.className = "ao-quick-preview"; el.appendChild(preview);
  // Klíče v pořadí: tmavé pozadí → světlé prvky → akcent → text
  const previewKeys = [
    "mod.aurora.color.browser_bg",
    "mod.aurora.color.workspace_strip_bg",
    "mod.aurora.color.toolbar_bg",
    "mod.aurora.color.sidebar_bg",
    "mod.aurora.color.panel_bg",
    "mod.aurora.color.tab_inactive_bg",
    "mod.aurora.color.urlbar_bg",
    "mod.aurora.color.tab_active_bg",
    "mod.aurora.color.button_bg",
    "mod.aurora.color.border",
    "mod.aurora.color.workspace_dot",
    "mod.aurora.color.scrollbar",
    "mod.aurora.color.accent",
    "mod.aurora.color.workspace_dot_active",
    "mod.aurora.color.selection_bg",
    "mod.aurora.color.panel_text",
  ];
  const dots: HTMLElement[] = [];
  for (const k of previewKeys) {
    const dot = doc.createElement("div"); dot.className = "ao-quick-preview-dot";
    dot.title = k.replace("mod.aurora.color.", "");
    dot.style.background = getPref(k, "#333"); preview.appendChild(dot); dots.push(dot);
  }

  // Co paleta nastavuje — textový souhrn
  const coverNote = note(doc, [
    "Nastavuje: 23 barev · průhlednost · blur · styl ohraničení · animace ·",
    "rozvržení toolbaru · stav no-gap · zapnutí všech stylů elementů (záložky, urlbar, sidebar…)",
  ].join(" "));
  el.appendChild(coverNote);

  function updatePreview(accent: string): void {
    const data = modeSelect.value === "light" ? generateLightPalette(accent) : generateDarkPalette(accent);
    dots.forEach((dot, i) => { dot.style.background = data.colors[previewKeys[i]] ?? "#333"; });
  }
  modeSelect.addEventListener("change", () => updatePreview(accentHex.value));
  updatePreview(curAccent);

  const applyBtn = doc.createElement("button"); applyBtn.className = "ao-apply-btn";
  applyBtn.style.cssText = "display:block;margin:16px 0 0;";
  applyBtn.textContent = "✦ Použít paletu";
  applyBtn.addEventListener("click", () => {
    const v = accentHex.value.trim();
    const data = modeSelect.value === "light" ? generateLightPalette(v) : generateDarkPalette(v);
    applyPalette(data); status(st, "✓ Paleta aplikována — barvy, efekty, animace", "ok");
  });
  el.appendChild(applyBtn);
}

// ── 2. Barvy (pokročilé) ──────────────────────────────────────────────────────

function buildColors(doc: Document, el: HTMLElement, st: HTMLElement): void {
  buildSectionHeading(doc, el, "Akcent & Ohraničení");
  colorRow(doc, el, "Akcent", "mod.aurora.color.accent", "#7c6af7", st, "--zen-primary-color");
  colorRow(doc, el, "Ohraničení", "mod.aurora.color.border", "#3a3a5c", st, "všechny border");

  buildSectionHeading(doc, el, "Toolbar");
  colorRow(doc, el, "Pozadí toolbaru", "mod.aurora.color.toolbar_bg", "#16162a", st, "#navigator-toolbox");

  buildSectionHeading(doc, el, "Panely (nav bar · záložkový · menu)");
  colorRow(doc, el, "Pozadí panelů",          "mod.aurora.color.panel_bg",    "#1a1a2e", st, "#TabsToolbar #nav-bar menupopup");
  colorRow(doc, el, "Tlačítka aktivní",        "mod.aurora.color.button_bg",   "#2a2a4e", st, "toolbarbutton[checked]");
  colorRow(doc, el, "Tlačítka hover",          "mod.aurora.color.button_hover","#3a3a6e", st, "toolbarbutton:hover menuitem:hover");

  buildSectionHeading(doc, el, "Sidebar");
  colorRow(doc, el, "Pozadí sidebaru", "mod.aurora.color.sidebar_bg", "#12122a", st, "#sidebar-box");

  buildSectionHeading(doc, el, "Workspace strip (levý panel se spaces)");
  colorRow(doc, el, "Pozadí stripu",   "mod.aurora.color.workspace_strip_bg",    "#0d0d1e", st, "#zen-appcontent-navbar");
  colorRow(doc, el, "Dot neaktivní",   "mod.aurora.color.workspace_dot",          "#3a3a6c", st, ".zen-workspace-dot");
  colorRow(doc, el, "Dot aktivní",     "mod.aurora.color.workspace_dot_active",   "#7c6af7", st, ".zen-workspace-dot[selected]");

  buildSectionHeading(doc, el, "Záložky (.tabbrowser-tab)");
  colorRow(doc, el, "Aktivní záložka",  "mod.aurora.color.tab_active_bg",  "#2a2a4e", st, "[selected] .tab-background");
  colorRow(doc, el, "Neaktivní záložka","mod.aurora.color.tab_inactive_bg","#1a1a2e", st, ".tab-background");
  colorRow(doc, el, "Hover záložky",    "mod.aurora.color.tab_hover_bg",   "#252550", st, ":hover .tab-background");
  colorRow(doc, el, "✕ tlačítko hover", "mod.aurora.color.tab_close_hover","#ff6b6b", st, ".tab-close-button:hover");

  buildSectionHeading(doc, el, "URL lišta (#urlbar)");
  colorRow(doc, el, "Pozadí",          "mod.aurora.color.urlbar_bg",    "#1e1e3a", st, "#urlbar-background");
  colorRow(doc, el, "Ohraničení idle", "mod.aurora.color.urlbar_border","#3a3a6c", st, "#urlbar border");
  colorRow(doc, el, "Ohraničení focus","mod.aurora.color.urlbar_focus", "#7c6af7", st, "#urlbar:focus-within");

  buildSectionHeading(doc, el, "Obsah a ostatní");
  colorRow(doc, el, "Pozadí obsahu (#browser)", "mod.aurora.color.browser_bg",  "#0f0f1a", st, "#browser");
  colorRow(doc, el, "Výběr textu (::selection)","mod.aurora.color.selection_bg","#7c6af740",st, "::selection");
  colorRow(doc, el, "Scrollbar (thumb)",         "mod.aurora.color.scrollbar",  "#3a3a6c", st, "thumb");
}

// ── 3. Spaces ─────────────────────────────────────────────────────────────────

function buildSpaces(doc: Document, el: HTMLElement, st: HTMLElement): void {
  el.appendChild(note(doc, "Přepíše globální barvy jen pro vybraný Space. Prázdné pole = globální hodnota."));
  const tabBar = doc.createElement("div"); tabBar.className = "ao-space-tabs"; el.appendChild(tabBar);
  const contents: HTMLElement[] = [];
  for (let i = 0; i < SPACE_COUNT; i++) {
    const tab = doc.createElement("button"); tab.className = "ao-space-tab" + (i === 0 ? " active" : "");
    tab.textContent = `Space ${i + 1}`; tabBar.appendChild(tab);
    const content = doc.createElement("div"); content.className = "ao-space-content" + (i === 0 ? " active" : "");
    for (const sc of SPACE_COLORS)
      colorRow(doc, content, sc.label, spaceColorPref(i, sc.key), sc.default, st);

    // Reset button per space
    const resetBtn = doc.createElement("button"); resetBtn.className = "ao-nav-btn danger";
    resetBtn.style.cssText = "margin-top:12px;width:100%;";
    resetBtn.textContent = `⟳ Reset Space ${i + 1} na výchozí`;
    const spaceIdx = i;
    resetBtn.addEventListener("click", () => {
      for (const sc of SPACE_COLORS)
        try { Services.prefs.clearUserPref(spaceColorPref(spaceIdx, sc.key)); } catch {}
      status(st, `Space ${spaceIdx + 1} resetován`, "ok");
    });
    content.appendChild(resetBtn);
    el.appendChild(content); contents.push(content);
  }
  const tabs = Array.from(tabBar.querySelectorAll<HTMLButtonElement>(".ao-space-tab"));
  tabBar.addEventListener("click", (e) => {
    const t = (e.target as HTMLElement).closest<HTMLButtonElement>(".ao-space-tab"); if (!t) return;
    const idx = tabs.indexOf(t);
    tabs.forEach((tb, ti) => tb.classList.toggle("active", ti === idx));
    contents.forEach((c, ci) => c.classList.toggle("active", ci === idx));
  });
}

// ── 4. Pozadí ─────────────────────────────────────────────────────────────────

function buildBackground(doc: Document, el: HTMLElement, _st: HTMLElement): void {
  el.appendChild(note(doc, "Obrázek se zobrazuje za #browser::before. Průhlednost a blur panelů nastav v sekci Efekty."));

  buildSectionHeading(doc, el, "Obrázek pozadí (#browser::before)");

  // URL row with file picker button
  const urlRow = doc.createElement("div"); urlRow.className = "aoc-row";
  const urlLbl = doc.createElement("span"); urlLbl.className = "aoc-label"; urlLbl.textContent = "URL nebo cesta k souboru";
  const urlInp = doc.createElement("input") as HTMLInputElement;
  urlInp.type = "text"; urlInp.className = "aoc-input";
  urlInp.value = getPref("mod.aurora.image.browser_bg", "");
  urlInp.placeholder = "https://... nebo file:///C:/...";
  const fileBtn = doc.createElement("button"); fileBtn.className = "ao-nav-btn"; fileBtn.textContent = "📂";
  fileBtn.title = "Vybrat soubor";
  fileBtn.style.cssText = "flex-shrink:0;padding:5px 10px;";
  fileBtn.addEventListener("click", () => {
    const inp = doc.createElement("input") as HTMLInputElement;
    inp.type = "file"; inp.accept = "image/*"; inp.style.display = "none";
    inp.addEventListener("change", () => {
      const f = inp.files?.[0]; if (!f) return;
      // In chrome context, we can get the path via File.mozFullPath (Gecko extension)
      const path = (f as File & { mozFullPath?: string }).mozFullPath ?? "";
      const url = path ? `file:///${path.replace(/\\/g, "/")}` : URL.createObjectURL(f);
      urlInp.value = url; setPref("mod.aurora.image.browser_bg", url);
    });
    doc.body.appendChild(inp); inp.click(); setTimeout(() => inp.remove(), 30_000);
  });
  urlInp.addEventListener("change", () => setPref("mod.aurora.image.browser_bg", urlInp.value.trim()));
  urlRow.appendChild(urlLbl); urlRow.appendChild(urlInp); urlRow.appendChild(fileBtn);
  el.appendChild(urlRow);

  buildSelect(doc, el, "Velikost (background-size)", "mod.aurora.image.bg_size", [
    { label: "Cover — vyplní plochu",     value: "cover"     },
    { label: "Contain — celý viditelný",  value: "contain"   },
    { label: "Auto — přirozená velikost", value: "auto"      },
    { label: "100% šířka",                value: "100% auto" },
  ], "cover");
  buildSelect(doc, el, "Pozice (background-position)", "mod.aurora.image.bg_position", [
    { label: "Střed",  value: "center" }, { label: "Nahoře", value: "top"   },
    { label: "Dole",   value: "bottom" }, { label: "Vlevo",  value: "left"  },
    { label: "Vpravo", value: "right"  },
  ], "center");
  buildSlider(doc, el, "Rozmazání obrázku (filter: blur)", "mod.aurora.image.bg_blur",    0, 30, 1,    "px", 0);
  buildSlider(doc, el, "Průhlednost obrázku (opacity)",    "mod.aurora.image.bg_opacity",  0,  1, 0.05, "",  1);

  buildSectionHeading(doc, el, "Startovací stránka");
  buildToggle(doc, el, "Vždy otevřít domovskou stránku na nové záložce", "mod.aurora.newtab_homepage", false, (v) => {
    try {
      if (v) {
        Services.prefs.setIntPref("browser.newtabpage.enabled", 0);
        Services.prefs.setStringPref("browser.newtab.url", Services.prefs.getStringPref("browser.startup.homepage", "about:home"));
      } else {
        Services.prefs.setIntPref("browser.newtabpage.enabled", 1);
      }
    } catch {}
  });
}

// ── 5. Rozměry & Styly ────────────────────────────────────────────────────────

function buildLayout(doc: Document, el: HTMLElement, _st: HTMLElement): void {
  buildSectionHeading(doc, el, "Zapnutí stylování prvků");
  el.appendChild(note(doc, "Pokud prvek vypneš, Aurora ho nechá v Zen výchozím stylu."));
  buildToggle(doc, el, "Záložky (.tabbrowser-tab)",                    "mod.aurora.style.tabs",            true);
  buildToggle(doc, el, "URL lišta (#urlbar)",                          "mod.aurora.style.urlbar",          true);
  buildToggle(doc, el, "Sidebar (#sidebar-box)",                       "mod.aurora.style.sidebar",         true);
  buildToggle(doc, el, "Toolbar (#navigator-toolbox, #TabsToolbar…)",  "mod.aurora.style.toolbar",         true);
  buildToggle(doc, el, "Workspace strip (#zen-appcontent-navbar)",     "mod.aurora.style.workspace_strip", true);
  buildToggle(doc, el, "Popup menu (menupopup, menuitem)",             "mod.aurora.style.menus",           true);

  buildSectionHeading(doc, el, "Záložky (.tabbrowser-tab)");
  buildSlider(doc, el, "Výška záložky (min/max-height)",   "mod.aurora.layout.tab_height",       20, 60, 1, "px", 36);
  buildSlider(doc, el, "Zaoblení záložky (border-radius)", "mod.aurora.layout.tab_border_radius", 0, 20, 1, "px", 8);

  buildSectionHeading(doc, el, "Panely (#TabsToolbar · #nav-bar · #PersonalToolbar)");
  buildSlider(doc, el, "Výška panelů (min-height)", "mod.aurora.layout.toolbar_height", 32, 64, 1, "px", 40);

  buildSectionHeading(doc, el, "Sidebar (#sidebar-box)");
  buildSlider(doc, el, "Šířka sidebaru (min/max-width)", "mod.aurora.layout.sidebar_width", 120, 400, 4, "px", 200);

  buildSectionHeading(doc, el, "Workspace strip (#zen-appcontent-navbar)");
  buildSlider(doc, el, "Šířka stripu (min/max-width)", "mod.aurora.layout.workspace_strip_width", 20, 80, 2, "px", 36);

  buildSectionHeading(doc, el, "Zaoblení");
  buildSlider(doc, el, "Zaoblení panelů / URL (#urlbar, menupopup)", "mod.aurora.layout.panel_border_radius",  0, 24, 1, "px", 8);
  buildSlider(doc, el, "Zaoblení tlačítek / položek menu",           "mod.aurora.layout.button_border_radius", 0, 20, 1, "px", 6);

  buildSectionHeading(doc, el, "Ohraničení");
  buildSlider(doc, el, "Tloušťka (border-width — vše)", "mod.aurora.layout.border_width", 0, 4, 1, "px", 1);

  buildSectionHeading(doc, el, "Rozvržení toolbaru");
  buildSelect(doc, el, "Režim toolbaru", "mod.aurora.layout.toolbar_mode", [
    { label: "Více panelů (výchozí)",    value: "multi"     },
    { label: "Jeden panel (bez záložkové lišty)", value: "single" },
    { label: "Sbalený (auto-hide)",      value: "collapsed" },
  ], "multi");
  buildSectionHeading(doc, el, "Hitbox horní lišty (při auto-hide)");
  el.appendChild(note(doc, "Zvětší neviditelnou oblast nahoře, která aktivuje vysunutí lišty."));
  buildSlider(doc, el, "Výška hitboxu", "mod.aurora.layout.hitbox_height", 4, 40, 2, "px", 4);
}

// ── 6. Efekty ─────────────────────────────────────────────────────────────────

function buildEffects(doc: Document, el: HTMLElement, st: HTMLElement): void {
  buildSectionHeading(doc, el, "Průhlednost panelů");
  el.appendChild(note(doc, "Ovlivňuje #navigator-toolbox, #sidebar-box, #zen-appcontent-navbar, menupopup. Blur = frosted glass."));
  buildSlider(doc, el, "Průhlednost panelů (rgba alpha)", "mod.aurora.effect.panel_opacity", 0, 1,  0.05, "", 1);
  buildSlider(doc, el, "Blur panelů (backdrop-filter)",   "mod.aurora.effect.panel_blur",   0, 30, 1,    "px", 0);

  buildSectionHeading(doc, el, "No Gap Mod");
  el.appendChild(note(doc, "Odstraní mezery a zaoblení okolo obsahu prohlížeče. Portováno z github.com/Comp-Tech-Guy/No-Gaps v2.5.2."));
  buildToggle(doc, el, "Zapnout No Gap Mod", "mod.aurora.layout.no_gap_mod", false);
  buildSelect(doc, el, "Mód aplikace", "mod.aurora.layout.no_gap_mode", [
    { label: "Oba (compact + non-compact) — výchozí", value: "all" },
    { label: "Pouze kompaktní mód",                   value: "compact" },
  ], "all");
  buildToggle(doc, el, "Odstranit zvýraznění split záložek (outline: none)", "mod.aurora.layout.no_gap_remove_split_highlight", false);
  buildToggle(doc, el, "Odstranit box-shadow kontejneru obsahu",             "mod.aurora.layout.no_gap_remove_box_shadow",       false);
  colorRow(doc, el, "Barva pozadí tabpanels", "mod.aurora.layout.no_gap_bg", "#000000", st, "#tabbrowser-tabpanels");

  buildSectionHeading(doc, el, "Stíny a záře");
  buildToggle(doc, el, "Stín aktivní záložky (.tabbrowser-tab[selected])",    "mod.aurora.effect.tab_shadow",  false);
  buildToggle(doc, el, "Záře akcentu při hoveru a aktivní záložce (glow)",    "mod.aurora.effect.accent_glow", false);

  buildSectionHeading(doc, el, "Styl ohraničení (border-style — vše)");
  buildSelect(doc, el, "Styl", "mod.aurora.effect.panel_border_style", [
    { label: "Plné (solid)",         value: "solid"  },
    { label: "Tečky (dotted)",       value: "dotted" },
    { label: "Přerušované (dashed)", value: "dashed" },
    { label: "Žádné (none)",         value: "none"   },
  ], "solid");

  buildSectionHeading(doc, el, "Animace (CSS transitions — vše)");
  buildSelect(doc, el, "Rychlost (transition-duration)", "mod.aurora.animation_speed", [
    { label: "Vypnuté — žádné (0s)",  value: "none"   },
    { label: "Pomalé (0.45s)",        value: "slow"   },
    { label: "Normální (0.18s)",      value: "normal" },
    { label: "Rychlé (0.08s)",        value: "fast"   },
  ], "normal");
  buildSelect(doc, el, "Křivka (transition-timing-function)", "mod.aurora.animation.easing", [
    { label: "Material ease (výchozí)",  value: "ease"                           },
    { label: "Linear",                   value: "linear"                         },
    { label: "Ease Out",                 value: "ease-out"                       },
    { label: "Spring (překmit)",         value: "cubic-bezier(0.34,1.56,0.64,1)" },
  ], "ease");
}

// ── 7. Písmo & Text ───────────────────────────────────────────────────────────

function buildFontText(doc: Document, el: HTMLElement, st: HTMLElement): void {
  buildSectionHeading(doc, el, "Písmo (záložky, panely, URL lišta)");
  buildTextInput(doc, el, "Rodina (font-family)", "mod.aurora.font.family", "system-ui, sans-serif", "inherit");
  buildSlider(doc, el,    "Velikost (font-size)",  "mod.aurora.font.size",   10, 20, 1, "px", 13);
  buildSelect(doc, el, "Tučnost (font-weight)", "mod.aurora.font.weight", [
    { label: "300 — tenké",   value: "300" }, { label: "400 — normální", value: "400" },
    { label: "500 — střední", value: "500" }, { label: "600 — semibold", value: "600" },
    { label: "700 — tučné",   value: "700" },
  ], "400");

  buildSectionHeading(doc, el, "Barvy textu");
  // Vždy zobrazeny — toggle pouze říká, zda CSS engine použije individuální hodnoty
  // nebo zkopíruje panel_text na záložky i urlbar
  colorRow(doc, el, "Text panelů (toolbar, sidebar, menu)", "mod.aurora.color.panel_text",  "#e0e0ff", st, "#TabsToolbar toolbarbutton menuitem");
  colorRow(doc, el, "Text záložek (.tab-label)",            "mod.aurora.color.tab_text",    "#c0c0e0", st, ".tab-label .tab-text");
  colorRow(doc, el, "Text URL lišty (#urlbar-input)",       "mod.aurora.color.urlbar_text", "#e0e0ff", st, "#urlbar-input");
  buildToggle(doc, el, "Individuální barvy textu (záložky a urlbar mají vlastní barvu, jinak se kopíruje barva panelů)", "mod.aurora.style.individual_text_colors", false);
}

// ── 8. Přístupnost ────────────────────────────────────────────────────────────

function buildAccessibility(doc: Document, el: HTMLElement, _st: HTMLElement): void {
  buildSectionHeading(doc, el, "Barevné schéma obsahu (prefers-color-scheme)");
  el.appendChild(note(doc, "Nastaví jak webové stránky vidí váš preferovaný barevný motiv. Ovlivňuje weby které reagují na dark/light mode."));
  buildSelect(doc, el, "Schéma obsahu", "mod.aurora.accessibility.color_scheme", [
    { label: "Dle systému (auto)",  value: "auto"  },
    { label: "Tmavý (dark)",        value: "dark"  },
    { label: "Světlý (light)",      value: "light" },
  ], "auto", (v) => {
    try {
      const map: Record<string, number> = { auto: 0, dark: 1, light: 2 };
      Services.prefs.setIntPref("browser.theme.content-preferred-color-scheme", map[v] ?? 0);
    } catch {}
  });

  buildSectionHeading(doc, el, "Vysoký kontrast prohlížeče");
  buildSelect(doc, el, "Kontrast", "mod.aurora.accessibility.web_contrast", [
    { label: "Vypnuto",           value: "off"        },
    { label: "Vysoký kontrast tmavý",  value: "high-dark"  },
    { label: "Vysoký kontrast světlý", value: "high-light" },
  ], "off");

  buildSectionHeading(doc, el, "Simulace barvosleposti");
  el.appendChild(note(doc, "Aplikuje CSS filtr na celý prohlížeč. Pomáhá při návrhu přístupného UI nebo pro uživatele s vadou barvocitu."));
  buildSelect(doc, el, "Typ barvosleposti", "mod.aurora.accessibility.color_blind_mode", [
    { label: "Vypnuto",                     value: "off"          },
    { label: "Protanopie (nedostatek červené)", value: "protanopia"   },
    { label: "Deuteranopie (nedostatek zelené)", value: "deuteranopia" },
    { label: "Tritanopie (nedostatek modré)",    value: "tritanopia"   },
    { label: "Achromatopsie (bez barev)",        value: "achromatopsia"},
  ], "off");
}

// ── 9. Presety ────────────────────────────────────────────────────────────────

const ALL_STRING_PREFS = [
  ...GLOBAL_COLORS.map(c => c.pref),
  "mod.aurora.image.browser_bg","mod.aurora.image.bg_size","mod.aurora.image.bg_position",
  "mod.aurora.image.bg_blur","mod.aurora.image.bg_opacity",
  "mod.aurora.effect.panel_opacity","mod.aurora.effect.panel_blur","mod.aurora.effect.panel_border_style",
  "mod.aurora.font.family","mod.aurora.font.size","mod.aurora.font.weight",
  "mod.aurora.layout.tab_height","mod.aurora.layout.tab_border_radius",
  "mod.aurora.layout.panel_border_radius","mod.aurora.layout.button_border_radius",
  "mod.aurora.layout.sidebar_width","mod.aurora.layout.workspace_strip_width",
  "mod.aurora.layout.toolbar_height","mod.aurora.layout.border_width",
  "mod.aurora.layout.toolbar_mode","mod.aurora.layout.hitbox_height",
  "mod.aurora.layout.no_gap_bg","mod.aurora.layout.no_gap_mode",
  "mod.aurora.animation_speed","mod.aurora.animation.easing",
];
const ALL_BOOL_PREFS = [
  "mod.aurora.effect.tab_shadow","mod.aurora.effect.accent_glow",
  "mod.aurora.layout.no_gap_mod",
  "mod.aurora.layout.no_gap_remove_split_highlight","mod.aurora.layout.no_gap_remove_box_shadow",
  "mod.aurora.style.tabs","mod.aurora.style.urlbar","mod.aurora.style.sidebar",
  "mod.aurora.style.toolbar","mod.aurora.style.workspace_strip","mod.aurora.style.menus",
  "mod.aurora.style.individual_text_colors",
];

function capturePreset(): string {
  const data: Record<string, string | boolean> = {};
  for (const p of ALL_STRING_PREFS) { try { data[p] = Services.prefs.getStringPref(p, ""); } catch {} }
  for (const p of ALL_BOOL_PREFS)   { try { data[p] = Services.prefs.getBoolPref(p, false); } catch {} }
  return JSON.stringify(data);
}
function applyPresetData(json: string): void {
  const data = JSON.parse(json) as Record<string, string | boolean>;
  for (const [p, v] of Object.entries(data)) {
    if (!p.startsWith("mod.aurora.")) continue;
    if (typeof v === "boolean") { try { Services.prefs.setBoolPref(p, v); } catch {} }
    else { try { Services.prefs.setStringPref(p, v as string); } catch {} }
  }
}
function listPresets(): { idx: number; name: string; ts: number; json: string }[] {
  const result = [];
  for (let i = 1; i <= 20; i++) {
    try {
      const raw = Services.prefs.getStringPref(`mod.aurora.preset.${i}`, "");
      if (!raw) continue;
      const meta = JSON.parse(raw) as { name: string; ts: number; data: string };
      result.push({ idx: i, name: meta.name, ts: meta.ts, json: meta.data });
    } catch {}
  }
  return result;
}
function savePreset(name: string): number {
  for (let i = 1; i <= 20; i++) {
    const raw = Services.prefs.getStringPref(`mod.aurora.preset.${i}`, "");
    if (!raw) {
      Services.prefs.setStringPref(`mod.aurora.preset.${i}`, JSON.stringify({ name, ts: Date.now(), data: capturePreset() }));
      return i;
    }
  }
  return -1;
}
function updatePresetMeta(idx: number, name: string, data: string): void {
  try { Services.prefs.setStringPref(`mod.aurora.preset.${idx}`, JSON.stringify({ name, ts: Date.now(), data })); } catch {}
}
function deletePreset(idx: number): void { try { Services.prefs.clearUserPref(`mod.aurora.preset.${idx}`); } catch {} }

function buildPresets(doc: Document, el: HTMLElement, st: HTMLElement): void {
  buildSectionHeading(doc, el, "Uložené profily");
  const listEl = doc.createElement("div"); listEl.className = "ao-preset-list"; el.appendChild(listEl);

  function refresh(): void {
    listEl.innerHTML = "";
    const presets = listPresets();
    if (!presets.length) {
      const e = doc.createElement("div"); e.style.cssText = "color:#5550aa;font-size:12px;padding:10px 0;";
      e.textContent = "Žádné uložené profily."; listEl.appendChild(e); return;
    }
    for (const p of presets) {
      const item = doc.createElement("div"); item.className = "ao-preset-item";
      const swRow = doc.createElement("div"); swRow.className = "ao-preset-swatch-row";
      try {
        const data = JSON.parse(p.json) as Record<string, string>;
        for (const key of ["mod.aurora.color.accent","mod.aurora.color.panel_bg","mod.aurora.color.tab_active_bg"]) {
          const sw = doc.createElement("div"); sw.className = "ao-preset-swatch"; sw.style.background = data[key] || "#333"; swRow.appendChild(sw);
        }
      } catch {}

      const nameView = doc.createElement("span"); nameView.className = "ao-preset-name-view"; nameView.textContent = p.name;
      const nameEdit = doc.createElement("input") as HTMLInputElement; nameEdit.type = "text";
      nameEdit.className = "ao-preset-name-edit"; nameEdit.value = p.name; nameEdit.style.display = "none";

      const time = doc.createElement("span"); time.className = "ao-preset-time";
      time.textContent = new Date(p.ts).toLocaleDateString("cs-CZ");

      const loadBtn = doc.createElement("button"); loadBtn.className = "ao-preset-btn load"; loadBtn.textContent = "Načíst";
      loadBtn.addEventListener("click", () => { applyPresetData(p.json); status(st, `Načten "${p.name}"`, "ok"); });

      const renBtn = doc.createElement("button"); renBtn.className = "ao-preset-btn"; renBtn.textContent = "✎";
      renBtn.title = "Přejmenovat";
      let editing = false;
      renBtn.addEventListener("click", () => {
        editing = !editing;
        nameView.style.display = editing ? "none" : "";
        nameEdit.style.display = editing ? "" : "none";
        if (!editing) {
          const n = nameEdit.value.trim() || p.name;
          nameView.textContent = n;
          updatePresetMeta(p.idx, n, p.json);
          status(st, `Přejmenován na "${n}"`, "ok");
        } else { nameEdit.focus(); nameEdit.select(); }
        renBtn.textContent = editing ? "✓" : "✎";
      });
      nameEdit.addEventListener("keydown", (e) => { if (e.key === "Enter") renBtn.click(); if (e.key === "Escape") { editing = true; renBtn.click(); } });

      const overBtn = doc.createElement("button"); overBtn.className = "ao-preset-btn save"; overBtn.textContent = "↑ Přepsat";
      overBtn.addEventListener("click", () => {
        updatePresetMeta(p.idx, p.name, capturePreset()); status(st, `Přepsán "${p.name}"`, "ok");
      });

      const delBtn = doc.createElement("button"); delBtn.className = "ao-preset-btn del"; delBtn.textContent = "✕";
      delBtn.addEventListener("click", () => { deletePreset(p.idx); refresh(); });

      item.appendChild(swRow); item.appendChild(nameView); item.appendChild(nameEdit);
      item.appendChild(time); item.appendChild(loadBtn); item.appendChild(renBtn);
      item.appendChild(overBtn); item.appendChild(delBtn);
      listEl.appendChild(item);
    }
  }
  refresh();

  buildSectionHeading(doc, el, "Uložit aktuální nastavení");
  const saveRow = doc.createElement("div"); saveRow.className = "ao-preset-save-row";
  const nameIn = doc.createElement("input") as HTMLInputElement; nameIn.type = "text";
  nameIn.className = "ao-preset-name-in"; nameIn.placeholder = "Název profilu";
  const saveBtn = doc.createElement("button"); saveBtn.className = "ao-preset-save-btn"; saveBtn.textContent = "Uložit";
  saveBtn.addEventListener("click", () => {
    const n = nameIn.value.trim() || `Profil ${Date.now()}`;
    if (savePreset(n) < 0) { status(st, "Maximum 20 profilů dosaženo", "err"); return; }
    nameIn.value = ""; refresh(); status(st, `Uložen "${n}"`, "ok");
  });
  saveRow.appendChild(nameIn); saveRow.appendChild(saveBtn); el.appendChild(saveRow);

  buildSectionHeading(doc, el, "Export / Import (.txt)");
  const ioRow = doc.createElement("div"); ioRow.style.cssText = "display:flex;gap:8px;";
  const expBtn = doc.createElement("button"); expBtn.className = "ao-nav-btn"; expBtn.textContent = "💾 Export";
  expBtn.addEventListener("click", () => exportTxt(doc, st));
  const impBtn = doc.createElement("button"); impBtn.className = "ao-nav-btn"; impBtn.textContent = "📂 Import";
  impBtn.addEventListener("click", () => importTxt(doc, st));
  ioRow.appendChild(expBtn); ioRow.appendChild(impBtn); el.appendChild(ioRow);
}

function exportTxt(doc: Document, st: HTMLElement): void {
  const lines = ["# Aurora Theme Export", `# ${new Date().toLocaleString("cs-CZ")}`, ""];
  for (const p of ALL_STRING_PREFS) lines.push(`${p}=${getPref(p, "")}`);
  for (const p of ALL_BOOL_PREFS)   lines.push(`${p}=${getBoolPref(p, false)}`);
  try {
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = doc.createElement("a") as HTMLAnchorElement;
    a.href = url; a.download = `aurora-${Date.now()}.txt`;
    doc.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    status(st, "Soubor stažen", "ok");
  } catch (e) { status(st, `Chyba: ${e}`, "err"); }
}
function importTxt(doc: Document, st: HTMLElement): void {
  const inp = doc.createElement("input") as HTMLInputElement;
  inp.type = "file"; inp.accept = ".txt,text/plain"; inp.style.display = "none";
  inp.addEventListener("change", () => {
    const f = inp.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = (e) => {
      let ok = 0, bad = 0;
      for (const line of (e.target?.result as string).split(/\r?\n/)) {
        const l = line.trim(); if (!l || l.startsWith("#")) continue;
        const eq = l.indexOf("="); if (eq < 0) continue;
        const p = l.slice(0, eq).trim(), v = l.slice(eq + 1).trim();
        if (!p.startsWith("mod.aurora.")) { bad++; continue; }
        if (v === "true" || v === "false")
          { try { Services.prefs.setBoolPref(p, v === "true"); ok++; } catch { bad++; } }
        else
          { try { Services.prefs.setStringPref(p, v); ok++; } catch { bad++; } }
      }
      status(st, bad ? `Načteno ${ok}, přeskočeno ${bad}` : `Načteno ${ok} hodnot`, ok > 0 ? "ok" : "err");
    };
    r.readAsText(f);
  });
  doc.body.appendChild(inp); inp.click(); setTimeout(() => inp.remove(), 30_000);
}

// ── 10. O módu ────────────────────────────────────────────────────────────────

function buildAbout(doc: Document, el: HTMLElement, st: HTMLElement): void {
  const card = doc.createElement("div"); card.className = "ao-about-card";
  const t = doc.createElement("div"); t.className = "ao-about-title"; t.textContent = "✦ Aurora";
  const sub = doc.createElement("div"); sub.className = "ao-about-sub"; sub.textContent = "Kompletní UI overhaul pro Zen Browser · v0.2.0 · Rockynio-dot";
  card.appendChild(t); card.appendChild(sub); el.appendChild(card);

  buildSectionHeading(doc, el, "Reset barev");
  const resetColorsBtn = doc.createElement("button"); resetColorsBtn.className = "ao-nav-btn danger";
  resetColorsBtn.style.cssText = "width:100%;margin-bottom:8px;";
  resetColorsBtn.textContent = "⟳  Reset barev na Aurora výchozí (fialový dark)";
  resetColorsBtn.addEventListener("click", () => {
    if (!confirm("Opravdu resetovat všechny barvy na Aurora výchozí?")) return;
    for (const [pref, val] of Object.entries(AURORA_COLOR_DEFAULTS))
      { try { Services.prefs.setStringPref(pref, val); } catch {} }
    for (let i = 0; i < SPACE_COUNT; i++)
      for (const sc of SPACE_COLORS)
        try { Services.prefs.clearUserPref(spaceColorPref(i, sc.key)); } catch {}
    status(st, "Barvy resetovány", "ok");
  });
  el.appendChild(resetColorsBtn);

  buildSectionHeading(doc, el, "Reset veškerých nastavení");
  const resetAllBtn = doc.createElement("button"); resetAllBtn.className = "ao-nav-btn danger";
  resetAllBtn.style.cssText = "width:100%;";
  resetAllBtn.textContent = "⟳  Reset VEŠKERÝCH nastavení Aurora";
  resetAllBtn.addEventListener("click", () => {
    if (!confirm("Opravdu resetovat veškerá nastavení Aurora?")) return;
    for (const p of [...ALL_STRING_PREFS, ...ALL_BOOL_PREFS, ...Object.keys(AURORA_COLOR_DEFAULTS)])
      { try { Services.prefs.clearUserPref(p); } catch {} }
    for (let i = 1; i <= 20; i++) { try { Services.prefs.clearUserPref(`mod.aurora.preset.${i}`); } catch {} }
    status(st, "Veškerá nastavení resetována", "ok");
  });
  el.appendChild(resetAllBtn);
}

// ── Nav ───────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "quick",       icon: "🌟", label: "Rychlé"       },
  { id: "colors",      icon: "🎨", label: "Barvy"        },
  { id: "spaces",      icon: "🌌", label: "Spaces"       },
  { id: "background",  icon: "🖼️", label: "Pozadí"       },
  { id: "layout",      icon: "📐", label: "Rozměry"      },
  { id: "effects",     icon: "✨", label: "Efekty"       },
  { id: "fonttext",    icon: "🔤", label: "Písmo & Text" },
  { id: "access",      icon: "♿", label: "Přístupnost"  },
  { id: "presets",     icon: "💾", label: "Presety"      },
  { id: "about",       icon: "ℹ️", label: "O módu"       },
] as const;
type NavId = typeof NAV_ITEMS[number]["id"];

const SECTION_BUILDERS: Record<NavId, (doc: Document, el: HTMLElement, st: HTMLElement) => void> = {
  quick:      buildQuick,
  colors:     buildColors,
  spaces:     buildSpaces,
  background: buildBackground,
  layout:     buildLayout,
  effects:    buildEffects,
  fonttext:   buildFontText,
  access:     buildAccessibility,
  presets:    buildPresets,
  about:      buildAbout,
};

// ── Main ──────────────────────────────────────────────────────────────────────

function buildUI(doc: Document): void {
  const style = doc.createElement("style"); style.textContent = CSS; doc.head.appendChild(style);
  initColorPicker(doc);

  const nav = doc.createElement("div"); nav.className = "ao-nav";
  const main = doc.createElement("div"); main.className = "ao-main";

  const logo = doc.createElement("div"); logo.className = "ao-nav-logo"; logo.textContent = "✦ Aurora";
  nav.appendChild(logo);

  const header     = doc.createElement("div"); header.className = "ao-header";
  const hTitle     = doc.createElement("div"); hTitle.className = "ao-header-title";
  const hSub       = doc.createElement("span"); hSub.className = "ao-header-sub";
  hTitle.appendChild(doc.createTextNode("✦ Aurora")); hTitle.appendChild(hSub);
  const closeBtn   = doc.createElement("button"); closeBtn.className = "ao-header-close";
  closeBtn.textContent = "✕ Zavřít  (Esc)";
  closeBtn.addEventListener("click", () => window.close());
  header.appendChild(hTitle); header.appendChild(closeBtn);

  const content = doc.createElement("div"); content.className = "ao-content";
  const st = doc.createElement("div"); st.className = "ao-status"; st.style.marginBottom = "4px";
  content.appendChild(st);

  main.appendChild(header); main.appendChild(content);
  doc.body.appendChild(nav); doc.body.appendChild(main);

  const sections: Partial<Record<NavId, HTMLElement>> = {};
  const navEls: HTMLElement[] = [];
  let activeId: NavId = "quick";

  function showSection(id: NavId): void {
    sections[activeId]?.classList.remove("active");
    navEls.find(n => n.dataset.id === activeId)?.classList.remove("active");
    if (!sections[id]) {
      const sec = doc.createElement("div"); sec.className = "ao-section"; sec.dataset.section = id;
      SECTION_BUILDERS[id](doc, sec, st);
      content.appendChild(sec);
      sections[id] = sec;
    }
    sections[id]!.classList.add("active");
    navEls.find(n => n.dataset.id === id)?.classList.add("active");
    activeId = id;
    const item = NAV_ITEMS.find(n => n.id === id);
    if (item) hSub.textContent = `— ${item.label}`;
    content.scrollTop = 0;
  }

  for (const item of NAV_ITEMS) {
    const ni = doc.createElement("div"); ni.className = "ao-nav-item"; ni.dataset.id = item.id;
    const ic = doc.createElement("span"); ic.className = "ao-nav-icon"; ic.textContent = item.icon;
    const lb = doc.createElement("span"); lb.textContent = item.label;
    ni.appendChild(ic); ni.appendChild(lb);
    ni.addEventListener("click", () => showSection(item.id as NavId));
    nav.appendChild(ni); navEls.push(ni);
  }

  showSection("quick");
  doc.addEventListener("keydown", (e) => { if (e.key === "Escape") window.close(); });
}

(window as Window & { _auroraSettings?: boolean })._auroraSettings = true;
buildUI(document);

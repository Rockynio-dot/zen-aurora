import { extractPalette, type ColorPalette } from "./palette.ts";
import { mergeTheme, loadTheme } from "../core/state.ts";
import { applyTheme } from "../core/cssEngine.ts";

let dynamicTimer: ReturnType<typeof setInterval> | null = null;

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}

function lerpHex(hexA: string, hexB: string, t: number): string {
  const [ar, ag, ab] = hexA.slice(1).match(/.{2}/g)!.map((h) => parseInt(h, 16));
  const [br, bg, bb] = hexB.slice(1).match(/.{2}/g)!.map((h) => parseInt(h, 16));
  return "#" + [lerp(ar, br, t), lerp(ag, bg, t), lerp(ab, bb, t)]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");
}

// Warm evening palette vs cool daytime palette
const DAY_PALETTE: ColorPalette = {
  dominant: "#4a90d9",
  primary: "#6aaff0",
  secondary: "#3a7bc8",
  surface: "#1a2035",
  onSurface: "#dde8ff",
};

const NIGHT_PALETTE: ColorPalette = {
  dominant: "#c0622a",
  primary: "#e07840",
  secondary: "#a04c1a",
  surface: "#1f1510",
  onSurface: "#ffe0cc",
};

function getDayNightFactor(): number {
  const h = new Date().getHours();
  // 0 = full day (noon), 1 = full night (midnight)
  // Transition: 6-9 morning, 18-21 evening
  if (h >= 9 && h < 18) return 0;
  if (h >= 0 && h < 6) return 1;
  if (h >= 18 && h < 21) return (h - 18) / 3;
  return 1 - (h - 6) / 3; // 6-9
}

function paletteToColors(p: ColorPalette) {
  return {
    accent: p.primary,
    panelBg: p.surface,
    panelText: p.onSurface,
    border: p.secondary,
    browserBg: p.surface,
  };
}

async function applyMaterialTheme(doc: Document): Promise<void> {
  const theme = loadTheme();
  if (!theme.images.browserBg) return;

  const palette = await extractPalette(theme.images.browserBg);
  const merged = mergeTheme({ colors: paletteToColors(palette) });
  applyTheme(merged, doc);
}

function applyDayNight(doc: Document): void {
  const t = getDayNightFactor();
  const colors = {
    accent: lerpHex(DAY_PALETTE.primary, NIGHT_PALETTE.primary, t),
    panelBg: lerpHex(DAY_PALETTE.surface, NIGHT_PALETTE.surface, t),
    panelText: lerpHex(DAY_PALETTE.onSurface, NIGHT_PALETTE.onSurface, t),
    border: lerpHex(DAY_PALETTE.secondary, NIGHT_PALETTE.secondary, t),
    browserBg: lerpHex(DAY_PALETTE.surface, NIGHT_PALETTE.surface, t),
  };
  const merged = mergeTheme({ colors });
  applyTheme(merged, doc);
}

export function initDynamicTheme(doc: Document): void {
  stopDynamicTheme();
  const theme = loadTheme();

  if (theme.dynamicMode === "material") {
    applyMaterialTheme(doc);
    // Re-apply when theme changes (e.g. new image uploaded) — polling every 5 min
    dynamicTimer = setInterval(() => applyMaterialTheme(doc), 5 * 60 * 1000);
  } else if (theme.dynamicMode === "daynight") {
    applyDayNight(doc);
    // Update every 10 minutes
    dynamicTimer = setInterval(() => applyDayNight(doc), 10 * 60 * 1000);
  }
}

export function stopDynamicTheme(): void {
  if (dynamicTimer !== null) {
    clearInterval(dynamicTimer);
    dynamicTimer = null;
  }
}

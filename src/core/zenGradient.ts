// Faithful port of Zen Browser's "Upravit motiv" (Edit theme) gradient engine.
// Source: zen-browser/desktop  src/zen/spaces/ZenGradientGenerator.mjs
//
// This implements the Windows / non-transparent (no Mica, no macOS vibrancy,
// non-legacy) code path — the correct default for a portable mod. From 1–3
// colours + an opacity it produces the same gradient strings and derived
// accent / text / colour-scheme values that Zen sets on its background layers.

export type RGB = [number, number, number];

export interface ZenTheme {
  background: string;   // --zen-main-browser-background   (content backdrop)
  toolbar: string;      // --zen-main-browser-background-toolbar
  primaryColor: string; // --zen-primary-color             (rgb(...))
  textColor: string;    // --toolbox-textcolor             (rgba(...))
  colorScheme: "dark" | "light";
  dominant: RGB;        // the resolved dominant colour (for palette seeding)
}

const ROTATION = -45;

// ── Colour conversion ─────────────────────────────────────────────────────────

export function hexToRgb(hex: string): RGB {
  let h = hex.startsWith("#") ? hex.slice(1) : hex;
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return [
    parseInt(h.slice(0, 2), 16) || 0,
    parseInt(h.slice(2, 4), 16) || 0,
    parseInt(h.slice(4, 6), 16) || 0,
  ];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
  }
  const l = (min + max) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return [h * 60, s, l];
}

function hueToRgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function hslToRgb(h: number, s: number, l: number): RGB {
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// ── Contrast / blending ───────────────────────────────────────────────────────

function luminance([r, g, b]: RGB): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrastRatio(rgb1: RGB, rgb2: RGB): number {
  const l1 = luminance(rgb1), l2 = luminance(rgb2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// rgb1 weighted by (percentage/100), rgb2 by the remainder — matches Zen.
function blendColors(rgb1: RGB, rgb2: RGB, percentage: number): RGB {
  const p = percentage / 100;
  return [
    Math.round(rgb1[0] * p + rgb2[0] * (1 - p)),
    Math.round(rgb1[1] * p + rgb2[1] * (1 - p)),
    Math.round(rgb1[2] * p + rgb2[2] * (1 - p)),
  ];
}

// ── Zen toolbar base & single-colour resolution ───────────────────────────────

function toolbarBaseRaw(isDark: boolean): RGB {
  return isDark ? [23, 23, 26] : [240, 240, 244];
}

// Windows non-transparent path: tint the picked colour onto the toolbar base by
// opacity, return an opaque rgba string. (blendWithWhiteOverlay is a no-op here.)
function singleColor(color: RGB, opacity: number, isDark: boolean): string {
  const blended = blendColors(color, toolbarBaseRaw(isDark), opacity * 100);
  return `rgba(${blended[0]}, ${blended[1]}, ${blended[2]}, 1)`;
}

// ── Gradient string builder (getGradient) ─────────────────────────────────────

function getGradient(colors: RGB[], opacity: number, isDark: boolean, forToolbar: boolean): string {
  if (colors.length === 0) {
    if (forToolbar) {
      const b = toolbarBaseRaw(isDark);
      return `rgba(${b[0]}, ${b[1]}, ${b[2]}, 1)`;
    }
    return isDark ? "#131313" : "#e9e9e9";
  }
  if (colors.length === 1) {
    return singleColor(colors[0], opacity, isDark);
  }
  if (colors.length === 2) {
    const c0 = singleColor(colors[0], opacity, isDark);
    const c1 = singleColor(colors[1], opacity, isDark);
    if (!forToolbar) {
      return [
        `linear-gradient(${ROTATION}deg, ${c1} 0%, transparent 100%)`,
        `linear-gradient(${ROTATION + 180}deg, ${c0} 0%, transparent 100%)`,
      ].reverse().join(", ");
    }
    return `linear-gradient(${ROTATION}deg, ${c1} 0%, ${c0} 100%)`;
  }
  // 3 colours — layered linear + two radials
  const color1 = singleColor(colors[2], opacity, isDark);
  const color2 = singleColor(colors[0], opacity, isDark);
  const color3 = singleColor(colors[1], opacity, isDark);
  return [
    `linear-gradient(-5deg, ${color1} 10%, transparent 80%)`,
    `radial-gradient(circle at 95% 0%, ${color3} 0%, transparent 75%)`,
    `radial-gradient(circle at 0% 0%, ${color2} 10%, transparent 70%)`,
  ].join(", ");
}

// ── Derived UI colours ────────────────────────────────────────────────────────

// White text used in dark mode, black in light. Alpha 0.8 like Zen.
function toolbarColor(isDark: boolean): [number, number, number, number] {
  return isDark ? [255, 255, 255, 0.8] : [0, 0, 0, 0.8];
}

// Pick the scheme whose text colour contrasts better against the shown bg.
function shouldBeDarkMode(dominant: RGB, opacity: number, windowDark: boolean): boolean {
  // Composite the dominant colour over the toolbar base as actually displayed.
  const bg = blendColors(toolbarBaseRaw(windowDark), dominant, (1 - opacity) * 100);
  const white = toolbarColor(true);   // text for dark mode
  const black = toolbarColor(false);  // text for light mode
  const whiteOnBg = blendColors(bg, [white[0], white[1], white[2]], (1 - white[3]) * 100);
  const blackOnBg = blendColors(bg, [black[0], black[1], black[2]], (1 - black[3]) * 100);
  return contrastRatio(bg, whiteOnBg) > contrastRatio(bg, blackOnBg);
}

// getAccentColorForUI — dark mode keeps raw; light boosts saturation & lightness.
function accentForUI(dominant: RGB, contentDark: boolean, windowDark: boolean): string {
  if (contentDark) return `rgb(${dominant[0]}, ${dominant[1]}, ${dominant[2]})`;
  const [h, s, l] = rgbToHsl(dominant[0], dominant[1], dominant[2]);
  const saturation = Math.min(1, s + 0.3);
  const targetLightness = windowDark ? 0.62 : 0.42;
  const lightness = l * 0.4 + targetLightness * 0.6;
  const [r, g, b] = hslToRgb(h / 360, saturation, lightness);
  return `rgb(${r}, ${g}, ${b})`;
}

// ── Public entry ──────────────────────────────────────────────────────────────

export function generateZenTheme(hexColors: string[], opacity: number, windowDark: boolean): ZenTheme {
  const colors = hexColors.filter(Boolean).slice(0, 3).map(hexToRgb);
  const dominant: RGB = colors[0] ?? (windowDark ? [40, 40, 46] : [220, 220, 228]);
  const contentDark = colors.length ? shouldBeDarkMode(dominant, opacity, windowDark) : windowDark;
  const text = toolbarColor(contentDark);
  return {
    background:   getGradient(colors, opacity, windowDark, false),
    toolbar:      getGradient(colors, opacity, windowDark, true),
    primaryColor: accentForUI(dominant, contentDark, windowDark),
    textColor:    `rgba(${text[0]}, ${text[1]}, ${text[2]}, ${text[3]})`,
    colorScheme:  contentDark ? "dark" : "light",
    dominant,
  };
}

// Convenience for the settings UI: dominant colour as hex (palette seed).
export function rgbToHex([r, g, b]: RGB): string {
  return "#" + [r, g, b]
    .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"))
    .join("");
}

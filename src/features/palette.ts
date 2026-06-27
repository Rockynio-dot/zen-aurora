export interface ColorPalette {
  dominant: string;
  primary: string;
  secondary: string;
  surface: string;
  onSurface: string;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance(r: number, g: number, b: number): number {
  const sRGB = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

function darken(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(
    Math.round(r * (1 - factor)),
    Math.round(g * (1 - factor)),
    Math.round(b * (1 - factor))
  );
}

function lighten(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(
    Math.min(255, Math.round(r + (255 - r) * factor)),
    Math.min(255, Math.round(g + (255 - g) * factor)),
    Math.min(255, Math.round(b + (255 - b) * factor))
  );
}

/**
 * Extracts a color palette from a base64 image string using median cut.
 * Runs on a small OffscreenCanvas for speed.
 */
export async function extractPalette(base64Image: string): Promise<ColorPalette> {
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = base64Image;
  });

  const SIZE = 64;
  const canvas = new OffscreenCanvas(SIZE, SIZE);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, SIZE, SIZE);
  const data = ctx.getImageData(0, 0, SIZE, SIZE).data;

  // Collect pixels, skip near-black and near-white
  const pixels: [number, number, number][] = [];
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const lum = luminance(r, g, b);
    if (lum > 0.05 && lum < 0.95) pixels.push([r, g, b]);
  }

  if (!pixels.length) {
    return {
      dominant: "#7c6af7",
      primary: "#9d8fff",
      secondary: "#6a58e0",
      surface: "#1a1a2e",
      onSurface: "#e0e0ff",
    };
  }

  // Simple median cut: find dominant color as mean of most saturated cluster
  const dominant = medianCut(pixels, 1)[0];
  const dominantHex = rgbToHex(...dominant);

  const lum = luminance(...dominant);
  const isDark = lum < 0.3;

  return {
    dominant: dominantHex,
    primary: isDark ? lighten(dominantHex, 0.3) : darken(dominantHex, 0.2),
    secondary: isDark ? lighten(dominantHex, 0.15) : darken(dominantHex, 0.35),
    surface: isDark ? darken(dominantHex, 0.7) : lighten(dominantHex, 0.85),
    onSurface: isDark ? lighten(dominantHex, 0.9) : darken(dominantHex, 0.8),
  };
}

function medianCut(
  pixels: [number, number, number][],
  depth: number
): [number, number, number][] {
  if (depth === 0 || pixels.length === 0) {
    const avg = pixels.reduce(
      ([ar, ag, ab], [r, g, b]) => [ar + r, ag + g, ab + b],
      [0, 0, 0]
    ).map((v) => Math.round(v / pixels.length)) as [number, number, number];
    return [avg];
  }

  // Find channel with biggest range
  const ranges = [0, 1, 2].map((ch) => {
    const vals = pixels.map((p) => p[ch]);
    return Math.max(...vals) - Math.min(...vals);
  });
  const channel = ranges.indexOf(Math.max(...ranges)) as 0 | 1 | 2;

  pixels.sort((a, b) => a[channel] - b[channel]);
  const mid = Math.floor(pixels.length / 2);

  return [
    ...medianCut(pixels.slice(0, mid), depth - 1),
    ...medianCut(pixels.slice(mid), depth - 1),
  ];
}

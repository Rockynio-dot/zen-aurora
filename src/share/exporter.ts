import { loadTheme, type AuroraTheme } from "../core/state.ts";

interface ExportBundle {
  version: string;
  exportedAt: string;
  theme: AuroraTheme;
}

export function exportTheme(): string {
  const bundle: ExportBundle = {
    version: "0.1.0",
    exportedAt: new Date().toISOString(),
    theme: loadTheme(),
  };
  return JSON.stringify(bundle, null, 2);
}

export function downloadTheme(filename = "aurora-theme.json"): void {
  const json = exportTheme();
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

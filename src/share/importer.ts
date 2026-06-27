import { saveTheme, DEFAULT_THEME, type AuroraTheme } from "../core/state.ts";

interface ExportBundle {
  version: string;
  exportedAt: string;
  theme: AuroraTheme;
}

function isValidTheme(obj: unknown): obj is AuroraTheme {
  if (typeof obj !== "object" || obj === null) return false;
  const t = obj as Record<string, unknown>;
  return (
    typeof t.colors === "object" &&
    typeof t.sounds === "object" &&
    typeof t.animations === "object" &&
    typeof t.dynamicMode === "string"
  );
}

export function importTheme(json: string): AuroraTheme {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("Neplatný JSON soubor tématu.");
  }

  let themeData: unknown;

  // Support both raw AuroraTheme and ExportBundle format
  if (
    typeof parsed === "object" &&
    parsed !== null &&
    "theme" in (parsed as object)
  ) {
    themeData = (parsed as ExportBundle).theme;
  } else {
    themeData = parsed;
  }

  if (!isValidTheme(themeData)) {
    throw new Error("Soubor neobsahuje platné Aurora téma.");
  }

  // Merge with defaults to fill any missing keys from older versions
  const merged: AuroraTheme = {
    ...DEFAULT_THEME,
    ...themeData,
    colors: { ...DEFAULT_THEME.colors, ...themeData.colors },
    images: { ...DEFAULT_THEME.images, ...themeData.images },
    sounds: { ...DEFAULT_THEME.sounds, ...themeData.sounds },
    animations: { ...DEFAULT_THEME.animations, ...themeData.animations },
    folderIcons: { ...DEFAULT_THEME.folderIcons, ...themeData.folderIcons },
  };

  saveTheme(merged);
  return merged;
}

export async function importThemeFromFile(): Promise<AuroraTheme> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return reject(new Error("Žádný soubor nebyl vybrán."));
      const reader = new FileReader();
      reader.onload = () => {
        try {
          resolve(importTheme(reader.result as string));
        } catch (e) {
          reject(e);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  });
}

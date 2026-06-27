export interface AuroraTheme {
  colors: {
    panelBg: string;
    panelText: string;
    border: string;
    browserBg: string;
    accent: string;
  };
  images: {
    browserBg: string | null;  // base64 or null
    newTabBg: string | null;
  };
  sounds: {
    enabled: boolean;
    pack: string;  // "default" | "mechanical" | "soft" | "custom"
    customPack: Record<string, string> | null;  // event -> base64
  };
  animations: {
    speed: "none" | "slow" | "normal" | "fast";
  };
  dynamicMode: "off" | "material" | "daynight";
  folderIcons: Record<string, string>;  // bookmarkGuid -> icon url
}

export const DEFAULT_THEME: AuroraTheme = {
  colors: {
    panelBg: "#1a1a2e",
    panelText: "#e0e0ff",
    border: "#3a3a5c",
    browserBg: "#0f0f1a",
    accent: "#7c6af7",
  },
  images: {
    browserBg: null,
    newTabBg: null,
  },
  sounds: {
    enabled: false,
    pack: "default",
    customPack: null,
  },
  animations: {
    speed: "normal",
  },
  dynamicMode: "off",
  folderIcons: {},
};

const STATE_PREF = "mod.aurora.theme_json";

export function loadTheme(): AuroraTheme {
  try {
    const raw = Services.prefs.getStringPref(STATE_PREF, "");
    if (raw) {
      return { ...DEFAULT_THEME, ...JSON.parse(raw) };
    }
  } catch (e) {
    dump(`[Aurora] Failed to load theme: ${e}\n`);
  }
  return { ...DEFAULT_THEME };
}

export function saveTheme(theme: AuroraTheme): void {
  try {
    Services.prefs.setStringPref(STATE_PREF, JSON.stringify(theme));
  } catch (e) {
    dump(`[Aurora] Failed to save theme: ${e}\n`);
  }
}

export function mergeTheme(partial: Partial<AuroraTheme>): AuroraTheme {
  const current = loadTheme();
  const merged = {
    ...current,
    ...partial,
    colors: { ...current.colors, ...(partial.colors ?? {}) },
    images: { ...current.images, ...(partial.images ?? {}) },
    sounds: { ...current.sounds, ...(partial.sounds ?? {}) },
    animations: { ...current.animations, ...(partial.animations ?? {}) },
    folderIcons: { ...current.folderIcons, ...(partial.folderIcons ?? {}) },
  };
  saveTheme(merged);
  return merged;
}

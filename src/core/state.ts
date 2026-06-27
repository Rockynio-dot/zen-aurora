export interface AuroraTheme {
  colors: {
    panelBg: string;
    panelText: string;
    border: string;
    browserBg: string;
    accent: string;
  };
  images: {
    browserBg: string | null;
    newTabBg: string | null;
  };
  sounds: {
    enabled: boolean;
    pack: string;
    customPack: Record<string, string> | null;
  };
  animations: {
    speed: "none" | "slow" | "normal" | "fast";
  };
  dynamicMode: "off" | "material" | "daynight";
  folderIcons: Record<string, string>;
}

function getPref(key: string, fallback: string): string {
  try {
    return Services.prefs.getStringPref(key, fallback);
  } catch {
    return fallback;
  }
}

function getBoolPref(key: string, fallback: boolean): boolean {
  try {
    return Services.prefs.getBoolPref(key, fallback);
  } catch {
    return fallback;
  }
}

export function loadTheme(): AuroraTheme {
  const speed = getPref("mod.aurora.animation_speed", "normal") as AuroraTheme["animations"]["speed"];
  const dynamicMode = getPref("mod.aurora.dynamic_mode", "off") as AuroraTheme["dynamicMode"];

  return {
    colors: {
      panelBg:    getPref("mod.aurora.color.panel_bg",   "#1a1a2e"),
      panelText:  getPref("mod.aurora.color.panel_text", "#e0e0ff"),
      border:     getPref("mod.aurora.color.border",     "#3a3a5c"),
      browserBg:  getPref("mod.aurora.color.browser_bg", "#0f0f1a"),
      accent:     getPref("mod.aurora.color.accent",     "#7c6af7"),
    },
    images: {
      browserBg: getPref("mod.aurora.image.browser_bg", "") || null,
      newTabBg:  getPref("mod.aurora.image.newtab_bg",  "") || null,
    },
    sounds: {
      enabled:    getBoolPref("mod.aurora.sounds_enabled", false),
      pack:       getPref("mod.aurora.sound_pack", "default"),
      customPack: null,
    },
    animations: {
      speed: ["none", "slow", "normal", "fast"].includes(speed) ? speed : "normal",
    },
    dynamicMode: ["off", "material", "daynight"].includes(dynamicMode) ? dynamicMode : "off",
    folderIcons: {},
  };
}

// Legacy — kept for export/import
export function saveTheme(theme: AuroraTheme): void {
  Services.prefs.setStringPref("mod.aurora.color.panel_bg",   theme.colors.panelBg);
  Services.prefs.setStringPref("mod.aurora.color.panel_text", theme.colors.panelText);
  Services.prefs.setStringPref("mod.aurora.color.border",     theme.colors.border);
  Services.prefs.setStringPref("mod.aurora.color.browser_bg", theme.colors.browserBg);
  Services.prefs.setStringPref("mod.aurora.color.accent",     theme.colors.accent);
  Services.prefs.setStringPref("mod.aurora.animation_speed",  theme.animations.speed);
  Services.prefs.setBoolPref("mod.aurora.sounds_enabled",     theme.sounds.enabled);
  Services.prefs.setStringPref("mod.aurora.dynamic_mode",     theme.dynamicMode);
}

export function mergeTheme(partial: Partial<AuroraTheme>): AuroraTheme {
  const current = loadTheme();
  const merged: AuroraTheme = {
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

export const DEFAULT_THEME: AuroraTheme = loadTheme();

export interface ColorField {
  pref: string;
  label: string;
  default: string;
}

export interface SpaceColorField {
  key: string;
  label: string;
  default: string;
}

export const GLOBAL_COLORS: ColorField[] = [
  { pref: "mod.aurora.color.panel_bg",       label: "Pozadí panelů",          default: "#1a1a2e" },
  { pref: "mod.aurora.color.toolbar_bg",     label: "Pozadí toolbaru",         default: "#16162a" },
  { pref: "mod.aurora.color.sidebar_bg",     label: "Pozadí sidebaru",         default: "#12122a" },
  { pref: "mod.aurora.color.panel_text",     label: "Text v panelech",         default: "#e0e0ff" },
  { pref: "mod.aurora.color.border",         label: "Ohraničení",              default: "#3a3a5c" },
  { pref: "mod.aurora.color.accent",         label: "Akcent",                  default: "#7c6af7" },
  { pref: "mod.aurora.color.tab_active_bg",  label: "Aktivní záložka",         default: "#2a2a4e" },
  { pref: "mod.aurora.color.tab_inactive_bg",label: "Neaktivní záložka",       default: "#1a1a2e" },
  { pref: "mod.aurora.color.tab_text",       label: "Text záložek",            default: "#c0c0e0" },
  { pref: "mod.aurora.color.tab_close_hover",label: "Zavřít záložku (hover)",  default: "#ff6b6b" },
  { pref: "mod.aurora.color.tab_hover_bg",   label: "Záložka hover pozadí",    default: "#252550" },
  { pref: "mod.aurora.color.urlbar_bg",      label: "URL lišta pozadí",        default: "#1e1e3a" },
  { pref: "mod.aurora.color.urlbar_text",    label: "URL lišta text",          default: "#e0e0ff" },
  { pref: "mod.aurora.color.urlbar_border",  label: "URL lišta ohraničení",    default: "#3a3a6c" },
  { pref: "mod.aurora.color.urlbar_focus",   label: "URL lišta fokus",         default: "#7c6af7" },
  { pref: "mod.aurora.color.browser_bg",     label: "Pozadí prohlížeče",       default: "#0f0f1a" },
  { pref: "mod.aurora.color.selection_bg",   label: "Výběr textu",             default: "#7c6af740" },
  { pref: "mod.aurora.color.scrollbar",      label: "Scrollbar",               default: "#3a3a6c" },
  { pref: "mod.aurora.color.button_bg",      label: "Tlačítka pozadí",         default: "#2a2a4e" },
  { pref: "mod.aurora.color.button_hover",   label: "Tlačítka hover",          default: "#3a3a6e" },
];

export const SPACE_COLORS: SpaceColorField[] = [
  { key: "accent",       label: "Akcent",           default: "" },
  { key: "panel_bg",     label: "Pozadí panelů",    default: "" },
  { key: "toolbar_bg",   label: "Pozadí toolbaru",  default: "" },
  { key: "sidebar_bg",   label: "Pozadí sidebaru",  default: "" },
  { key: "tab_active_bg",label: "Aktivní záložka",  default: "" },
];

export const SPACE_COUNT = 6;

export function spaceColorPref(spaceIdx: number, key: string): string {
  return `mod.aurora.space.${spaceIdx + 1}.${key}`;
}

// All prefs that are colors (for import/export)
export function allColorPrefs(): string[] {
  const global = GLOBAL_COLORS.map((c) => c.pref);
  const spaces: string[] = [];
  for (let i = 0; i < SPACE_COUNT; i++) {
    for (const sc of SPACE_COLORS) {
      spaces.push(spaceColorPref(i, sc.key));
    }
  }
  return [...global, ...spaces];
}

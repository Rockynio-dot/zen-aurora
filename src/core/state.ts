export interface AuroraTheme {
  colors: {
    panelBg: string;
    toolbarBg: string;
    sidebarBg: string;
    panelText: string;
    tabText: string;
    urlbarText: string;
    border: string;
    accent: string;
    tabActiveBg: string;
    tabInactiveBg: string;
    tabCloseHover: string;
    tabHoverBg: string;
    urlbarBg: string;
    urlbarBorder: string;
    urlbarFocus: string;
    browserBg: string;
    selectionBg: string;
    scrollbar: string;
    buttonBg: string;
    buttonHover: string;
    workspaceStripBg: string;
    workspaceDot: string;
    workspaceDotActive: string;
  };
  images: {
    browserBg: string | null;
    bgSize: string;
    bgPosition: string;
    bgBlur: string;
    bgOpacity: string;
  };
  typography: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
  };
  layout: {
    tabHeight: string;
    tabBorderRadius: string;
    panelBorderRadius: string;
    buttonBorderRadius: string;
    sidebarWidth: string;
    workspaceStripWidth: string;
    toolbarHeight: string;
    borderWidth: string;
    noGapMod: boolean;
    noGapBg: string;
    hitboxHeight: string;
    toolbarMode: string; // "multi" | "single" | "collapsed"
  };
  effects: {
    panelOpacity: string;
    panelBlur: string;
    tabShadow: boolean;
    accentGlow: boolean;
    panelBorderStyle: string;
  };
  style: {
    tabs: boolean;
    urlbar: boolean;
    sidebar: boolean;
    toolbar: boolean;
    workspaceStrip: boolean;
    menus: boolean;
    individualTextColors: boolean;
  };
  animations: {
    speed: string;
    easing: string;
  };
  accessibility: {
    colorScheme: string;    // "auto" | "light" | "dark"
    colorBlindMode: string; // "off" | "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia"
    webContrast: string;    // "off" | "high-dark" | "high-light"
  };
}

function s(key: string, def: string): string {
  try { return Services.prefs.getStringPref(key, def) || def; } catch { return def; }
}
function b(key: string, def: boolean): boolean {
  try { return Services.prefs.getBoolPref(key, def); } catch { return def; }
}

export function loadTheme(): AuroraTheme {
  const useIndividual = b("mod.aurora.style.individual_text_colors", false);
  return {
    colors: {
      panelBg:       s("mod.aurora.color.panel_bg",       "#1a1a2e"),
      toolbarBg:     s("mod.aurora.color.toolbar_bg",     "#16162a"),
      sidebarBg:     s("mod.aurora.color.sidebar_bg",     "#12122a"),
      panelText:     s("mod.aurora.color.panel_text",     "#e0e0ff"),
      tabText:       useIndividual ? s("mod.aurora.color.tab_text",    "#c0c0e0") : s("mod.aurora.color.panel_text", "#e0e0ff"),
      urlbarText:    useIndividual ? s("mod.aurora.color.urlbar_text", "#e0e0ff") : s("mod.aurora.color.panel_text", "#e0e0ff"),
      border:        s("mod.aurora.color.border",         "#3a3a5c"),
      accent:        s("mod.aurora.color.accent",         "#7c6af7"),
      tabActiveBg:   s("mod.aurora.color.tab_active_bg",  "#2a2a4e"),
      tabInactiveBg: s("mod.aurora.color.tab_inactive_bg","#1a1a2e"),
      tabCloseHover: s("mod.aurora.color.tab_close_hover","#ff6b6b"),
      tabHoverBg:    s("mod.aurora.color.tab_hover_bg",   "#252550"),
      urlbarBg:      s("mod.aurora.color.urlbar_bg",      "#1e1e3a"),
      urlbarBorder:  s("mod.aurora.color.urlbar_border",  "#3a3a6c"),
      urlbarFocus:   s("mod.aurora.color.urlbar_focus",   "#7c6af7"),
      browserBg:     s("mod.aurora.color.browser_bg",     "#0f0f1a"),
      selectionBg:   s("mod.aurora.color.selection_bg",   "#7c6af740"),
      scrollbar:     s("mod.aurora.color.scrollbar",      "#3a3a6c"),
      buttonBg:      s("mod.aurora.color.button_bg",      "#2a2a4e"),
      buttonHover:   s("mod.aurora.color.button_hover",   "#3a3a6e"),
      workspaceStripBg:    s("mod.aurora.color.workspace_strip_bg",    "#0d0d1e"),
      workspaceDot:        s("mod.aurora.color.workspace_dot",          "#3a3a6c"),
      workspaceDotActive:  s("mod.aurora.color.workspace_dot_active",   "#7c6af7"),
    },
    images: {
      browserBg:  s("mod.aurora.image.browser_bg", "") || null,
      bgSize:     s("mod.aurora.image.bg_size",     "cover"),
      bgPosition: s("mod.aurora.image.bg_position", "center"),
      bgBlur:     s("mod.aurora.image.bg_blur",     "0px"),
      bgOpacity:  s("mod.aurora.image.bg_opacity",  "1.0"),
    },
    typography: {
      fontFamily: s("mod.aurora.font.family", "inherit"),
      fontSize:   s("mod.aurora.font.size",   "13px"),
      fontWeight: s("mod.aurora.font.weight", "400"),
    },
    layout: {
      tabHeight:           s("mod.aurora.layout.tab_height",           "36px"),
      tabBorderRadius:     s("mod.aurora.layout.tab_border_radius",    "8px"),
      panelBorderRadius:   s("mod.aurora.layout.panel_border_radius",  "8px"),
      buttonBorderRadius:  s("mod.aurora.layout.button_border_radius", "6px"),
      sidebarWidth:        s("mod.aurora.layout.sidebar_width",        "200px"),
      workspaceStripWidth: s("mod.aurora.layout.workspace_strip_width","36px"),
      toolbarHeight:       s("mod.aurora.layout.toolbar_height",       "40px"),
      borderWidth:         s("mod.aurora.layout.border_width",         "1px"),
      noGapMod:            b("mod.aurora.layout.no_gap_mod",           false),
      noGapBg:             s("mod.aurora.layout.no_gap_bg",            "#000000"),
      hitboxHeight:        s("mod.aurora.layout.hitbox_height",        "4px"),
      toolbarMode:         s("mod.aurora.layout.toolbar_mode",         "multi"),
    },
    effects: {
      panelOpacity:     s("mod.aurora.effect.panel_opacity",      "1.0"),
      panelBlur:        s("mod.aurora.effect.panel_blur",         "0px"),
      tabShadow:        b("mod.aurora.effect.tab_shadow",         false),
      accentGlow:       b("mod.aurora.effect.accent_glow",        false),
      panelBorderStyle: s("mod.aurora.effect.panel_border_style", "solid"),
    },
    style: {
      tabs:                 b("mod.aurora.style.tabs",                  true),
      urlbar:               b("mod.aurora.style.urlbar",                true),
      sidebar:              b("mod.aurora.style.sidebar",               true),
      toolbar:              b("mod.aurora.style.toolbar",               true),
      workspaceStrip:       b("mod.aurora.style.workspace_strip",       true),
      menus:                b("mod.aurora.style.menus",                 true),
      individualTextColors: b("mod.aurora.style.individual_text_colors",false),
    },
    animations: {
      speed:  s("mod.aurora.animation_speed",  "normal"),
      easing: s("mod.aurora.animation.easing", "ease"),
    },
    accessibility: {
      colorScheme:    s("mod.aurora.accessibility.color_scheme",     "auto"),
      colorBlindMode: s("mod.aurora.accessibility.color_blind_mode", "off"),
      webContrast:    s("mod.aurora.accessibility.web_contrast",     "off"),
    },
  };
}

export function saveTheme(theme: AuroraTheme): void {
  const p = Services.prefs;
  const ss = (k: string, v: string)  => p.setStringPref(k, v);
  const sb = (k: string, v: boolean) => p.setBoolPref(k, v);

  ss("mod.aurora.color.panel_bg",       theme.colors.panelBg);
  ss("mod.aurora.color.toolbar_bg",     theme.colors.toolbarBg);
  ss("mod.aurora.color.sidebar_bg",     theme.colors.sidebarBg);
  ss("mod.aurora.color.panel_text",     theme.colors.panelText);
  ss("mod.aurora.color.tab_text",       theme.colors.tabText);
  ss("mod.aurora.color.urlbar_text",    theme.colors.urlbarText);
  ss("mod.aurora.color.border",         theme.colors.border);
  ss("mod.aurora.color.accent",         theme.colors.accent);
  ss("mod.aurora.color.tab_active_bg",  theme.colors.tabActiveBg);
  ss("mod.aurora.color.tab_inactive_bg",theme.colors.tabInactiveBg);
  ss("mod.aurora.color.tab_close_hover",theme.colors.tabCloseHover);
  ss("mod.aurora.color.tab_hover_bg",   theme.colors.tabHoverBg);
  ss("mod.aurora.color.urlbar_bg",      theme.colors.urlbarBg);
  ss("mod.aurora.color.urlbar_border",  theme.colors.urlbarBorder);
  ss("mod.aurora.color.urlbar_focus",   theme.colors.urlbarFocus);
  ss("mod.aurora.color.browser_bg",     theme.colors.browserBg);
  ss("mod.aurora.color.selection_bg",   theme.colors.selectionBg);
  ss("mod.aurora.color.scrollbar",      theme.colors.scrollbar);
  ss("mod.aurora.color.button_bg",      theme.colors.buttonBg);
  ss("mod.aurora.color.button_hover",   theme.colors.buttonHover);
  ss("mod.aurora.color.workspace_strip_bg",   theme.colors.workspaceStripBg);
  ss("mod.aurora.color.workspace_dot",        theme.colors.workspaceDot);
  ss("mod.aurora.color.workspace_dot_active", theme.colors.workspaceDotActive);
  ss("mod.aurora.image.bg_size",        theme.images.bgSize);
  ss("mod.aurora.image.bg_position",    theme.images.bgPosition);
  ss("mod.aurora.image.bg_blur",        theme.images.bgBlur);
  ss("mod.aurora.image.bg_opacity",     theme.images.bgOpacity);
  ss("mod.aurora.font.family",          theme.typography.fontFamily);
  ss("mod.aurora.font.size",            theme.typography.fontSize);
  ss("mod.aurora.font.weight",          theme.typography.fontWeight);
  ss("mod.aurora.layout.tab_height",           theme.layout.tabHeight);
  ss("mod.aurora.layout.tab_border_radius",    theme.layout.tabBorderRadius);
  ss("mod.aurora.layout.panel_border_radius",  theme.layout.panelBorderRadius);
  ss("mod.aurora.layout.button_border_radius", theme.layout.buttonBorderRadius);
  ss("mod.aurora.layout.sidebar_width",        theme.layout.sidebarWidth);
  ss("mod.aurora.layout.workspace_strip_width",theme.layout.workspaceStripWidth);
  ss("mod.aurora.layout.toolbar_height",       theme.layout.toolbarHeight);
  ss("mod.aurora.layout.border_width",         theme.layout.borderWidth);
  sb("mod.aurora.layout.no_gap_mod",           theme.layout.noGapMod);
  ss("mod.aurora.layout.no_gap_bg",            theme.layout.noGapBg);
  ss("mod.aurora.layout.hitbox_height",        theme.layout.hitboxHeight);
  ss("mod.aurora.layout.toolbar_mode",         theme.layout.toolbarMode);
  ss("mod.aurora.effect.panel_opacity",        theme.effects.panelOpacity);
  ss("mod.aurora.effect.panel_blur",           theme.effects.panelBlur);
  sb("mod.aurora.effect.tab_shadow",           theme.effects.tabShadow);
  sb("mod.aurora.effect.accent_glow",          theme.effects.accentGlow);
  ss("mod.aurora.effect.panel_border_style",   theme.effects.panelBorderStyle);
  sb("mod.aurora.style.tabs",                  theme.style.tabs);
  sb("mod.aurora.style.urlbar",                theme.style.urlbar);
  sb("mod.aurora.style.sidebar",               theme.style.sidebar);
  sb("mod.aurora.style.toolbar",               theme.style.toolbar);
  sb("mod.aurora.style.workspace_strip",       theme.style.workspaceStrip);
  sb("mod.aurora.style.menus",                 theme.style.menus);
  sb("mod.aurora.style.individual_text_colors",theme.style.individualTextColors);
  ss("mod.aurora.animation_speed",             theme.animations.speed);
  ss("mod.aurora.animation.easing",            theme.animations.easing);
  ss("mod.aurora.accessibility.color_scheme",     theme.accessibility.colorScheme);
  ss("mod.aurora.accessibility.color_blind_mode", theme.accessibility.colorBlindMode);
  ss("mod.aurora.accessibility.web_contrast",     theme.accessibility.webContrast);
}

// Default Aurora color values (used by reset)
export const AURORA_COLOR_DEFAULTS: Record<string, string> = {
  "mod.aurora.color.panel_bg":             "#1a1a2e",
  "mod.aurora.color.toolbar_bg":           "#16162a",
  "mod.aurora.color.sidebar_bg":           "#12122a",
  "mod.aurora.color.panel_text":           "#e0e0ff",
  "mod.aurora.color.tab_text":             "#c0c0e0",
  "mod.aurora.color.urlbar_text":          "#e0e0ff",
  "mod.aurora.color.border":               "#3a3a5c",
  "mod.aurora.color.accent":               "#7c6af7",
  "mod.aurora.color.tab_active_bg":        "#2a2a4e",
  "mod.aurora.color.tab_inactive_bg":      "#1a1a2e",
  "mod.aurora.color.tab_close_hover":      "#ff6b6b",
  "mod.aurora.color.tab_hover_bg":         "#252550",
  "mod.aurora.color.urlbar_bg":            "#1e1e3a",
  "mod.aurora.color.urlbar_border":        "#3a3a6c",
  "mod.aurora.color.urlbar_focus":         "#7c6af7",
  "mod.aurora.color.browser_bg":           "#0f0f1a",
  "mod.aurora.color.selection_bg":         "#7c6af740",
  "mod.aurora.color.scrollbar":            "#3a3a6c",
  "mod.aurora.color.button_bg":            "#2a2a4e",
  "mod.aurora.color.button_hover":         "#3a3a6e",
  "mod.aurora.color.workspace_strip_bg":   "#0d0d1e",
  "mod.aurora.color.workspace_dot":        "#3a3a6c",
  "mod.aurora.color.workspace_dot_active": "#7c6af7",
};

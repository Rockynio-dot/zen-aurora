export interface AuroraTheme {
  colors: {
    panelBg: string;
    toolbarBg: string;
    sidebarBg: string;
    panelText: string;
    border: string;
    accent: string;
    tabActiveBg: string;
    tabInactiveBg: string;
    tabText: string;
    tabCloseHover: string;
    tabHoverBg: string;
    urlbarBg: string;
    urlbarText: string;
    urlbarBorder: string;
    urlbarFocus: string;
    browserBg: string;
    selectionBg: string;
    scrollbar: string;
    buttonBg: string;
    buttonHover: string;
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
    toolbarHeight: string;
    borderWidth: string;
  };
  effects: {
    panelOpacity: string;
    panelBlur: string;
    tabShadow: boolean;
    accentGlow: boolean;
    panelBorderStyle: string;
  };
  sounds: {
    enabled: boolean;
  };
  animations: {
    speed: string;
    easing: string;
  };
  dynamicMode: "off" | "material" | "daynight" | "tab_accent";
}

function s(key: string, def: string): string {
  try { return Services.prefs.getStringPref(key, def) || def; } catch { return def; }
}
function b(key: string, def: boolean): boolean {
  try { return Services.prefs.getBoolPref(key, def); } catch { return def; }
}

export function loadTheme(): AuroraTheme {
  return {
    colors: {
      panelBg:       s("mod.aurora.color.panel_bg",      "#1a1a2e"),
      toolbarBg:     s("mod.aurora.color.toolbar_bg",    "#16162a"),
      sidebarBg:     s("mod.aurora.color.sidebar_bg",    "#12122a"),
      panelText:     s("mod.aurora.color.panel_text",    "#e0e0ff"),
      border:        s("mod.aurora.color.border",        "#3a3a5c"),
      accent:        s("mod.aurora.color.accent",        "#7c6af7"),
      tabActiveBg:   s("mod.aurora.color.tab_active_bg", "#2a2a4e"),
      tabInactiveBg: s("mod.aurora.color.tab_inactive_bg","#1a1a2e"),
      tabText:       s("mod.aurora.color.tab_text",      "#c0c0e0"),
      tabCloseHover: s("mod.aurora.color.tab_close_hover","#ff6b6b"),
      tabHoverBg:    s("mod.aurora.color.tab_hover_bg",  "#252550"),
      urlbarBg:      s("mod.aurora.color.urlbar_bg",     "#1e1e3a"),
      urlbarText:    s("mod.aurora.color.urlbar_text",   "#e0e0ff"),
      urlbarBorder:  s("mod.aurora.color.urlbar_border", "#3a3a6c"),
      urlbarFocus:   s("mod.aurora.color.urlbar_focus",  "#7c6af7"),
      browserBg:     s("mod.aurora.color.browser_bg",    "#0f0f1a"),
      selectionBg:   s("mod.aurora.color.selection_bg",  "#7c6af740"),
      scrollbar:     s("mod.aurora.color.scrollbar",     "#3a3a6c"),
      buttonBg:      s("mod.aurora.color.button_bg",     "#2a2a4e"),
      buttonHover:   s("mod.aurora.color.button_hover",  "#3a3a6e"),
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
      tabHeight:          s("mod.aurora.layout.tab_height",          "36px"),
      tabBorderRadius:    s("mod.aurora.layout.tab_border_radius",    "8px"),
      panelBorderRadius:  s("mod.aurora.layout.panel_border_radius",  "8px"),
      buttonBorderRadius: s("mod.aurora.layout.button_border_radius", "6px"),
      sidebarWidth:       s("mod.aurora.layout.sidebar_width",        "200px"),
      toolbarHeight:      s("mod.aurora.layout.toolbar_height",       "40px"),
      borderWidth:        s("mod.aurora.layout.border_width",         "1px"),
    },
    effects: {
      panelOpacity:     s("mod.aurora.effect.panel_opacity",      "1.0"),
      panelBlur:        s("mod.aurora.effect.panel_blur",         "0px"),
      tabShadow:        b("mod.aurora.effect.tab_shadow",         false),
      accentGlow:       b("mod.aurora.effect.accent_glow",        false),
      panelBorderStyle: s("mod.aurora.effect.panel_border_style", "solid"),
    },
    sounds: {
      enabled: b("mod.aurora.sounds_enabled", false),
    },
    animations: {
      speed:  s("mod.aurora.animation_speed",    "normal"),
      easing: s("mod.aurora.animation.easing",   "ease"),
    },
    dynamicMode: s("mod.aurora.dynamic_mode", "off") as AuroraTheme["dynamicMode"],
  };
}

export function saveTheme(theme: AuroraTheme): void {
  const p = Services.prefs;
  const ss = (k: string, v: string) => p.setStringPref(k, v);
  const sb = (k: string, v: boolean) => p.setBoolPref(k, v);

  ss("mod.aurora.color.panel_bg",       theme.colors.panelBg);
  ss("mod.aurora.color.toolbar_bg",     theme.colors.toolbarBg);
  ss("mod.aurora.color.sidebar_bg",     theme.colors.sidebarBg);
  ss("mod.aurora.color.panel_text",     theme.colors.panelText);
  ss("mod.aurora.color.border",         theme.colors.border);
  ss("mod.aurora.color.accent",         theme.colors.accent);
  ss("mod.aurora.color.tab_active_bg",  theme.colors.tabActiveBg);
  ss("mod.aurora.color.tab_inactive_bg",theme.colors.tabInactiveBg);
  ss("mod.aurora.color.tab_text",       theme.colors.tabText);
  ss("mod.aurora.color.tab_close_hover",theme.colors.tabCloseHover);
  ss("mod.aurora.color.tab_hover_bg",   theme.colors.tabHoverBg);
  ss("mod.aurora.color.urlbar_bg",      theme.colors.urlbarBg);
  ss("mod.aurora.color.urlbar_text",    theme.colors.urlbarText);
  ss("mod.aurora.color.urlbar_border",  theme.colors.urlbarBorder);
  ss("mod.aurora.color.urlbar_focus",   theme.colors.urlbarFocus);
  ss("mod.aurora.color.browser_bg",     theme.colors.browserBg);
  ss("mod.aurora.color.selection_bg",   theme.colors.selectionBg);
  ss("mod.aurora.color.scrollbar",      theme.colors.scrollbar);
  ss("mod.aurora.color.button_bg",      theme.colors.buttonBg);
  ss("mod.aurora.color.button_hover",   theme.colors.buttonHover);
  ss("mod.aurora.image.bg_size",        theme.images.bgSize);
  ss("mod.aurora.image.bg_position",    theme.images.bgPosition);
  ss("mod.aurora.image.bg_blur",        theme.images.bgBlur);
  ss("mod.aurora.image.bg_opacity",     theme.images.bgOpacity);
  ss("mod.aurora.font.family",          theme.typography.fontFamily);
  ss("mod.aurora.font.size",            theme.typography.fontSize);
  ss("mod.aurora.font.weight",          theme.typography.fontWeight);
  ss("mod.aurora.layout.tab_height",          theme.layout.tabHeight);
  ss("mod.aurora.layout.tab_border_radius",   theme.layout.tabBorderRadius);
  ss("mod.aurora.layout.panel_border_radius", theme.layout.panelBorderRadius);
  ss("mod.aurora.layout.button_border_radius",theme.layout.buttonBorderRadius);
  ss("mod.aurora.layout.sidebar_width",       theme.layout.sidebarWidth);
  ss("mod.aurora.layout.toolbar_height",      theme.layout.toolbarHeight);
  ss("mod.aurora.layout.border_width",        theme.layout.borderWidth);
  ss("mod.aurora.effect.panel_opacity",       theme.effects.panelOpacity);
  ss("mod.aurora.effect.panel_blur",          theme.effects.panelBlur);
  sb("mod.aurora.effect.tab_shadow",          theme.effects.tabShadow);
  sb("mod.aurora.effect.accent_glow",         theme.effects.accentGlow);
  ss("mod.aurora.effect.panel_border_style",  theme.effects.panelBorderStyle);
  ss("mod.aurora.animation_speed",            theme.animations.speed);
  ss("mod.aurora.animation.easing",           theme.animations.easing);
  ss("mod.aurora.dynamic_mode",               theme.dynamicMode);
  sb("mod.aurora.sounds_enabled",             theme.sounds.enabled);
}

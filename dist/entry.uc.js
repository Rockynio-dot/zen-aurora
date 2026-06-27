"use strict";
(() => {
  // src/core/state.ts
  function s(key, def) {
    try {
      return Services.prefs.getStringPref(key, def) || def;
    } catch {
      return def;
    }
  }
  function b(key, def) {
    try {
      return Services.prefs.getBoolPref(key, def);
    } catch {
      return def;
    }
  }
  function loadTheme() {
    const useIndividual = b("mod.aurora.style.individual_text_colors", false);
    return {
      colors: {
        panelBg: s("mod.aurora.color.panel_bg", "#1a1a2e"),
        toolbarBg: s("mod.aurora.color.toolbar_bg", "#16162a"),
        sidebarBg: s("mod.aurora.color.sidebar_bg", "#12122a"),
        panelText: s("mod.aurora.color.panel_text", "#e0e0ff"),
        tabText: useIndividual ? s("mod.aurora.color.tab_text", "#c0c0e0") : s("mod.aurora.color.panel_text", "#e0e0ff"),
        urlbarText: useIndividual ? s("mod.aurora.color.urlbar_text", "#e0e0ff") : s("mod.aurora.color.panel_text", "#e0e0ff"),
        border: s("mod.aurora.color.border", "#3a3a5c"),
        accent: s("mod.aurora.color.accent", "#7c6af7"),
        tabActiveBg: s("mod.aurora.color.tab_active_bg", "#2a2a4e"),
        tabInactiveBg: s("mod.aurora.color.tab_inactive_bg", "#1a1a2e"),
        tabCloseHover: s("mod.aurora.color.tab_close_hover", "#ff6b6b"),
        tabHoverBg: s("mod.aurora.color.tab_hover_bg", "#252550"),
        urlbarBg: s("mod.aurora.color.urlbar_bg", "#1e1e3a"),
        urlbarBorder: s("mod.aurora.color.urlbar_border", "#3a3a6c"),
        urlbarFocus: s("mod.aurora.color.urlbar_focus", "#7c6af7"),
        browserBg: s("mod.aurora.color.browser_bg", "#0f0f1a"),
        selectionBg: s("mod.aurora.color.selection_bg", "#7c6af740"),
        scrollbar: s("mod.aurora.color.scrollbar", "#3a3a6c"),
        buttonBg: s("mod.aurora.color.button_bg", "#2a2a4e"),
        buttonHover: s("mod.aurora.color.button_hover", "#3a3a6e"),
        workspaceStripBg: s("mod.aurora.color.workspace_strip_bg", "#0d0d1e"),
        workspaceDot: s("mod.aurora.color.workspace_dot", "#3a3a6c"),
        workspaceDotActive: s("mod.aurora.color.workspace_dot_active", "#7c6af7")
      },
      images: {
        browserBg: s("mod.aurora.image.browser_bg", "") || null,
        bgSize: s("mod.aurora.image.bg_size", "cover"),
        bgPosition: s("mod.aurora.image.bg_position", "center"),
        bgBlur: s("mod.aurora.image.bg_blur", "0px"),
        bgOpacity: s("mod.aurora.image.bg_opacity", "1.0")
      },
      typography: {
        fontFamily: s("mod.aurora.font.family", "inherit"),
        fontSize: s("mod.aurora.font.size", "13px"),
        fontWeight: s("mod.aurora.font.weight", "400")
      },
      layout: {
        tabHeight: s("mod.aurora.layout.tab_height", "36px"),
        tabBorderRadius: s("mod.aurora.layout.tab_border_radius", "8px"),
        panelBorderRadius: s("mod.aurora.layout.panel_border_radius", "8px"),
        buttonBorderRadius: s("mod.aurora.layout.button_border_radius", "6px"),
        sidebarWidth: s("mod.aurora.layout.sidebar_width", "200px"),
        workspaceStripWidth: s("mod.aurora.layout.workspace_strip_width", "36px"),
        toolbarHeight: s("mod.aurora.layout.toolbar_height", "40px"),
        borderWidth: s("mod.aurora.layout.border_width", "1px"),
        noGapMod: b("mod.aurora.layout.no_gap_mod", false),
        noGapMode: s("mod.aurora.layout.no_gap_mode", "all"),
        noGapBg: s("mod.aurora.layout.no_gap_bg", "#000000"),
        noGapRemoveSplitHighlight: b("mod.aurora.layout.no_gap_remove_split_highlight", false),
        noGapRemoveBoxShadow: b("mod.aurora.layout.no_gap_remove_box_shadow", false),
        hitboxHeight: s("mod.aurora.layout.hitbox_height", "4px"),
        toolbarMode: s("mod.aurora.layout.toolbar_mode", "multi")
      },
      effects: {
        panelOpacity: s("mod.aurora.effect.panel_opacity", "1.0"),
        panelBlur: s("mod.aurora.effect.panel_blur", "0px"),
        tabShadow: b("mod.aurora.effect.tab_shadow", false),
        accentGlow: b("mod.aurora.effect.accent_glow", false),
        panelBorderStyle: s("mod.aurora.effect.panel_border_style", "solid")
      },
      style: {
        tabs: b("mod.aurora.style.tabs", true),
        urlbar: b("mod.aurora.style.urlbar", true),
        sidebar: b("mod.aurora.style.sidebar", true),
        toolbar: b("mod.aurora.style.toolbar", true),
        workspaceStrip: b("mod.aurora.style.workspace_strip", true),
        menus: b("mod.aurora.style.menus", true),
        individualTextColors: b("mod.aurora.style.individual_text_colors", false)
      },
      animations: {
        speed: s("mod.aurora.animation_speed", "normal"),
        easing: s("mod.aurora.animation.easing", "ease")
      },
      accessibility: {
        colorScheme: s("mod.aurora.accessibility.color_scheme", "auto"),
        colorBlindMode: s("mod.aurora.accessibility.color_blind_mode", "off"),
        webContrast: s("mod.aurora.accessibility.web_contrast", "off")
      },
      gradient: {
        enabled: b("mod.aurora.gradient.enabled", false),
        colors: s("mod.aurora.gradient.colors", "#7c6af7"),
        opacity: s("mod.aurora.gradient.opacity", "0.5"),
        dark: b("mod.aurora.gradient.dark", true)
      }
    };
  }

  // src/core/zenGradient.ts
  var ROTATION = -45;
  function hexToRgb(hex) {
    let h = hex.startsWith("#") ? hex.slice(1) : hex;
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    return [
      parseInt(h.slice(0, 2), 16) || 0,
      parseInt(h.slice(2, 4), 16) || 0,
      parseInt(h.slice(4, 6), 16) || 0
    ];
  }
  function rgbToHsl(r, g, b2) {
    r /= 255;
    g /= 255;
    b2 /= 255;
    const max = Math.max(r, g, b2), min = Math.min(r, g, b2), d = max - min;
    let h = 0;
    if (d !== 0) {
      if (max === r) h = (g - b2) / d % 6;
      else if (max === g) h = (b2 - r) / d + 2;
      else h = (r - g) / d + 4;
    }
    const l = (min + max) / 2;
    const s2 = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    return [h * 60, s2, l];
  }
  function hueToRgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
  function hslToRgb(h, s2, l) {
    let r, g, b2;
    if (s2 === 0) {
      r = g = b2 = l;
    } else {
      const q = l < 0.5 ? l * (1 + s2) : l + s2 - l * s2;
      const p = 2 * l - q;
      r = hueToRgb(p, q, h + 1 / 3);
      g = hueToRgb(p, q, h);
      b2 = hueToRgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b2 * 255)];
  }
  function luminance([r, g, b2]) {
    const a = [r, g, b2].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }
  function contrastRatio(rgb1, rgb2) {
    const l1 = luminance(rgb1), l2 = luminance(rgb2);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }
  function blendColors(rgb1, rgb2, percentage) {
    const p = percentage / 100;
    return [
      Math.round(rgb1[0] * p + rgb2[0] * (1 - p)),
      Math.round(rgb1[1] * p + rgb2[1] * (1 - p)),
      Math.round(rgb1[2] * p + rgb2[2] * (1 - p))
    ];
  }
  function toolbarBaseRaw(isDark) {
    return isDark ? [23, 23, 26] : [240, 240, 244];
  }
  function singleColor(color, opacity, isDark) {
    const blended = blendColors(color, toolbarBaseRaw(isDark), opacity * 100);
    return `rgba(${blended[0]}, ${blended[1]}, ${blended[2]}, 1)`;
  }
  function getGradient(colors, opacity, isDark, forToolbar) {
    if (colors.length === 0) {
      if (forToolbar) {
        const b2 = toolbarBaseRaw(isDark);
        return `rgba(${b2[0]}, ${b2[1]}, ${b2[2]}, 1)`;
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
          `linear-gradient(${ROTATION + 180}deg, ${c0} 0%, transparent 100%)`
        ].reverse().join(", ");
      }
      return `linear-gradient(${ROTATION}deg, ${c1} 0%, ${c0} 100%)`;
    }
    const color1 = singleColor(colors[2], opacity, isDark);
    const color2 = singleColor(colors[0], opacity, isDark);
    const color3 = singleColor(colors[1], opacity, isDark);
    return [
      `linear-gradient(-5deg, ${color1} 10%, transparent 80%)`,
      `radial-gradient(circle at 95% 0%, ${color3} 0%, transparent 75%)`,
      `radial-gradient(circle at 0% 0%, ${color2} 10%, transparent 70%)`
    ].join(", ");
  }
  function toolbarColor(isDark) {
    return isDark ? [255, 255, 255, 0.8] : [0, 0, 0, 0.8];
  }
  function shouldBeDarkMode(dominant, opacity, windowDark) {
    const bg = blendColors(toolbarBaseRaw(windowDark), dominant, (1 - opacity) * 100);
    const white = toolbarColor(true);
    const black = toolbarColor(false);
    const whiteOnBg = blendColors(bg, [white[0], white[1], white[2]], (1 - white[3]) * 100);
    const blackOnBg = blendColors(bg, [black[0], black[1], black[2]], (1 - black[3]) * 100);
    return contrastRatio(bg, whiteOnBg) > contrastRatio(bg, blackOnBg);
  }
  function accentForUI(dominant, contentDark, windowDark) {
    if (contentDark) return `rgb(${dominant[0]}, ${dominant[1]}, ${dominant[2]})`;
    const [h, s2, l] = rgbToHsl(dominant[0], dominant[1], dominant[2]);
    const saturation = Math.min(1, s2 + 0.3);
    const targetLightness = windowDark ? 0.62 : 0.42;
    const lightness = l * 0.4 + targetLightness * 0.6;
    const [r, g, b2] = hslToRgb(h / 360, saturation, lightness);
    return `rgb(${r}, ${g}, ${b2})`;
  }
  function generateZenTheme(hexColors, opacity, windowDark) {
    const colors = hexColors.filter(Boolean).slice(0, 3).map(hexToRgb);
    const dominant = colors[0] ?? (windowDark ? [40, 40, 46] : [220, 220, 228]);
    const contentDark = colors.length ? shouldBeDarkMode(dominant, opacity, windowDark) : windowDark;
    const text = toolbarColor(contentDark);
    return {
      background: getGradient(colors, opacity, windowDark, false),
      toolbar: getGradient(colors, opacity, windowDark, true),
      primaryColor: accentForUI(dominant, contentDark, windowDark),
      textColor: `rgba(${text[0]}, ${text[1]}, ${text[2]}, ${text[3]})`,
      colorScheme: contentDark ? "dark" : "light",
      dominant
    };
  }

  // src/core/cssEngine.ts
  var STYLE_ID = "aurora-dynamic-styles";
  var MD_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
  var ANIM_SPEED = {
    none: "0s",
    slow: "0.45s",
    normal: "0.18s",
    fast: "0.08s"
  };
  function colorBlindFilter(mode) {
    const filters = {
      protanopia: "saturate(0.7) hue-rotate(20deg)",
      deuteranopia: "saturate(0.75) hue-rotate(-20deg)",
      tritanopia: "hue-rotate(180deg) saturate(0.65)",
      achromatopsia: "grayscale(100%)"
    };
    return filters[mode] ?? "";
  }
  function generateCSS(t) {
    const dur = ANIM_SPEED[t.animations.speed] ?? "0.18s";
    const ease = t.animations.easing === "ease" ? MD_EASE : t.animations.easing;
    const noAnim = t.animations.speed === "none";
    const trans = `${dur} ${ease}`;
    const bgImage = t.images.browserBg ? `url("${t.images.browserBg}")` : "none";
    const panelRgba = hexToRgba(t.colors.panelBg, t.effects.panelOpacity);
    const toolRgba = hexToRgba(t.colors.toolbarBg, t.effects.panelOpacity);
    const sideRgba = hexToRgba(t.colors.sidebarBg, t.effects.panelOpacity);
    const blur = t.effects.panelBlur !== "0px" ? `blur(${t.effects.panelBlur})` : "";
    const tabShadow = t.effects.tabShadow ? `0 2px 8px ${t.colors.accent}55` : "none";
    const accentGlow = t.effects.accentGlow ? `0 0 10px ${t.colors.accent}66, 0 0 22px ${t.colors.accent}33` : "";
    const T = (props) => noAnim ? "" : `transition: ${props.split(",").map((p) => `${p.trim()} ${trans}`).join(", ")} !important;`;
    const S = t.style;
    return `
/* \u2550\u2550 Aurora CSS Variables \u2550\u2550 */
:root {
  --aurora-panel-bg:          ${panelRgba};
  --aurora-toolbar-bg:        ${toolRgba};
  --aurora-sidebar-bg:        ${sideRgba};
  --aurora-panel-text:        ${t.colors.panelText};
  --aurora-tab-text:          ${t.colors.tabText};
  --aurora-urlbar-text:       ${t.colors.urlbarText};
  --aurora-border:            ${t.colors.border};
  --aurora-border-w:          ${t.layout.borderWidth};
  --aurora-border-s:          ${t.effects.panelBorderStyle};
  --aurora-accent:            ${t.colors.accent};
  --aurora-tab-active:        ${t.colors.tabActiveBg};
  --aurora-tab-inactive:      ${t.colors.tabInactiveBg};
  --aurora-tab-close-hover:   ${t.colors.tabCloseHover};
  --aurora-tab-hover:         ${t.colors.tabHoverBg};
  --aurora-urlbar-bg:         ${t.colors.urlbarBg};
  --aurora-urlbar-border:     ${t.colors.urlbarBorder};
  --aurora-urlbar-focus:      ${t.colors.urlbarFocus};
  --aurora-browser-bg:        ${t.colors.browserBg};
  --aurora-selection:         ${t.colors.selectionBg};
  --aurora-scrollbar:         ${t.colors.scrollbar};
  --aurora-btn-bg:            ${t.colors.buttonBg};
  --aurora-btn-hover:         ${t.colors.buttonHover};
  --aurora-workspace-strip-bg:   ${t.colors.workspaceStripBg};
  --aurora-workspace-dot:        ${t.colors.workspaceDot};
  --aurora-workspace-dot-active: ${t.colors.workspaceDotActive};
  --aurora-workspace-strip-w:    ${t.layout.workspaceStripWidth};
  --aurora-tab-h:             ${t.layout.tabHeight};
  --aurora-tab-r:             ${t.layout.tabBorderRadius};
  --aurora-panel-r:           ${t.layout.panelBorderRadius};
  --aurora-btn-r:             ${t.layout.buttonBorderRadius};
  --aurora-sidebar-w:         ${t.layout.sidebarWidth};
  --aurora-toolbar-h:         ${t.layout.toolbarHeight};
  --aurora-font:              ${t.typography.fontFamily};
  --aurora-font-sz:           ${t.typography.fontSize};
  --aurora-font-w:            ${t.typography.fontWeight};
  --aurora-dur:               ${dur};
  --aurora-ease:              ${ease};
  --aurora-blur:              ${blur};
  --aurora-bg-img:            ${bgImage};
  --aurora-bg-size:           ${t.images.bgSize};
  --aurora-bg-pos:            ${t.images.bgPosition};
  --aurora-bg-blur:           ${t.images.bgBlur};
  --aurora-bg-opacity:        ${t.images.bgOpacity};
  --aurora-tab-shadow:        ${tabShadow};
  --aurora-glow:              ${accentGlow};
}

/* \u2550\u2550 Zen native variables \u2550\u2550 */
:root {
  --zen-primary-color:                   ${t.colors.accent}   !important;
  --zen-main-browser-background-toolbar: ${t.colors.toolbarBg} !important;
  --zen-appcontent-border:               ${t.colors.border}    !important;
  --zen-colors-tertiary:                 ${t.colors.panelBg}   !important;
}

/* \u2550\u2550 Toolbar (navigator-toolbox) \u2550\u2550 */
${S.toolbar ? `
#navigator-toolbox {
  background: var(--aurora-toolbar-bg) !important;
  border-bottom: var(--aurora-border-w) var(--aurora-border-s) var(--aurora-border) !important;
  ${blur ? `backdrop-filter: ${blur} !important;` : ""}
  ${T("background-color")}
}
#TabsToolbar,
#PersonalToolbar,
#nav-bar {
  background: var(--aurora-panel-bg) !important;
  color: var(--aurora-panel-text) !important;
  min-height: var(--aurora-toolbar-h) !important;
  font-family: var(--aurora-font) !important;
  font-size: var(--aurora-font-sz) !important;
  ${T("background-color, color")}
}
` : ""}

/* \u2550\u2550 Sidebar \u2550\u2550 */
${S.sidebar ? `
#sidebar-box,
#zen-sidebar-top-buttons,
#zen-sidebar-top-buttons-customization-target,
.zen-sidebar-action-button {
  background: var(--aurora-sidebar-bg) !important;
  border-color: var(--aurora-border) !important;
  ${blur ? `backdrop-filter: ${blur} !important;` : ""}
  ${T("background-color")}
}
#sidebar-box {
  min-width: var(--aurora-sidebar-w) !important;
  max-width: var(--aurora-sidebar-w) !important;
  border-right: var(--aurora-border-w) var(--aurora-border-s) var(--aurora-border) !important;
}
` : ""}

/* \u2550\u2550 Workspace strip \u2550\u2550 */
${S.workspaceStrip ? `
#zen-appcontent-navbar {
  background: var(--aurora-workspace-strip-bg) !important;
  min-width: var(--aurora-workspace-strip-w) !important;
  max-width: var(--aurora-workspace-strip-w) !important;
  border-right: var(--aurora-border-w) var(--aurora-border-s) var(--aurora-border) !important;
  ${blur ? `backdrop-filter: ${blur} !important;` : ""}
  ${T("background-color, min-width, max-width")}
}
.zen-workspace-dot,
.zen-workspace-button {
  background: var(--aurora-workspace-dot) !important;
  border-color: transparent !important;
  ${T("background-color, box-shadow")}
}
.zen-workspace-dot[selected],
.zen-workspace-dot[active],
.zen-workspace-button[selected],
.zen-workspace-button[active] {
  background: var(--aurora-workspace-dot-active) !important;
  box-shadow: 0 0 6px var(--aurora-workspace-dot-active) !important;
}
` : ""}

/* \u2550\u2550 Tabs \u2550\u2550 */
${S.tabs ? `
.tabbrowser-tab .tab-background {
  background: var(--aurora-tab-inactive) !important;
  border-radius: var(--aurora-tab-r) !important;
  border: var(--aurora-border-w) var(--aurora-border-s) transparent !important;
  ${T("background-color, border-color, box-shadow")}
}
.tabbrowser-tab[selected] .tab-background {
  background: var(--aurora-tab-active) !important;
  border-color: var(--aurora-border) !important;
  box-shadow: var(--aurora-tab-shadow) !important;
}
.tabbrowser-tab:hover:not([selected]) .tab-background {
  background: var(--aurora-tab-hover) !important;
}
.tab-label, .tab-text {
  color: var(--aurora-tab-text) !important;
  font-family: var(--aurora-font) !important;
  font-size: var(--aurora-font-sz) !important;
  font-weight: var(--aurora-font-w) !important;
}
.tab-close-button:hover { color: var(--aurora-tab-close-hover) !important; }
.tabbrowser-tab { min-height: var(--aurora-tab-h) !important; max-height: var(--aurora-tab-h) !important; }
${t.effects.accentGlow ? `.tabbrowser-tab[selected] .tab-background { box-shadow: var(--aurora-tab-shadow), var(--aurora-glow) !important; }` : ""}
` : ""}

/* \u2550\u2550 URL Bar \u2550\u2550 */
${S.urlbar ? `
#urlbar,
#urlbar-background {
  background: var(--aurora-urlbar-bg) !important;
  color: var(--aurora-urlbar-text) !important;
  border: var(--aurora-border-w) var(--aurora-border-s) var(--aurora-urlbar-border) !important;
  border-radius: var(--aurora-panel-r) !important;
  ${T("background-color, border-color, box-shadow")}
}
#urlbar[focused] #urlbar-background,
#urlbar:focus-within #urlbar-background {
  border-color: var(--aurora-urlbar-focus) !important;
  box-shadow: 0 0 0 2px ${t.colors.urlbarFocus}30 !important;
}
#urlbar-input { color: var(--aurora-urlbar-text) !important; font-family: var(--aurora-font) !important; }
` : ""}

/* \u2550\u2550 Browser background \u2550\u2550 */
#browser { background: var(--aurora-browser-bg) !important; }
#browser::before {
  content: "";
  position: fixed; inset: 0; pointer-events: none; z-index: -1;
  background-image: var(--aurora-bg-img);
  background-size: var(--aurora-bg-size);
  background-position: var(--aurora-bg-pos);
  background-repeat: no-repeat;
  opacity: var(--aurora-bg-opacity);
  ${t.images.bgBlur !== "0px" ? "filter: blur(var(--aurora-bg-blur));" : ""}
}

/* \u2550\u2550 Toolbar buttons \u2550\u2550 */
${S.toolbar ? `
toolbarbutton,
.toolbarbutton-1,
.zen-sidebar-action-button {
  background: transparent !important;
  border-radius: var(--aurora-btn-r) !important;
  color: var(--aurora-panel-text) !important;
  ${T("background-color, box-shadow, opacity")}
}
toolbarbutton:hover,
.toolbarbutton-1:hover,
.zen-sidebar-action-button:hover {
  background: var(--aurora-btn-hover) !important;
  ${t.effects.accentGlow ? "box-shadow: var(--aurora-glow) !important;" : ""}
}
toolbarbutton[checked="true"],
toolbarbutton[open="true"] { background: var(--aurora-btn-bg) !important; }
` : ""}

/* \u2550\u2550 Popup menus \u2550\u2550 */
${S.menus ? `
menupopup,
.panel-arrowcontainer,
.panel-arrowcontent,
#appMenu-popup,
#customizationui-widget-panel {
  background: var(--aurora-panel-bg) !important;
  border: var(--aurora-border-w) var(--aurora-border-s) var(--aurora-border) !important;
  border-radius: var(--aurora-panel-r) !important;
  color: var(--aurora-panel-text) !important;
  font-size: 11.5px !important;
  ${blur ? `backdrop-filter: ${blur} !important;` : ""}
}
menuitem, menu {
  color: var(--aurora-panel-text) !important;
  border-radius: var(--aurora-btn-r) !important;
  padding-block: 3px !important;
  padding-inline: 8px !important;
  min-height: 22px !important;
  font-size: 11.5px !important;
  ${T("background-color")}
}
menuitem:hover, menu:hover { background: var(--aurora-btn-hover) !important; }
menuseparator { margin-block: 2px !important; }
` : ""}

/* \u2550\u2550 Selection & scrollbar \u2550\u2550 */
::selection { background: var(--aurora-selection) !important; }
scrollbar, scrollbarbutton, slider { background: transparent !important; }
thumb { background: var(--aurora-scrollbar) !important; border-radius: 999px !important; }

/* \u2550\u2550 No Gap Mod (based on github.com/Comp-Tech-Guy/No-Gaps v2.5.2) \u2550\u2550 */
${t.layout.noGapMod ? `
#zen-tabbox-wrapper { transition: margin 0.2s ease-in !important; }

${t.layout.noGapMode === "compact" ? `
/* \u2500\u2500 Pouze kompaktn\xED m\xF3d \u2500\u2500 */
:root[zen-single-toolbar="true"][zen-compact-mode="true"]:not([customizing]) {
  #zen-appcontent-navbar-wrapper {
    min-height: 0.1px !important;
    height: 0.1px !important;
  }
  #zen-appcontent-navbar-wrapper[zen-has-hover="true"],
  #zen-appcontent-navbar-wrapper[has-popup-menu="true"] {
    height: 34px !important;
  }
  @media (not -moz-pref('zen.view.shift-down-site-on-hover')) and (not ((-moz-pref('zen.view.experimental-no-window-controls') or (not -moz-pref('zen.view.hide-window-controls'))) and -moz-pref('zen.view.use-single-toolbar'))) {
    .browserSidebarContainer:is(.deck-selected, [zen-split='true']):not(.zen-glance-overlay) .browserContainer {
      #tabbrowser-tabpanels[has-toolbar-hovered] & { margin-top: -34px !important; }
    }
  }
}
:root[zen-compact-mode="true"]:not([customizing]) {
  .browserSidebarContainer { border-radius: 0.1px !important; }
  #zen-tabbox-wrapper { margin: 0px !important; }
  @media -moz-pref("zen.view.compact.hide-toolbar") {
    #zen-appcontent-navbar-wrapper {
      min-height: 0.1px !important;
      height: 0.1px !important;
    }
    #zen-appcontent-navbar-wrapper[zen-has-hover="true"],
    #zen-appcontent-navbar-wrapper[has-popup-menu="true"] {
      height: var(--zen-toolbar-height-with-bookmarks) !important;
    }
    @media (not -moz-pref('zen.view.shift-down-site-on-hover')) and (not ((-moz-pref('zen.view.experimental-no-window-controls') or (not -moz-pref('zen.view.hide-window-controls'))) and (not -moz-pref('zen.view.use-single-toolbar')))) {
      .browserSidebarContainer:is(.deck-selected, [zen-split='true']):not(.zen-glance-overlay) .browserContainer {
        #tabbrowser-tabpanels[has-toolbar-hovered] & {
          margin-top: calc(-1 * var(--zen-toolbar-height-with-bookmarks)) !important;
        }
      }
    }
  }
  .browserSidebarContainer[zen-split="true"] { margin: 0px !important; }
  :has(.browserSidebarContainer[zen-split="true"]) #zen-tabbox-wrapper { margin-right: 9px !important; }
  #tabbrowser-tabbox[zen-split-view="true"] #tabbrowser-tabpanels { margin: 0px !important; position: relative; }
}
` : `
/* \u2500\u2500 Oba m\xF3dy \u2014 compact i non-compact (v\xFDchoz\xED) \u2500\u2500 */
:root[zen-single-toolbar="true"] .browserSidebarContainer {
  border-top-left-radius: 0.1px !important;
  border-top-right-radius: 0.1px !important;
}
:root[zen-compact-mode="true"]:not([customizing]) .browserSidebarContainer {
  border-top-left-radius: 0.1px !important;
  border-top-right-radius: 0.1px !important;
}
:root[zen-right-side="true"]:not([zen-single-toolbar="true"]) .browserSidebarContainer {
  border-top-left-radius: 0.1px !important;
}
:root:not([zen-right-side="true"]):not([zen-single-toolbar="true"]) .browserSidebarContainer {
  border-top-right-radius: 0.1px !important;
}
.browserSidebarContainer {
  border-bottom-left-radius: 0.1px !important;
  border-bottom-right-radius: 0.1px !important;
}
#zen-tabbox-wrapper { margin: 0px !important; }
:root[zen-single-toolbar="true"] {
  #zen-appcontent-navbar-wrapper {
    min-height: 0.1px !important;
    height: 0.1px !important;
  }
  #zen-appcontent-navbar-wrapper[zen-has-hover="true"],
  #zen-appcontent-navbar-wrapper[has-popup-menu="true"] { height: 34px !important; }
  @media (not -moz-pref('zen.view.shift-down-site-on-hover')) and (not ((-moz-pref('zen.view.experimental-no-window-controls') or (not -moz-pref('zen.view.hide-window-controls'))) and -moz-pref('zen.view.use-single-toolbar'))) {
    .browserSidebarContainer:is(.deck-selected, [zen-split='true']):not(.zen-glance-overlay) .browserContainer {
      #tabbrowser-tabpanels[has-toolbar-hovered] & { margin-top: -34px !important; }
    }
  }
}
@media -moz-pref("zen.view.compact.hide-toolbar") {
  :root[zen-compact-mode="true"]:not([zen-single-toolbar="true"]) {
    #zen-appcontent-navbar-wrapper {
      min-height: 0.1px !important;
      height: 0.1px !important;
    }
    #zen-appcontent-navbar-wrapper[zen-has-hover="true"],
    #zen-appcontent-navbar-wrapper[has-popup-menu="true"] {
      height: var(--zen-toolbar-height-with-bookmarks) !important;
    }
    @media (not -moz-pref('zen.view.shift-down-site-on-hover')) and (not ((-moz-pref('zen.view.experimental-no-window-controls') or (not -moz-pref('zen.view.hide-window-controls'))) and (not -moz-pref('zen.view.use-single-toolbar')))) {
      .browserSidebarContainer:is(.deck-selected, [zen-split='true']):not(.zen-glance-overlay) .browserContainer {
        #tabbrowser-tabpanels[has-toolbar-hovered] & {
          margin-top: calc(-1 * var(--zen-toolbar-height-with-bookmarks)) !important;
        }
      }
    }
  }
}
.browserSidebarContainer[zen-split="true"] { margin: 0px !important; }
:has(.browserSidebarContainer[zen-split="true"]) #zen-tabbox-wrapper { margin-right: 9px !important; }
#tabbrowser-tabbox[zen-split-view="true"] #tabbrowser-tabpanels { margin: 0px !important; position: relative; }
`}

/* \u2500\u2500 Split view \u2014 spole\u010Dn\xE9 \u2500\u2500 */
.deck-selected { z-index: 1 !important; }
.browserSidebarContainer:not(.deck-selected) { z-index: 0 !important; }
.zen-split-view-splitter:hover {
  background: var(--aurora-accent) !important;
  filter: brightness(0.5);
}
.zen-split-view-splitter[orient="vertical"]   { width: 5px !important; margin-left: -3px !important; }
.zen-split-view-splitter[orient="horizontal"] { height: 5px !important; margin-top: 3px !important; }

/* \u2500\u2500 Voliteln\xE9: vlastn\xED barva pozad\xED za obsahem \u2500\u2500 */
#tabbrowser-tabpanels { background: ${t.layout.noGapBg} !important; }

/* \u2500\u2500 Voliteln\xE9 roz\u0161\xED\u0159en\xED \u2500\u2500 */
${t.layout.noGapRemoveSplitHighlight ? `.browserSidebarContainer[zen-split="true"] { outline: none !important; }` : ""}
${t.layout.noGapRemoveBoxShadow ? `
.browserSidebarContainer { box-shadow: none !important; }
#tabbrowser-tabpanels[zen-split-view="true"] .browserSidebarContainer.deck-selected { box-shadow: none !important; }
` : ""}
` : ""}

/* \u2550\u2550 Toolbar mode \u2550\u2550 */
${t.layout.toolbarMode === "single" ? `
#PersonalToolbar { display: none !important; }
` : ""}
${t.layout.toolbarMode === "collapsed" ? `
#navigator-toolbox { transform: translateY(-100%); transition: transform 0.2s ease !important; }
#navigator-toolbox:hover,
#navigator-toolbox:focus-within { transform: translateY(0) !important; }
` : ""}

/* \u2550\u2550 Top bar hitbox (larger hover zone when toolbar is hidden) \u2550\u2550 */
${t.layout.hitboxHeight !== "4px" ? `
#zen-appcontent-navbar::before,
#tabbrowser-tabpanels::before {
  content: "" !important;
  display: block !important;
  height: ${t.layout.hitboxHeight} !important;
  position: fixed !important;
  top: 0 !important; left: 0 !important; right: 0 !important;
  background: transparent !important;
  pointer-events: all !important;
  z-index: 9999 !important;
}
` : ""}

/* \u2550\u2550 Accessibility \u2550\u2550 */
${t.accessibility.colorBlindMode !== "off" ? `
html { filter: ${colorBlindFilter(t.accessibility.colorBlindMode)} !important; }
` : ""}
${t.accessibility.webContrast === "high-dark" ? `
:root {
  --aurora-panel-bg:   #000000 !important;
  --aurora-toolbar-bg: #000000 !important;
  --aurora-sidebar-bg: #0a0a0a !important;
  --aurora-panel-text: #ffffff !important;
  --aurora-tab-text:   #ffffff !important;
  --aurora-urlbar-text:#ffffff !important;
  --aurora-border:     #ffffff !important;
  --aurora-browser-bg: #000000 !important;
}
` : ""}
${t.accessibility.webContrast === "high-light" ? `
:root {
  --aurora-panel-bg:   #ffffff !important;
  --aurora-toolbar-bg: #f0f0f0 !important;
  --aurora-sidebar-bg: #f5f5f5 !important;
  --aurora-panel-text: #000000 !important;
  --aurora-tab-text:   #000000 !important;
  --aurora-urlbar-text:#000000 !important;
  --aurora-border:     #000000 !important;
  --aurora-browser-bg: #ffffff !important;
}
` : ""}

/* \u2550\u2550 Zen "Upravit motiv" gradient \u2550\u2550 */
${gradientCSS(t)}

/* \u2550\u2550 Kill all animations \u2550\u2550 */
${noAnim ? "*, *::before, *::after { transition: none !important; animation: none !important; }" : ""}
`.trim();
  }
  function gradientCSS(t) {
    if (!t.gradient.enabled) return "";
    const hexes = t.gradient.colors.split(",").map((c) => c.trim()).filter(Boolean);
    if (!hexes.length) return "";
    const opacity = parseFloat(t.gradient.opacity);
    const z = generateZenTheme(hexes, isNaN(opacity) ? 0.5 : opacity, t.gradient.dark);
    return `
:root {
  --zen-primary-color:                   ${z.primaryColor} !important;
  --toolbox-textcolor:                   ${z.textColor}    !important;
  --toolbar-color-scheme:                ${z.colorScheme}  !important;
  --zen-main-browser-background:         ${z.background}   !important;
  --zen-main-browser-background-toolbar: ${z.toolbar}      !important;
}
#zen-browser-background { --zen-main-browser-background: ${z.background} !important; }
#zen-toolbar-background { --zen-main-browser-background-toolbar: ${z.toolbar} !important; }
#navigator-toolbox, #TabsToolbar, #nav-bar, #PersonalToolbar {
  background: ${z.toolbar} !important;
}
#browser, #tabbrowser-tabpanels {
  background-image: ${z.background} !important;
}
`;
  }
  function hexToRgba(hex, opacity) {
    const clean = hex.replace("#", "");
    if (clean.length < 6) return hex;
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b2 = parseInt(clean.slice(4, 6), 16);
    const a = parseFloat(opacity);
    if (isNaN(r) || isNaN(g) || isNaN(b2)) return hex;
    return `rgba(${r}, ${g}, ${b2}, ${isNaN(a) ? 1 : a})`;
  }
  function applyTheme(theme, targetDoc = document) {
    let el = targetDoc.getElementById(STYLE_ID);
    if (!el) {
      el = targetDoc.createElement("style");
      el.id = STYLE_ID;
      (targetDoc.head ?? targetDoc.documentElement).appendChild(el);
    }
    el.textContent = generateCSS(theme);
    const root = targetDoc.documentElement;
    root.style.setProperty("--zen-appcontent-border", theme.colors.border);
    root.style.setProperty("--zen-colors-tertiary", theme.colors.panelBg);
    if (theme.gradient.enabled) {
      const hexes = theme.gradient.colors.split(",").map((c) => c.trim()).filter(Boolean);
      const op = parseFloat(theme.gradient.opacity);
      const z = generateZenTheme(hexes, isNaN(op) ? 0.5 : op, theme.gradient.dark);
      root.style.setProperty("--zen-primary-color", z.primaryColor);
      root.style.setProperty("--toolbox-textcolor", z.textColor);
      targetDoc.getElementById("zen-browser-background")?.style.setProperty("--zen-main-browser-background", z.background);
      targetDoc.getElementById("zen-toolbar-background")?.style.setProperty("--zen-main-browser-background-toolbar", z.toolbar);
    } else {
      root.style.setProperty("--zen-primary-color", theme.colors.accent);
      root.style.setProperty("--zen-main-browser-background-toolbar", theme.colors.toolbarBg);
      targetDoc.getElementById("zen-browser-background")?.style.removeProperty("--zen-main-browser-background");
      targetDoc.getElementById("zen-toolbar-background")?.style.removeProperty("--zen-main-browser-background-toolbar");
    }
  }
  function injectStyles(css, id, targetDoc = document) {
    let el = targetDoc.getElementById(id);
    if (!el) {
      el = targetDoc.createElement("style");
      el.id = id;
      (targetDoc.head ?? targetDoc.documentElement).appendChild(el);
    }
    el.textContent = css;
  }

  // src/core/events.ts
  var listeners = /* @__PURE__ */ new Set();
  function emit(type) {
    for (const fn of listeners) fn(type);
  }
  function initEvents(chromeDoc) {
    chromeDoc.addEventListener(
      "keydown",
      () => emit("keydown"),
      { capture: true, passive: true }
    );
    const browser = chromeDoc.defaultView?.gBrowser;
    if (browser?.tabContainer) {
      browser.tabContainer.addEventListener("TabOpen", () => emit("tab-open"));
      browser.tabContainer.addEventListener("TabClose", () => emit("tab-close"));
      browser.tabContainer.addEventListener("TabSelect", () => emit("tab-click"));
    }
    chromeDoc.addEventListener("popupshowing", () => emit("panel-show"), { capture: true, passive: true });
    chromeDoc.addEventListener("popuphiding", () => emit("panel-hide"), { capture: true, passive: true });
  }

  // src/features/spaces.ts
  function getActiveSpaceIndex() {
    try {
      const gZen = window.gZenWorkspaces;
      const uuid = gZen?.activeWorkspace;
      if (!uuid) return -1;
      return (gZen?._workspaceCache ?? []).findIndex((s2) => s2.uuid === uuid);
    } catch {
      return -1;
    }
  }
  function spaceColor(idx, suffix, fallback) {
    try {
      const val = Services.prefs.getStringPref(
        `mod.aurora.space.${idx + 1}.${suffix}`,
        ""
      );
      return val || fallback;
    } catch {
      return fallback;
    }
  }
  function buildSpaceCSS(spaceIdx, base) {
    if (spaceIdx < 0) return "";
    const accent = spaceColor(spaceIdx, "accent", base.colors.accent);
    const panelBg = spaceColor(spaceIdx, "panel_bg", base.colors.panelBg);
    const toolbarBg = spaceColor(spaceIdx, "toolbar_bg", base.colors.toolbarBg);
    const sidebarBg = spaceColor(spaceIdx, "sidebar_bg", base.colors.sidebarBg);
    const tabActive = spaceColor(spaceIdx, "tab_active_bg", base.colors.tabActiveBg);
    const urlFocus = spaceColor(spaceIdx, "urlbar_focus", accent);
    const hasOverrides = [accent, panelBg, toolbarBg, sidebarBg, tabActive].some((v, i) => {
      const defaults = [
        base.colors.accent,
        base.colors.panelBg,
        base.colors.toolbarBg,
        base.colors.sidebarBg,
        base.colors.tabActiveBg
      ];
      return v !== defaults[i];
    });
    if (!hasOverrides) return "";
    return `
/* Aurora \u2014 Space ${spaceIdx + 1} overrides */
:root {
  --aurora-accent:       ${accent} !important;
  --aurora-panel-bg:     ${panelBg} !important;
  --aurora-toolbar-bg:   ${toolbarBg} !important;
  --aurora-sidebar-bg:   ${sidebarBg} !important;
  --aurora-tab-active-bg:${tabActive} !important;
  --aurora-urlbar-focus: ${urlFocus} !important;
}`.trim();
  }
  function syncZenPrimaryColor(accent) {
    try {
      const syncEnabled = Services.prefs.getBoolPref(
        "mod.aurora.zen.sync_primary_color",
        true
      );
      if (!syncEnabled) return;
      document.documentElement.style.setProperty("--zen-primary-color", accent);
    } catch {
    }
  }
  var SPACE_STYLE_ID = "aurora-space-styles";
  function applySpaceStyles(doc) {
    const theme = loadTheme();
    const idx = getActiveSpaceIndex();
    const spaceCSS = buildSpaceCSS(idx, theme);
    injectStyles(spaceCSS, SPACE_STYLE_ID, doc);
    const activeAccent = idx >= 0 ? spaceColor(idx, "accent", theme.colors.accent) : theme.colors.accent;
    syncZenPrimaryColor(activeAccent);
  }
  var lastSpaceIdx = -2;
  function onPossibleSpaceChange(doc) {
    const idx = getActiveSpaceIndex();
    if (idx !== lastSpaceIdx) {
      lastSpaceIdx = idx;
      applySpaceStyles(doc);
    }
  }
  function initSpaces(doc) {
    applySpaceStyles(doc);
    const styleObserver2 = new MutationObserver(() => {
      onPossibleSpaceChange(doc);
    });
    styleObserver2.observe(doc.documentElement, {
      attributes: true,
      attributeFilter: ["style"]
    });
    const onTabSelect = () => onPossibleSpaceChange(doc);
    doc.addEventListener("TabSelect", onTabSelect, { capture: true });
    return () => {
      styleObserver2.disconnect();
      doc.removeEventListener("TabSelect", onTabSelect, true);
      doc.getElementById(SPACE_STYLE_ID)?.remove();
    };
  }
  function refreshSpaces(doc) {
    lastSpaceIdx = -2;
    applySpaceStyles(doc);
  }

  // src/ui/overlay.ts
  function openSettingsWindow() {
    try {
      const wins = Services.wm.getEnumerator(null);
      while (wins.hasMoreElements()) {
        const win = wins.getNext();
        if (win._auroraSettings) {
          win.focus();
          return;
        }
      }
    } catch {
    }
    Services.ww.openWindow(
      null,
      "chrome://aurora/content/settings.html",
      "_blank",
      "chrome,dialog=no,resizable,width=1024,height=720,centerscreen",
      null
    );
  }
  function initOverlay(_doc) {
    const prefObs = {
      observe(_s, topic, data) {
        if (topic !== "nsPref:changed" || data !== "mod.aurora.ui.open_panel") return;
        try {
          if (Services.prefs.getBoolPref("mod.aurora.ui.open_panel", false)) {
            openSettingsWindow();
            Services.prefs.setBoolPref("mod.aurora.ui.open_panel", false);
          }
        } catch {
        }
      }
    };
    Services.prefs.addObserver("mod.aurora.ui.open_panel", prefObs);
    return () => Services.prefs.removeObserver("mod.aurora.ui.open_panel", prefObs);
  }

  // src/core/zenSync.ts
  var INIT_PREF = "mod.aurora.initialized";
  function hexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b2 = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b2), min = Math.min(r, g, b2);
    const l = (max + min) / 2;
    if (max === min) return [0, 0, l];
    const d = max - min;
    const s2 = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    const h = max === r ? ((g - b2) / d + (g < b2 ? 6 : 0)) / 6 : max === g ? ((b2 - r) / d + 2) / 6 : ((r - g) / d + 4) / 6;
    return [h * 360, s2, l];
  }
  function derivePaletteFromAccent(accent) {
    const [h] = hexToHsl(accent);
    const bg = `hsl(${h}, 18%, 10%)`;
    const bgMd = `hsl(${h}, 16%, 12%)`;
    const bgLt = `hsl(${h}, 14%, 15%)`;
    const text = `hsl(${h}, 60%, 92%)`;
    const brd = `hsl(${h}, 25%, 25%)`;
    return {
      "mod.aurora.color.panel_bg": bgMd,
      "mod.aurora.color.toolbar_bg": bg,
      "mod.aurora.color.sidebar_bg": bg,
      "mod.aurora.color.panel_text": text,
      "mod.aurora.color.border": brd,
      "mod.aurora.color.accent": accent,
      "mod.aurora.color.tab_active_bg": bgLt,
      "mod.aurora.color.tab_inactive_bg": bgMd,
      "mod.aurora.color.tab_text": text,
      "mod.aurora.color.tab_close_hover": "#ff6b6b",
      "mod.aurora.color.tab_hover_bg": bgLt,
      "mod.aurora.color.urlbar_bg": bgMd,
      "mod.aurora.color.urlbar_text": text,
      "mod.aurora.color.urlbar_border": brd,
      "mod.aurora.color.urlbar_focus": accent,
      "mod.aurora.color.browser_bg": bg,
      "mod.aurora.color.selection_bg": accent + "44",
      "mod.aurora.color.scrollbar": brd,
      "mod.aurora.color.button_bg": bgLt,
      "mod.aurora.color.button_hover": `hsl(${h}, 20%, 22%)`
    };
  }
  function readZenAccent(doc) {
    try {
      const inline = doc.documentElement.style.getPropertyValue("--zen-primary-color").trim();
      if (inline && inline.startsWith("#")) return inline;
      const computed = getComputedStyle(doc.documentElement).getPropertyValue("--zen-primary-color").trim();
      if (computed && computed.startsWith("#")) return computed;
      const pref = Services.prefs.getStringPref("zen.theme.accent-color", "");
      if (pref && pref.startsWith("#")) return pref;
    } catch {
    }
    return null;
  }
  function captureZenColorsOnFirstRun(doc) {
    try {
      const alreadyInit = Services.prefs.getBoolPref(INIT_PREF, false);
      if (alreadyInit) return;
      const hasCustomAccent = Services.prefs.prefHasUserValue("mod.aurora.color.accent");
      if (hasCustomAccent) {
        Services.prefs.setBoolPref(INIT_PREF, true);
        return;
      }
      const zenAccent = readZenAccent(doc);
      if (zenAccent) {
        const palette = derivePaletteFromAccent(zenAccent);
        for (const [pref, val] of Object.entries(palette)) {
          try {
            Services.prefs.setStringPref(pref, val);
          } catch {
          }
        }
        dump(`[Aurora] First run: captured Zen accent ${zenAccent}
`);
      }
      Services.prefs.setBoolPref(INIT_PREF, true);
    } catch (e) {
      dump(`[Aurora] First-run capture error: ${e}
`);
    }
  }
  var lastKnownZenAccent = "";
  function applyZenAccentToAurora(accent) {
    if (accent === lastKnownZenAccent) return;
    lastKnownZenAccent = accent;
    const syncEnabled = Services.prefs.getBoolPref("mod.aurora.zen.inherit_accent", false);
    if (!syncEnabled) return;
    try {
      Services.prefs.setStringPref("mod.aurora.color.accent", accent);
      Services.prefs.setStringPref("mod.aurora.color.urlbar_focus", accent);
    } catch {
    }
  }
  var zenPrefObserver = {
    observe(_s, topic, data) {
      if (topic !== "nsPref:changed") return;
      if (data === "zen.theme.accent-color") {
        try {
          const accent = Services.prefs.getStringPref("zen.theme.accent-color", "");
          if (accent) applyZenAccentToAurora(accent);
        } catch {
        }
      }
    }
  };
  var styleObserver = null;
  function initZenSync(doc) {
    Services.prefs.addObserver("zen.theme.accent-color", zenPrefObserver);
    styleObserver = new MutationObserver(() => {
      const accent = doc.documentElement.style.getPropertyValue("--zen-primary-color").trim();
      if (accent) applyZenAccentToAurora(accent);
    });
    styleObserver.observe(doc.documentElement, {
      attributes: true,
      attributeFilter: ["style"]
    });
    return () => {
      Services.prefs.removeObserver("zen.theme.accent-color", zenPrefObserver);
      styleObserver?.disconnect();
      styleObserver = null;
      lastKnownZenAccent = "";
    };
  }

  // src/entry.uc.mts
  var stopSpaces = null;
  var stopOverlay = null;
  var stopZenSync = null;
  var debounceTimer = null;
  function scheduleApply(doc) {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      applyAll(doc);
    }, 80);
  }
  function applyAll(doc) {
    const theme = loadTheme();
    applyTheme(theme, doc);
    refreshSpaces(doc);
  }
  async function init() {
    try {
      if (!Services.prefs.getBoolPref("mod.aurora.enabled", true)) {
        dump("[Aurora] Disabled.\n");
        return;
      }
      const doc = document;
      captureZenColorsOnFirstRun(doc);
      await applyAll(doc);
      initEvents(doc);
      stopSpaces = initSpaces(doc);
      stopOverlay = initOverlay(doc);
      stopZenSync = initZenSync(doc);
      const observer = {
        observe(_s, topic, data) {
          if (topic !== "nsPref:changed") return;
          const key = data;
          if (!key.startsWith("mod.aurora.")) return;
          if (key === "mod.aurora.ui.open_panel") return;
          scheduleApply(doc);
        }
      };
      Services.prefs.addObserver("mod.aurora.", observer);
      doc.defaultView?.addEventListener("beforeunload", () => {
        if (debounceTimer) clearTimeout(debounceTimer);
        Services.prefs.removeObserver("mod.aurora.", observer);
        stopSpaces?.();
        stopOverlay?.();
        stopZenSync?.();
      }, { once: true });
      dump("[Aurora] Ready.\n");
    } catch (e) {
      dump(`[Aurora] Init error: ${e}
`);
      console.error("[Aurora] Init error:", e);
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      init();
    }, { once: true });
  } else {
    init();
  }
})();

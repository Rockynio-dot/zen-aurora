import type { AuroraTheme } from "./state.ts";

const STYLE_ID = "aurora-dynamic-styles";
const MD_EASE  = "cubic-bezier(0.4, 0, 0.2, 1)";

const ANIM_SPEED: Record<string, string> = {
  none: "0s", slow: "0.45s", normal: "0.18s", fast: "0.08s",
};

function colorBlindFilter(mode: string): string {
  const filters: Record<string, string> = {
    protanopia:    "saturate(0.7) hue-rotate(20deg)",
    deuteranopia:  "saturate(0.75) hue-rotate(-20deg)",
    tritanopia:    "hue-rotate(180deg) saturate(0.65)",
    achromatopsia: "grayscale(100%)",
  };
  return filters[mode] ?? "";
}

export function generateCSS(t: AuroraTheme): string {
  const dur    = ANIM_SPEED[t.animations.speed] ?? "0.18s";
  const ease   = t.animations.easing === "ease" ? MD_EASE : t.animations.easing;
  const noAnim = t.animations.speed === "none";
  const trans  = `${dur} ${ease}`;

  const bgImage   = t.images.browserBg ? `url("${t.images.browserBg}")` : "none";
  const panelRgba = hexToRgba(t.colors.panelBg,   t.effects.panelOpacity);
  const toolRgba  = hexToRgba(t.colors.toolbarBg,  t.effects.panelOpacity);
  const sideRgba  = hexToRgba(t.colors.sidebarBg,  t.effects.panelOpacity);
  const blur      = t.effects.panelBlur !== "0px" ? `blur(${t.effects.panelBlur})` : "";
  const tabShadow = t.effects.tabShadow  ? `0 2px 8px ${t.colors.accent}55` : "none";
  const accentGlow= t.effects.accentGlow ? `0 0 10px ${t.colors.accent}66, 0 0 22px ${t.colors.accent}33` : "";

  const T = (props: string) => noAnim ? "" :
    `transition: ${props.split(",").map(p => `${p.trim()} ${trans}`).join(", ")} !important;`;

  // Shorthands for style flags
  const S = t.style;

  return `
/* ══ Aurora CSS Variables ══ */
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

/* ══ Zen native variables ══ */
:root {
  --zen-primary-color:                   ${t.colors.accent}   !important;
  --zen-main-browser-background-toolbar: ${t.colors.toolbarBg} !important;
  --zen-appcontent-border:               ${t.colors.border}    !important;
  --zen-colors-tertiary:                 ${t.colors.panelBg}   !important;
}

/* ══ Toolbar (navigator-toolbox) ══ */
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

/* ══ Sidebar ══ */
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

/* ══ Workspace strip ══ */
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

/* ══ Tabs ══ */
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

/* ══ URL Bar ══ */
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

/* ══ Browser background ══ */
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

/* ══ Toolbar buttons ══ */
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

/* ══ Popup menus ══ */
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

/* ══ Selection & scrollbar ══ */
::selection { background: var(--aurora-selection) !important; }
scrollbar, scrollbarbutton, slider { background: transparent !important; }
thumb { background: var(--aurora-scrollbar) !important; border-radius: 999px !important; }

/* ══ No Gap Mod (based on github.com/Comp-Tech-Guy/No-Gaps v2.5.2) ══ */
${t.layout.noGapMod ? `
#zen-tabbox-wrapper { transition: margin 0.2s ease-in !important; }

${t.layout.noGapMode === "compact" ? `
/* ── Pouze kompaktní mód ── */
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
/* ── Oba módy — compact i non-compact (výchozí) ── */
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

/* ── Split view — společné ── */
.deck-selected { z-index: 1 !important; }
.browserSidebarContainer:not(.deck-selected) { z-index: 0 !important; }
.zen-split-view-splitter:hover {
  background: var(--aurora-accent) !important;
  filter: brightness(0.5);
}
.zen-split-view-splitter[orient="vertical"]   { width: 5px !important; margin-left: -3px !important; }
.zen-split-view-splitter[orient="horizontal"] { height: 5px !important; margin-top: 3px !important; }

/* ── Volitelné: vlastní barva pozadí za obsahem ── */
#tabbrowser-tabpanels { background: ${t.layout.noGapBg} !important; }

/* ── Volitelné rozšíření ── */
${t.layout.noGapRemoveSplitHighlight ? `.browserSidebarContainer[zen-split="true"] { outline: none !important; }` : ""}
${t.layout.noGapRemoveBoxShadow ? `
.browserSidebarContainer { box-shadow: none !important; }
#tabbrowser-tabpanels[zen-split-view="true"] .browserSidebarContainer.deck-selected { box-shadow: none !important; }
` : ""}
` : ""}

/* ══ Toolbar mode ══ */
${t.layout.toolbarMode === "single" ? `
#PersonalToolbar { display: none !important; }
` : ""}
${t.layout.toolbarMode === "collapsed" ? `
#navigator-toolbox { transform: translateY(-100%); transition: transform 0.2s ease !important; }
#navigator-toolbox:hover,
#navigator-toolbox:focus-within { transform: translateY(0) !important; }
` : ""}

/* ══ Top bar hitbox (larger hover zone when toolbar is hidden) ══ */
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

/* ══ Accessibility ══ */
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

/* ══ Kill all animations ══ */
${noAnim ? "*, *::before, *::after { transition: none !important; animation: none !important; }" : ""}
`.trim();
}

function hexToRgba(hex: string, opacity: string): string {
  const clean = hex.replace("#", "");
  if (clean.length < 6) return hex;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const a = parseFloat(opacity);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return hex;
  return `rgba(${r}, ${g}, ${b}, ${isNaN(a) ? 1 : a})`;
}

export function applyTheme(theme: AuroraTheme, targetDoc: Document = document): void {
  let el = targetDoc.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = targetDoc.createElement("style") as HTMLStyleElement;
    el.id = STYLE_ID;
    (targetDoc.head ?? targetDoc.documentElement).appendChild(el);
  }
  el.textContent = generateCSS(theme);

  // Zen sets these as inline styles on documentElement — inline overrides
  // any stylesheet rule including !important, so we force-set them inline too.
  const root = targetDoc.documentElement;
  root.style.setProperty("--zen-primary-color",                   theme.colors.accent);
  root.style.setProperty("--zen-main-browser-background-toolbar", theme.colors.toolbarBg);
  root.style.setProperty("--zen-appcontent-border",               theme.colors.border);
  root.style.setProperty("--zen-colors-tertiary",                 theme.colors.panelBg);
}

export function removeTheme(targetDoc: Document = document): void {
  targetDoc.getElementById(STYLE_ID)?.remove();
}

export function injectStyles(css: string, id: string, targetDoc: Document = document): void {
  let el = targetDoc.getElementById(id) as HTMLStyleElement | null;
  if (!el) {
    el = targetDoc.createElement("style") as HTMLStyleElement;
    el.id = id;
    (targetDoc.head ?? targetDoc.documentElement).appendChild(el);
  }
  el.textContent = css;
}

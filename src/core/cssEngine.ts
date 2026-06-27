import type { AuroraTheme } from "./state.ts";

const STYLE_ID = "aurora-dynamic-styles";

// Material Design ease — smooth and natural
const MD_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

const ANIM_SPEED: Record<string, string> = {
  none:   "0s",
  slow:   "0.45s",
  normal: "0.18s",
  fast:   "0.08s",
};

export function generateCSS(t: AuroraTheme): string {
  const dur    = ANIM_SPEED[t.animations.speed] ?? "0.18s";
  const ease   = t.animations.easing === "ease" ? MD_EASE : t.animations.easing;
  const noAnim = t.animations.speed === "none";
  const trans  = `${dur} ${ease}`;

  const bgImage    = t.images.browserBg ? `url("${t.images.browserBg}")` : "none";
  const panelRgba  = hexToRgba(t.colors.panelBg,   t.effects.panelOpacity);
  const toolRgba   = hexToRgba(t.colors.toolbarBg,  t.effects.panelOpacity);
  const sideRgba   = hexToRgba(t.colors.sidebarBg,  t.effects.panelOpacity);
  const blur       = t.effects.panelBlur !== "0px" ? `blur(${t.effects.panelBlur})` : "";
  const tabShadow  = t.effects.tabShadow  ? `0 2px 8px ${t.colors.accent}55` : "none";
  const accentGlow = t.effects.accentGlow ? `0 0 10px ${t.colors.accent}66, 0 0 22px ${t.colors.accent}33` : "";

  const T = (props: string) => noAnim ? "" : `transition: ${props.split(",").map(p => `${p.trim()} ${trans}`).join(", ")} !important;`;

  return `
/* ══ Aurora CSS Variables ══ */
:root {
  --aurora-panel-bg:          ${panelRgba};
  --aurora-toolbar-bg:        ${toolRgba};
  --aurora-sidebar-bg:        ${sideRgba};
  --aurora-panel-text:        ${t.colors.panelText};
  --aurora-border:            ${t.colors.border};
  --aurora-border-w:          ${t.layout.borderWidth};
  --aurora-border-s:          ${t.effects.panelBorderStyle};
  --aurora-accent:            ${t.colors.accent};
  --aurora-tab-active:        ${t.colors.tabActiveBg};
  --aurora-tab-inactive:      ${t.colors.tabInactiveBg};
  --aurora-tab-text:          ${t.colors.tabText};
  --aurora-tab-close-hover:   ${t.colors.tabCloseHover};
  --aurora-tab-hover:         ${t.colors.tabHoverBg};
  --aurora-urlbar-bg:         ${t.colors.urlbarBg};
  --aurora-urlbar-text:       ${t.colors.urlbarText};
  --aurora-urlbar-border:     ${t.colors.urlbarBorder};
  --aurora-urlbar-focus:      ${t.colors.urlbarFocus};
  --aurora-browser-bg:        ${t.colors.browserBg};
  --aurora-selection:         ${t.colors.selectionBg};
  --aurora-scrollbar:         ${t.colors.scrollbar};
  --aurora-btn-bg:            ${t.colors.buttonBg};
  --aurora-btn-hover:         ${t.colors.buttonHover};
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

/* ══ Zen native sync ══ */
${Services.prefs.getBoolPref("mod.aurora.zen.sync_primary_color", true) ? `:root { --zen-primary-color: ${t.colors.accent} !important; }` : ""}

/* ══ Toolbox / Top Bar ══ */
#navigator-toolbox {
  background: var(--aurora-toolbar-bg) !important;
  border-bottom: var(--aurora-border-w) var(--aurora-border-s) var(--aurora-border) !important;
  ${blur ? `backdrop-filter: ${blur} !important;` : ""}
  ${T("background-color")}
}

/* ══ Panels (tab bar, nav bar, bookmarks) ══ */
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

/* ══ Zen sidebar ══ */
#sidebar-box,
#zen-sidebar-top-buttons,
#zen-sidebar-top-buttons-customization-target,
#zen-appcontent-navbar,
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

/* ══ Tabs ══ */
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

/* ══ URL Bar ══ */
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

/* ══ Browser content area ══ */
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

/* ══ Popup menus ══ */
menupopup,
.panel-arrowcontainer,
.panel-arrowcontent,
#appMenu-popup,
#customizationui-widget-panel {
  background: var(--aurora-panel-bg) !important;
  border: var(--aurora-border-w) var(--aurora-border-s) var(--aurora-border) !important;
  border-radius: var(--aurora-panel-r) !important;
  color: var(--aurora-panel-text) !important;
  ${blur ? `backdrop-filter: ${blur} !important;` : ""}
}

menuitem, menu {
  color: var(--aurora-panel-text) !important;
  border-radius: var(--aurora-btn-r) !important;
  ${T("background-color")}
}

menuitem:hover, menu:hover { background: var(--aurora-btn-hover) !important; }

/* ══ Selection ══ */
::selection { background: var(--aurora-selection) !important; }

/* ══ Scrollbar ══ */
scrollbar, scrollbarbutton, slider { background: transparent !important; }
thumb { background: var(--aurora-scrollbar) !important; border-radius: 999px !important; }

/* ══ Accent glow on active tab ══ */
${t.effects.accentGlow ? `.tabbrowser-tab[selected] .tab-background { box-shadow: var(--aurora-tab-shadow), var(--aurora-glow) !important; }` : ""}

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
}

export function removeTheme(targetDoc: Document = document): void {
  targetDoc.getElementById(STYLE_ID)?.remove();
}

// Inject arbitrary CSS string — used by spaces.ts for per-space overrides
export function injectStyles(css: string, id: string, targetDoc: Document = document): void {
  let el = targetDoc.getElementById(id) as HTMLStyleElement | null;
  if (!el) {
    el = targetDoc.createElement("style") as HTMLStyleElement;
    el.id = id;
    (targetDoc.head ?? targetDoc.documentElement).appendChild(el);
  }
  el.textContent = css;
}

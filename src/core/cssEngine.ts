import type { AuroraTheme } from "./state.ts";

const STYLE_ID = "aurora-dynamic-styles";

const ANIM_SPEED: Record<string, string> = {
  none:   "0s",
  slow:   "0.5s",
  normal: "0.2s",
  fast:   "0.08s",
};

export function generateCSS(t: AuroraTheme): string {
  const dur    = ANIM_SPEED[t.animations.speed] ?? "0.2s";
  const ease   = t.animations.easing;
  const trans  = `${dur} ${ease}`;
  const noAnim = t.animations.speed === "none";

  const bgImage   = t.images.browserBg ? `url("${t.images.browserBg}")` : "none";
  const panelRgba = hexToRgba(t.colors.panelBg, t.effects.panelOpacity);
  const toolbarRgba = hexToRgba(t.colors.toolbarBg, t.effects.panelOpacity);
  const sidebarRgba = hexToRgba(t.colors.sidebarBg, t.effects.panelOpacity);
  const blur = t.effects.panelBlur !== "0px" ? `blur(${t.effects.panelBlur})` : "";

  const tabShadow = t.effects.tabShadow
    ? `0 2px 8px ${t.colors.accent}66`
    : "none";

  const accentGlow = t.effects.accentGlow
    ? `0 0 12px ${t.colors.accent}88, 0 0 24px ${t.colors.accent}44`
    : "";

  return `
/* ── Aurora CSS Variables ── */
:root {
  --aurora-panel-bg:          ${panelRgba};
  --aurora-toolbar-bg:        ${toolbarRgba};
  --aurora-sidebar-bg:        ${sidebarRgba};
  --aurora-panel-text:        ${t.colors.panelText};
  --aurora-border:            ${t.colors.border};
  --aurora-border-width:      ${t.layout.borderWidth};
  --aurora-border-style:      ${t.effects.panelBorderStyle};
  --aurora-accent:            ${t.colors.accent};
  --aurora-tab-active-bg:     ${t.colors.tabActiveBg};
  --aurora-tab-inactive-bg:   ${t.colors.tabInactiveBg};
  --aurora-tab-text:          ${t.colors.tabText};
  --aurora-tab-close-hover:   ${t.colors.tabCloseHover};
  --aurora-tab-hover-bg:      ${t.colors.tabHoverBg};
  --aurora-urlbar-bg:         ${t.colors.urlbarBg};
  --aurora-urlbar-text:       ${t.colors.urlbarText};
  --aurora-urlbar-border:     ${t.colors.urlbarBorder};
  --aurora-urlbar-focus:      ${t.colors.urlbarFocus};
  --aurora-browser-bg:        ${t.colors.browserBg};
  --aurora-selection-bg:      ${t.colors.selectionBg};
  --aurora-scrollbar:         ${t.colors.scrollbar};
  --aurora-button-bg:         ${t.colors.buttonBg};
  --aurora-button-hover:      ${t.colors.buttonHover};
  --aurora-tab-height:        ${t.layout.tabHeight};
  --aurora-tab-radius:        ${t.layout.tabBorderRadius};
  --aurora-panel-radius:      ${t.layout.panelBorderRadius};
  --aurora-button-radius:     ${t.layout.buttonBorderRadius};
  --aurora-sidebar-width:     ${t.layout.sidebarWidth};
  --aurora-toolbar-height:    ${t.layout.toolbarHeight};
  --aurora-font-family:       ${t.typography.fontFamily};
  --aurora-font-size:         ${t.typography.fontSize};
  --aurora-font-weight:       ${t.typography.fontWeight};
  --aurora-anim:              ${dur};
  --aurora-ease:              ${ease};
  --aurora-blur:              ${blur};
  --aurora-bg-image:          ${bgImage};
  --aurora-bg-size:           ${t.images.bgSize};
  --aurora-bg-position:       ${t.images.bgPosition};
  --aurora-bg-blur:           ${t.images.bgBlur};
  --aurora-bg-opacity:        ${t.images.bgOpacity};
  --aurora-tab-shadow:        ${tabShadow};
  --aurora-accent-glow:       ${accentGlow};
}

/* ── Toolbars & Panels ── */
#navigator-toolbox {
  background-color: var(--aurora-toolbar-bg) !important;
  border-bottom: var(--aurora-border-width) var(--aurora-border-style) var(--aurora-border) !important;
  ${blur ? `backdrop-filter: ${blur} !important;` : ""}
}

#TabsToolbar,
#PersonalToolbar,
#nav-bar {
  background-color: var(--aurora-panel-bg) !important;
  color: var(--aurora-panel-text) !important;
  min-height: var(--aurora-toolbar-height) !important;
  font-family: var(--aurora-font-family) !important;
  font-size: var(--aurora-font-size) !important;
  font-weight: var(--aurora-font-weight) !important;
}

/* ── Sidebar ── */
#sidebar-box,
#zen-sidebar-top-buttons,
#zen-sidebar-top-buttons-customization-target,
.zen-sidebar-action-button {
  background-color: var(--aurora-sidebar-bg) !important;
  border-color: var(--aurora-border) !important;
  ${blur ? `backdrop-filter: ${blur} !important;` : ""}
}

#sidebar-box {
  min-width: var(--aurora-sidebar-width) !important;
  max-width: var(--aurora-sidebar-width) !important;
  border-right: var(--aurora-border-width) var(--aurora-border-style) var(--aurora-border) !important;
}

/* ── Tabs ── */
.tabbrowser-tab .tab-background {
  background-color: var(--aurora-tab-inactive-bg) !important;
  border-radius: var(--aurora-tab-radius) !important;
  border: var(--aurora-border-width) var(--aurora-border-style) transparent !important;
  ${noAnim ? "" : `transition: background-color ${trans}, box-shadow ${trans} !important;`}
}

.tabbrowser-tab[selected] .tab-background {
  background-color: var(--aurora-tab-active-bg) !important;
  border-color: var(--aurora-border) !important;
  box-shadow: var(--aurora-tab-shadow) !important;
}

.tabbrowser-tab:hover .tab-background {
  background-color: var(--aurora-tab-hover-bg) !important;
}

.tab-label,
.tab-text {
  color: var(--aurora-tab-text) !important;
  font-family: var(--aurora-font-family) !important;
  font-size: var(--aurora-font-size) !important;
  font-weight: var(--aurora-font-weight) !important;
}

.tab-close-button:hover {
  color: var(--aurora-tab-close-hover) !important;
}

.tabbrowser-tab {
  min-height: var(--aurora-tab-height) !important;
  max-height: var(--aurora-tab-height) !important;
}

/* ── URL Bar ── */
#urlbar,
#urlbar-background {
  background-color: var(--aurora-urlbar-bg) !important;
  color: var(--aurora-urlbar-text) !important;
  border: var(--aurora-border-width) var(--aurora-border-style) var(--aurora-urlbar-border) !important;
  border-radius: var(--aurora-panel-radius) !important;
  ${noAnim ? "" : `transition: border-color ${trans}, box-shadow ${trans} !important;`}
}

#urlbar[focused] #urlbar-background,
#urlbar:focus-within #urlbar-background {
  border-color: var(--aurora-urlbar-focus) !important;
  box-shadow: 0 0 0 2px ${t.colors.urlbarFocus}40 !important;
}

#urlbar-input {
  color: var(--aurora-urlbar-text) !important;
  font-family: var(--aurora-font-family) !important;
}

/* ── Main browser area ── */
#browser {
  background-color: var(--aurora-browser-bg) !important;
}

#browser::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image: var(--aurora-bg-image);
  background-size: var(--aurora-bg-size);
  background-position: var(--aurora-bg-position);
  background-repeat: no-repeat;
  opacity: var(--aurora-bg-opacity);
  ${t.images.bgBlur !== "0px" ? `filter: blur(var(--aurora-bg-blur));` : ""}
  pointer-events: none;
  z-index: -1;
}

/* ── Buttons & Toolbar items ── */
toolbarbutton,
.toolbarbutton-1,
.zen-sidebar-action-button {
  background-color: transparent !important;
  border-radius: var(--aurora-button-radius) !important;
  color: var(--aurora-panel-text) !important;
  ${noAnim ? "" : `transition: background-color ${trans}, opacity ${trans} !important;`}
}

toolbarbutton:hover,
.toolbarbutton-1:hover {
  background-color: var(--aurora-button-hover) !important;
  ${t.effects.accentGlow ? `box-shadow: var(--aurora-accent-glow) !important;` : ""}
}

toolbarbutton[checked="true"],
toolbarbutton[open="true"] {
  background-color: var(--aurora-button-bg) !important;
}

/* ── Popup menus ── */
menupopup,
.panel-arrowcontainer,
.panel-arrowcontent,
#appMenu-popup,
#customizationui-widget-panel {
  background-color: var(--aurora-panel-bg) !important;
  border: var(--aurora-border-width) var(--aurora-border-style) var(--aurora-border) !important;
  border-radius: var(--aurora-panel-radius) !important;
  color: var(--aurora-panel-text) !important;
  ${blur ? `backdrop-filter: ${blur} !important;` : ""}
}

menuitem,
menu {
  color: var(--aurora-panel-text) !important;
  border-radius: var(--aurora-button-radius) !important;
}

menuitem:hover,
menu:hover {
  background-color: var(--aurora-button-hover) !important;
}

/* ── Scrollbar ── */
scrollbar,
scrollbarbutton,
slider {
  background-color: transparent !important;
}

thumb {
  background-color: var(--aurora-scrollbar) !important;
  border-radius: 999px !important;
}

/* ── Accent glow na aktivní záložce ── */
${t.effects.accentGlow ? `
.tabbrowser-tab[selected] .tab-background {
  box-shadow: var(--aurora-tab-shadow), var(--aurora-accent-glow) !important;
}
` : ""}

/* ── Vypnutí animací ── */
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

export function injectStyles(css: string, targetDoc: Document = document): void {
  let el = targetDoc.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = targetDoc.createElement("style") as HTMLStyleElement;
    el.id = STYLE_ID;
    (targetDoc.head ?? targetDoc.documentElement).appendChild(el);
  }
  el.textContent = css;
}

export function removeStyles(targetDoc: Document = document): void {
  targetDoc.getElementById(STYLE_ID)?.remove();
}

export function applyTheme(theme: AuroraTheme, targetDoc: Document = document): void {
  injectStyles(generateCSS(theme), targetDoc);
}

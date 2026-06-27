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
    return {
      colors: {
        panelBg: s("mod.aurora.color.panel_bg", "#1a1a2e"),
        toolbarBg: s("mod.aurora.color.toolbar_bg", "#16162a"),
        sidebarBg: s("mod.aurora.color.sidebar_bg", "#12122a"),
        panelText: s("mod.aurora.color.panel_text", "#e0e0ff"),
        border: s("mod.aurora.color.border", "#3a3a5c"),
        accent: s("mod.aurora.color.accent", "#7c6af7"),
        tabActiveBg: s("mod.aurora.color.tab_active_bg", "#2a2a4e"),
        tabInactiveBg: s("mod.aurora.color.tab_inactive_bg", "#1a1a2e"),
        tabText: s("mod.aurora.color.tab_text", "#c0c0e0"),
        tabCloseHover: s("mod.aurora.color.tab_close_hover", "#ff6b6b"),
        tabHoverBg: s("mod.aurora.color.tab_hover_bg", "#252550"),
        urlbarBg: s("mod.aurora.color.urlbar_bg", "#1e1e3a"),
        urlbarText: s("mod.aurora.color.urlbar_text", "#e0e0ff"),
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
        borderWidth: s("mod.aurora.layout.border_width", "1px")
      },
      effects: {
        panelOpacity: s("mod.aurora.effect.panel_opacity", "1.0"),
        panelBlur: s("mod.aurora.effect.panel_blur", "0px"),
        tabShadow: b("mod.aurora.effect.tab_shadow", false),
        accentGlow: b("mod.aurora.effect.accent_glow", false),
        panelBorderStyle: s("mod.aurora.effect.panel_border_style", "solid")
      },
      sounds: {
        enabled: b("mod.aurora.sounds_enabled", false)
      },
      animations: {
        speed: s("mod.aurora.animation_speed", "normal"),
        easing: s("mod.aurora.animation.easing", "ease")
      },
      dynamicMode: s("mod.aurora.dynamic_mode", "off")
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
    return `
/* \u2550\u2550 Aurora CSS Variables \u2550\u2550 */
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
  --aurora-workspace-strip-bg:     ${t.colors.workspaceStripBg};
  --aurora-workspace-dot:          ${t.colors.workspaceDot};
  --aurora-workspace-dot-active:   ${t.colors.workspaceDotActive};
  --aurora-workspace-strip-w:      ${t.layout.workspaceStripWidth};
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

/* \u2550\u2550 Zen native sync \u2550\u2550 */
${Services.prefs.getBoolPref("mod.aurora.zen.sync_primary_color", true) ? `:root { --zen-primary-color: ${t.colors.accent} !important; }` : ""}

/* \u2550\u2550 Toolbox / Top Bar \u2550\u2550 */
#navigator-toolbox {
  background: var(--aurora-toolbar-bg) !important;
  border-bottom: var(--aurora-border-w) var(--aurora-border-s) var(--aurora-border) !important;
  ${blur ? `backdrop-filter: ${blur} !important;` : ""}
  ${T("background-color")}
}

/* \u2550\u2550 Panels (tab bar, nav bar, bookmarks) \u2550\u2550 */
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

/* \u2550\u2550 Zen sidebar \u2550\u2550 */
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

/* \u2550\u2550 Zen workspace strip (leftmost narrow panel) \u2550\u2550 */
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

/* \u2550\u2550 Tabs \u2550\u2550 */
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

/* \u2550\u2550 URL Bar \u2550\u2550 */
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

/* \u2550\u2550 Browser content area \u2550\u2550 */
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

/* \u2550\u2550 Popup menus \u2550\u2550 */
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

/* \u2550\u2550 Selection \u2550\u2550 */
::selection { background: var(--aurora-selection) !important; }

/* \u2550\u2550 Scrollbar \u2550\u2550 */
scrollbar, scrollbarbutton, slider { background: transparent !important; }
thumb { background: var(--aurora-scrollbar) !important; border-radius: 999px !important; }

/* \u2550\u2550 Accent glow on active tab \u2550\u2550 */
${t.effects.accentGlow ? `.tabbrowser-tab[selected] .tab-background { box-shadow: var(--aurora-tab-shadow), var(--aurora-glow) !important; }` : ""}

/* \u2550\u2550 Kill all animations \u2550\u2550 */
${noAnim ? "*, *::before, *::after { transition: none !important; animation: none !important; }" : ""}
`.trim();
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
  function onAuroraEvent(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }
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

  // src/features/sounds.ts
  var audioCtx = null;
  var buffers = /* @__PURE__ */ new Map();
  var roundRobinIdx = /* @__PURE__ */ new Map();
  var cleanup = null;
  var DEFAULT_PACK = {
    keydown: [],
    tabOpen: [],
    tabClose: [],
    tabClick: [],
    panelShow: [],
    panelHide: []
  };
  async function loadBuffer(ctx, base64) {
    const binary = atob(base64.replace(/^data:[^;]+;base64,/, ""));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return ctx.decodeAudioData(bytes.buffer);
  }
  async function loadPack(pack) {
    if (!audioCtx) audioCtx = new AudioContext();
    buffers.clear();
    roundRobinIdx.clear();
    const entries = Object.entries(pack);
    await Promise.all(
      entries.map(async ([key, srcs]) => {
        if (!srcs.length) return;
        const loaded = await Promise.all(srcs.map((s2) => loadBuffer(audioCtx, s2)));
        buffers.set(key, loaded);
        roundRobinIdx.set(key, 0);
      })
    );
  }
  function play(key) {
    if (!audioCtx || !buffers.has(key)) return;
    const bufs = buffers.get(key);
    if (!bufs.length) return;
    const idx = roundRobinIdx.get(key) ?? 0;
    roundRobinIdx.set(key, (idx + 1) % bufs.length);
    const source = audioCtx.createBufferSource();
    source.buffer = bufs[idx];
    source.connect(audioCtx.destination);
    source.start();
  }
  var lastKeyTime = 0;
  var KEY_THROTTLE_MS = 30;
  async function initSounds(theme) {
    stopSounds();
    if (!theme.sounds.enabled) return;
    const pack = theme.sounds.customPack ? theme.sounds.customPack : DEFAULT_PACK;
    await loadPack(pack);
    const unsub = onAuroraEvent((type) => {
      switch (type) {
        case "keydown": {
          const now = Date.now();
          if (now - lastKeyTime < KEY_THROTTLE_MS) return;
          lastKeyTime = now;
          play("keydown");
          break;
        }
        case "tab-open":
          play("tabOpen");
          break;
        case "tab-close":
          play("tabClose");
          break;
        case "tab-click":
          play("tabClick");
          break;
        case "panel-show":
          play("panelShow");
          break;
        case "panel-hide":
          play("panelHide");
          break;
      }
    });
    cleanup = unsub;
  }
  function stopSounds() {
    cleanup?.();
    cleanup = null;
    audioCtx?.close();
    audioCtx = null;
    buffers.clear();
  }

  // src/features/palette.ts
  function rgbToHex(r, g, b2) {
    return "#" + [r, g, b2].map((v) => v.toString(16).padStart(2, "0")).join("");
  }
  function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255];
  }
  function luminance(r, g, b2) {
    const sRGB = [r, g, b2].map((c) => {
      const s2 = c / 255;
      return s2 <= 0.03928 ? s2 / 12.92 : Math.pow((s2 + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  }
  function darken(hex, factor) {
    const [r, g, b2] = hexToRgb(hex);
    return rgbToHex(
      Math.round(r * (1 - factor)),
      Math.round(g * (1 - factor)),
      Math.round(b2 * (1 - factor))
    );
  }
  function lighten(hex, factor) {
    const [r, g, b2] = hexToRgb(hex);
    return rgbToHex(
      Math.min(255, Math.round(r + (255 - r) * factor)),
      Math.min(255, Math.round(g + (255 - g) * factor)),
      Math.min(255, Math.round(b2 + (255 - b2) * factor))
    );
  }
  async function extractPalette(base64Image) {
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = base64Image;
    });
    const SIZE = 64;
    const canvas = new OffscreenCanvas(SIZE, SIZE);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, SIZE, SIZE);
    const data = ctx.getImageData(0, 0, SIZE, SIZE).data;
    const pixels = [];
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b2 = data[i + 2];
      const lum2 = luminance(r, g, b2);
      if (lum2 > 0.05 && lum2 < 0.95) pixels.push([r, g, b2]);
    }
    if (!pixels.length) {
      return {
        dominant: "#7c6af7",
        primary: "#9d8fff",
        secondary: "#6a58e0",
        surface: "#1a1a2e",
        onSurface: "#e0e0ff"
      };
    }
    const dominant = medianCut(pixels, 1)[0];
    const dominantHex = rgbToHex(...dominant);
    const lum = luminance(...dominant);
    const isDark = lum < 0.3;
    return {
      dominant: dominantHex,
      primary: isDark ? lighten(dominantHex, 0.3) : darken(dominantHex, 0.2),
      secondary: isDark ? lighten(dominantHex, 0.15) : darken(dominantHex, 0.35),
      surface: isDark ? darken(dominantHex, 0.7) : lighten(dominantHex, 0.85),
      onSurface: isDark ? lighten(dominantHex, 0.9) : darken(dominantHex, 0.8)
    };
  }
  function medianCut(pixels, depth) {
    if (depth === 0 || pixels.length === 0) {
      const avg = pixels.reduce(
        ([ar, ag, ab], [r, g, b2]) => [ar + r, ag + g, ab + b2],
        [0, 0, 0]
      ).map((v) => Math.round(v / pixels.length));
      return [avg];
    }
    const ranges = [0, 1, 2].map((ch) => {
      const vals = pixels.map((p) => p[ch]);
      return Math.max(...vals) - Math.min(...vals);
    });
    const channel = ranges.indexOf(Math.max(...ranges));
    pixels.sort((a, b2) => a[channel] - b2[channel]);
    const mid = Math.floor(pixels.length / 2);
    return [
      ...medianCut(pixels.slice(0, mid), depth - 1),
      ...medianCut(pixels.slice(mid), depth - 1)
    ];
  }

  // src/features/dynamicTheme.ts
  var dynamicTimer = null;
  var faviconObserverCleanup = null;
  function sp(key, def) {
    try {
      return Services.prefs.getStringPref(key, def) || def;
    } catch {
      return def;
    }
  }
  function np(key, def) {
    const v = parseFloat(sp(key, String(def)));
    return isNaN(v) ? def : v;
  }
  function lerp(a, b2, t) {
    return Math.round(a + (b2 - a) * t);
  }
  function hexToRgb2(hex) {
    const c = hex.replace("#", "");
    return [
      parseInt(c.slice(0, 2), 16),
      parseInt(c.slice(2, 4), 16),
      parseInt(c.slice(4, 6), 16)
    ];
  }
  function rgbToHex2(r, g, b2) {
    return "#" + [r, g, b2].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
  }
  function lerpHex(a, b2, t) {
    const [ar, ag, ab] = hexToRgb2(a);
    const [br, bg, bb] = hexToRgb2(b2);
    return rgbToHex2(lerp(ar, br, t), lerp(ag, bg, t), lerp(ab, bb, t));
  }
  function boostSaturation(hex, factor) {
    const [r, g, b2] = hexToRgb2(hex).map((v) => v / 255);
    const max = Math.max(r, g, b2), min = Math.min(r, g, b2);
    const l = (max + min) / 2;
    if (max === min) return hex;
    let s2 = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
    s2 = Math.min(1, s2 * factor);
    const c = (1 - Math.abs(2 * l - 1)) * s2;
    const x = c * (1 - Math.abs((max === r ? (g - b2) / (max - min) % 6 : max === g ? (b2 - r) / (max - min) + 2 : (r - g) / (max - min) + 4) % 6 - 1));
    const m = l - c / 2;
    let rr = 0, gg = 0, bb2 = 0;
    const hh = max === r ? ((g - b2) / (max - min) * 60 + 360) % 360 : max === g ? (b2 - r) / (max - min) * 60 + 120 : (r - g) / (max - min) * 60 + 240;
    if (hh < 60) {
      rr = c;
      gg = x;
    } else if (hh < 120) {
      rr = x;
      gg = c;
    } else if (hh < 180) {
      gg = c;
      bb2 = x;
    } else if (hh < 240) {
      gg = x;
      bb2 = c;
    } else if (hh < 300) {
      rr = x;
      bb2 = c;
    } else {
      rr = c;
      bb2 = x;
    }
    return rgbToHex2((rr + m) * 255, (gg + m) * 255, (bb2 + m) * 255);
  }
  function darken2(hex, factor) {
    const [r, g, b2] = hexToRgb2(hex);
    return rgbToHex2(r * factor, g * factor, b2 * factor);
  }
  function getDayNightFactor() {
    const dayH = np("mod.aurora.dynamic.day_hour", 7);
    const nightH = np("mod.aurora.dynamic.night_hour", 20);
    const transM = np("mod.aurora.dynamic.transition_minutes", 60);
    const transH = transM / 60;
    const now = /* @__PURE__ */ new Date();
    const h = now.getHours() + now.getMinutes() / 60;
    const dayEnd = dayH + transH;
    const nightEnd = nightH + transH;
    if (h >= dayEnd && h < nightH) return 0;
    if (h >= nightEnd || h < dayH) return 1;
    if (h >= dayH && h < dayEnd) return 1 - (h - dayH) / transH;
    if (h >= nightH && h < nightEnd) return (h - nightH) / transH;
    return 0;
  }
  function applyDayNight(doc) {
    const t = getDayNightFactor();
    const dayAccent = sp("mod.aurora.dynamic.day_accent", "#4a90d9");
    const dayBg = sp("mod.aurora.dynamic.day_bg", "#1a2035");
    const dayText = sp("mod.aurora.dynamic.day_text", "#dde8ff");
    const nightAccent = sp("mod.aurora.dynamic.night_accent", "#e07840");
    const nightBg = sp("mod.aurora.dynamic.night_bg", "#1f1510");
    const nightText = sp("mod.aurora.dynamic.night_text", "#ffe0cc");
    const theme = loadTheme();
    const merged = {
      ...theme,
      colors: {
        ...theme.colors,
        accent: lerpHex(dayAccent, nightAccent, t),
        panelBg: lerpHex(dayBg, nightBg, t),
        toolbarBg: lerpHex(darken2(dayBg, 0.85), darken2(nightBg, 0.85), t),
        sidebarBg: lerpHex(darken2(dayBg, 0.75), darken2(nightBg, 0.75), t),
        panelText: lerpHex(dayText, nightText, t),
        browserBg: lerpHex(darken2(dayBg, 0.6), darken2(nightBg, 0.6), t),
        urlbarFocus: lerpHex(dayAccent, nightAccent, t),
        tabActiveBg: lerpHex(darken2(dayBg, 1.5), darken2(nightBg, 1.5), t)
      }
    };
    applyTheme(merged, doc);
  }
  async function applyMaterialTheme(doc) {
    const theme = loadTheme();
    if (!theme.images.browserBg) return;
    const palette = await extractPalette(theme.images.browserBg);
    const intensity = np("mod.aurora.dynamic.material_intensity", 0.75);
    function blend(dynamic, original) {
      return lerpHex(original, dynamic, intensity);
    }
    const merged = {
      ...theme,
      colors: {
        ...theme.colors,
        accent: blend(palette.primary, theme.colors.accent),
        panelBg: blend(palette.surface, theme.colors.panelBg),
        toolbarBg: blend(darken2(palette.surface, 0.85), theme.colors.toolbarBg),
        sidebarBg: blend(darken2(palette.surface, 0.75), theme.colors.sidebarBg),
        panelText: blend(palette.onSurface, theme.colors.panelText),
        border: blend(palette.secondary, theme.colors.border),
        browserBg: blend(darken2(palette.surface, 0.6), theme.colors.browserBg),
        tabActiveBg: blend(darken2(palette.surface, 1.5), theme.colors.tabActiveBg),
        urlbarFocus: blend(palette.primary, theme.colors.urlbarFocus)
      }
    };
    applyTheme(merged, doc);
  }
  async function extractFaviconColor() {
    try {
      const tab = window.gBrowser?.selectedTab;
      if (!tab) return null;
      const uri = tab.linkedBrowser?.currentURI?.spec;
      if (!uri || uri.startsWith("about:") || uri.startsWith("moz-extension:")) return null;
      const faviconURL = await new Promise((resolve) => {
        try {
          const svc = ChromeUtils.import("resource://gre/modules/PlacesUtils.sys.mjs");
          const PlacesUtils = svc.PlacesUtils;
          if (!PlacesUtils?.favicons) {
            resolve(null);
            return;
          }
          const pageURI = Services.io.newURI(uri);
          PlacesUtils.favicons.getFaviconURLForPage(pageURI, (faviconUri) => {
            resolve(faviconUri?.spec ?? null);
          });
        } catch {
          resolve(null);
        }
      });
      if (!faviconURL) return null;
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = faviconURL;
      });
      const canvas = new OffscreenCanvas(16, 16);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, 16, 16);
      const data = ctx.getImageData(0, 0, 16, 16).data;
      let r = 0, g = 0, b2 = 0, count = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 128) continue;
        r += data[i];
        g += data[i + 1];
        b2 += data[i + 2];
        count++;
      }
      if (count === 0) return null;
      const satBoost = np("mod.aurora.dynamic.favicon_saturation_boost", 1.2);
      const raw = rgbToHex2(r / count, g / count, b2 / count);
      return boostSaturation(raw, satBoost);
    } catch {
      return null;
    }
  }
  var lastTabFaviconColor = "";
  async function applyTabAccent(doc) {
    const fallback = sp("mod.aurora.dynamic.favicon_fallback", "#7c6af7");
    const color = await extractFaviconColor() ?? fallback;
    if (color === lastTabFaviconColor) return;
    lastTabFaviconColor = color;
    const theme = loadTheme();
    const merged = {
      ...theme,
      colors: {
        ...theme.colors,
        accent: color,
        urlbarFocus: color,
        tabActiveBg: darken2(color, 0.3)
      }
    };
    applyTheme(merged, doc);
  }
  function initDynamicTheme(doc) {
    stopDynamicTheme();
    const theme = loadTheme();
    if (theme.dynamicMode === "material") {
      applyMaterialTheme(doc).catch(() => {
      });
      dynamicTimer = setInterval(() => applyMaterialTheme(doc).catch(() => {
      }), 5 * 60 * 1e3);
    } else if (theme.dynamicMode === "daynight") {
      applyDayNight(doc);
      dynamicTimer = setInterval(() => applyDayNight(doc), 60 * 1e3);
    } else if (theme.dynamicMode === "tab_accent") {
      applyTabAccent(doc).catch(() => {
      });
      const onTab = () => applyTabAccent(doc).catch(() => {
      });
      doc.addEventListener("TabSelect", onTab, { capture: true });
      dynamicTimer = setInterval(() => applyTabAccent(doc).catch(() => {
      }), 5e3);
      faviconObserverCleanup = () => {
        doc.removeEventListener("TabSelect", onTab, true);
      };
    }
  }
  function stopDynamicTheme() {
    if (dynamicTimer !== null) {
      clearInterval(dynamicTimer);
      dynamicTimer = null;
    }
    faviconObserverCleanup?.();
    faviconObserverCleanup = null;
    lastTabFaviconColor = "";
  }
  function getDynamicStatus() {
    try {
      const mode = Services.prefs.getStringPref("mod.aurora.dynamic_mode", "off");
      if (mode === "off") return "Vypnuto";
      if (mode === "material") {
        const i = np("mod.aurora.dynamic.material_intensity", 0.75);
        return `Material You \u2014 intenzita ${Math.round(i * 100)}%`;
      }
      if (mode === "daynight") {
        const t = getDayNightFactor();
        const pct = Math.round(t * 100);
        const label = pct < 10 ? "\u{1F31E} Den" : pct > 90 ? "\u{1F319} Noc" : `\u{1F306} P\u0159echod ${pct}% noc`;
        const dayH = np("mod.aurora.dynamic.day_hour", 7);
        const nightH = np("mod.aurora.dynamic.night_hour", 20);
        return `${label} (den od ${dayH}:00, noc od ${nightH}:00)`;
      }
      if (mode === "tab_accent") {
        return `Favicon akcent${lastTabFaviconColor ? `: ${lastTabFaviconColor}` : " \u2014 \u010Dek\xE1m na z\xE1lo\u017Eku"}`;
      }
      return mode;
    } catch {
      return "\u2014";
    }
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

  // src/ui/colorDefs.ts
  var GLOBAL_COLORS = [
    { pref: "mod.aurora.color.panel_bg", label: "Pozad\xED panel\u016F", default: "#1a1a2e" },
    { pref: "mod.aurora.color.toolbar_bg", label: "Pozad\xED toolbaru", default: "#16162a" },
    { pref: "mod.aurora.color.sidebar_bg", label: "Pozad\xED sidebaru", default: "#12122a" },
    { pref: "mod.aurora.color.panel_text", label: "Text v panelech", default: "#e0e0ff" },
    { pref: "mod.aurora.color.border", label: "Ohrani\u010Den\xED", default: "#3a3a5c" },
    { pref: "mod.aurora.color.accent", label: "Akcent", default: "#7c6af7" },
    { pref: "mod.aurora.color.tab_active_bg", label: "Aktivn\xED z\xE1lo\u017Eka", default: "#2a2a4e" },
    { pref: "mod.aurora.color.tab_inactive_bg", label: "Neaktivn\xED z\xE1lo\u017Eka", default: "#1a1a2e" },
    { pref: "mod.aurora.color.tab_text", label: "Text z\xE1lo\u017Eek", default: "#c0c0e0" },
    { pref: "mod.aurora.color.tab_close_hover", label: "Zav\u0159\xEDt z\xE1lo\u017Eku (hover)", default: "#ff6b6b" },
    { pref: "mod.aurora.color.tab_hover_bg", label: "Z\xE1lo\u017Eka hover pozad\xED", default: "#252550" },
    { pref: "mod.aurora.color.urlbar_bg", label: "URL li\u0161ta pozad\xED", default: "#1e1e3a" },
    { pref: "mod.aurora.color.urlbar_text", label: "URL li\u0161ta text", default: "#e0e0ff" },
    { pref: "mod.aurora.color.urlbar_border", label: "URL li\u0161ta ohrani\u010Den\xED", default: "#3a3a6c" },
    { pref: "mod.aurora.color.urlbar_focus", label: "URL li\u0161ta fokus", default: "#7c6af7" },
    { pref: "mod.aurora.color.browser_bg", label: "Pozad\xED prohl\xED\u017Ee\u010De", default: "#0f0f1a" },
    { pref: "mod.aurora.color.selection_bg", label: "V\xFDb\u011Br textu", default: "#7c6af740" },
    { pref: "mod.aurora.color.scrollbar", label: "Scrollbar", default: "#3a3a6c" },
    { pref: "mod.aurora.color.button_bg", label: "Tla\u010D\xEDtka pozad\xED", default: "#2a2a4e" },
    { pref: "mod.aurora.color.button_hover", label: "Tla\u010D\xEDtka hover", default: "#3a3a6e" },
    { pref: "mod.aurora.color.workspace_strip_bg", label: "Workspace strip pozad\xED", default: "#0d0d1e" },
    { pref: "mod.aurora.color.workspace_dot", label: "Workspace dot", default: "#3a3a6c" },
    { pref: "mod.aurora.color.workspace_dot_active", label: "Workspace dot (aktivn\xED)", default: "#7c6af7" }
  ];
  var SPACE_COLORS = [
    { key: "accent", label: "Akcent", default: "" },
    { key: "panel_bg", label: "Pozad\xED panel\u016F", default: "" },
    { key: "toolbar_bg", label: "Pozad\xED toolbaru", default: "" },
    { key: "sidebar_bg", label: "Pozad\xED sidebaru", default: "" },
    { key: "tab_active_bg", label: "Aktivn\xED z\xE1lo\u017Eka", default: "" }
  ];
  var SPACE_COUNT = 6;
  function spaceColorPref(spaceIdx, key) {
    return `mod.aurora.space.${spaceIdx + 1}.${key}`;
  }

  // src/ui/colorPicker.ts
  var PICKER_ID = "aurora-cp-popup";
  var PRESETS = [
    "#ffffff",
    "#d4d4d4",
    "#a0a0a0",
    "#6e6e6e",
    "#3c3c3c",
    "#1a1a1a",
    "#0a0a0a",
    "#000000",
    "#7c6af7",
    "#a78bfa",
    "#4d96ff",
    "#60c6f7",
    "#6bcb77",
    "#ffd93d",
    "#ff9f40",
    "#ff6b6b",
    "#f472b6",
    "#e879f9",
    "#0f0f1a",
    "#1a1a2e",
    "#12122a",
    "#16162a",
    "#1e1e3a",
    "#2a2a4e"
  ];
  var PICKER_CSS = `
#aurora-cp-popup {
  position: fixed;
  z-index: 2147483647;
  width: 232px;
  background: #0f0f22;
  border: 1px solid #3a3a6c;
  border-radius: 12px;
  box-shadow: 0 8px 32px #00000099;
  padding: 12px;
  display: none;
  flex-direction: column;
  gap: 10px;
  user-select: none;
}
#aurora-cp-popup.open { display: flex; }

.aurora-cp-square {
  width: 208px;
  height: 164px;
  border-radius: 8px;
  position: relative;
  cursor: crosshair;
  flex-shrink: 0;
  overflow: hidden;
}
.aurora-cp-sq-color {
  position: absolute; inset: 0;
  background: linear-gradient(to right, #fff, var(--acp-hue-color));
}
.aurora-cp-sq-dark {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, transparent, #000);
}
.aurora-cp-cursor {
  position: absolute;
  width: 14px; height: 14px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px #0008;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.aurora-cp-hue-wrap {
  position: relative;
  height: 14px;
  border-radius: 7px;
  overflow: hidden;
  background: linear-gradient(to right,
    hsl(0,100%,50%), hsl(30,100%,50%), hsl(60,100%,50%), hsl(90,100%,50%),
    hsl(120,100%,50%), hsl(150,100%,50%), hsl(180,100%,50%), hsl(210,100%,50%),
    hsl(240,100%,50%), hsl(270,100%,50%), hsl(300,100%,50%), hsl(330,100%,50%),
    hsl(360,100%,50%));
  cursor: pointer;
}
.aurora-cp-hue-thumb {
  position: absolute;
  top: 50%; transform: translate(-50%,-50%);
  width: 18px; height: 18px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px #0008, 0 2px 6px #0008;
  pointer-events: none;
  background: var(--acp-hue-color);
}

.aurora-cp-presets {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
}
.aurora-cp-swatch {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.1s, border-color 0.1s;
}
.aurora-cp-swatch:hover { transform: scale(1.2); }
.aurora-cp-swatch.selected { border-color: #fff; }

.aurora-cp-hex-row {
  display: flex;
  gap: 6px;
  align-items: center;
}
.aurora-cp-preview {
  width: 28px; height: 28px;
  border-radius: 6px;
  border: 1px solid #3a3a6c;
  flex-shrink: 0;
}
.aurora-cp-hex-input {
  flex: 1;
  background: #1a1a32;
  border: 1px solid #2d2d5c;
  border-radius: 6px;
  color: #c0b4ff;
  font-size: 12px;
  font-family: monospace;
  padding: 5px 8px;
  text-align: center;
}
.aurora-cp-hex-input:focus { outline: 1px solid #7c6af7; border-color: #7c6af7; }
.aurora-cp-ok {
  padding: 5px 12px;
  background: #7c6af7;
  border: none;
  border-radius: 6px;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.1s;
}
.aurora-cp-ok:hover { background: #9080ff; }
`;
  function hsvToHex(h, s2, v) {
    const c = v * s2;
    const x = c * (1 - Math.abs(h / 60 % 2 - 1));
    const m = v - c;
    let r = 0, g = 0, b2 = 0;
    if (h < 60) {
      r = c;
      g = x;
    } else if (h < 120) {
      r = x;
      g = c;
    } else if (h < 180) {
      g = c;
      b2 = x;
    } else if (h < 240) {
      g = x;
      b2 = c;
    } else if (h < 300) {
      r = x;
      b2 = c;
    } else {
      r = c;
      b2 = x;
    }
    return "#" + [r + m, g + m, b2 + m].map((n) => Math.round(n * 255).toString(16).padStart(2, "0")).join("");
  }
  function hexToHsv(hex) {
    const clean = hex.replace("#", "").slice(0, 6);
    if (clean.length < 6) return [0, 0, 0.5];
    const r = parseInt(clean.slice(0, 2), 16) / 255;
    const g = parseInt(clean.slice(2, 4), 16) / 255;
    const b2 = parseInt(clean.slice(4, 6), 16) / 255;
    const max = Math.max(r, g, b2);
    const min = Math.min(r, g, b2);
    const d = max - min;
    let h = 0;
    if (d > 0) {
      if (max === r) h = (g - b2) / d % 6;
      else if (max === g) h = (b2 - r) / d + 2;
      else h = (r - g) / d + 4;
      h = Math.round(h * 60);
      if (h < 0) h += 360;
    }
    return [h, max > 0 ? d / max : 0, max];
  }
  function hueColor(h) {
    return `hsl(${h}, 100%, 50%)`;
  }
  function clamp(n, lo, hi) {
    return Math.max(lo, Math.min(hi, n));
  }
  var pickerH = 220;
  var pickerS = 0.7;
  var pickerV = 0.9;
  var onChangeCb = null;
  var squareDragging = false;
  var hueDragging = false;
  var squareEl = null;
  var cursorEl = null;
  var hueWrapEl = null;
  var hueThumbEl = null;
  var hexInputEl = null;
  var previewEl = null;
  var popupEl = null;
  function updateUI() {
    if (!squareEl || !cursorEl || !hueThumbEl || !hexInputEl || !previewEl) return;
    const hex = hsvToHex(pickerH, pickerS, pickerV);
    const hCol = hueColor(pickerH);
    squareEl.style.setProperty("--acp-hue-color", hCol);
    cursorEl.style.left = `${pickerS * 100}%`;
    cursorEl.style.top = `${(1 - pickerV) * 100}%`;
    hueWrapEl.style.setProperty("--acp-hue-color", hCol);
    hueThumbEl.style.left = `${pickerH / 360 * 100}%`;
    hueThumbEl.style.setProperty("--acp-hue-color", hCol);
    hexInputEl.value = hex;
    previewEl.style.background = hex;
    popupEl?.querySelectorAll(".aurora-cp-swatch").forEach((sw) => {
      sw.classList.toggle("selected", sw.dataset.color === hex);
    });
  }
  function emit2() {
    const hex = hsvToHex(pickerH, pickerS, pickerV);
    onChangeCb?.(hex);
  }
  function onSquarePointerDown(e) {
    squareDragging = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromSquare(e);
  }
  function onSquarePointerMove(e) {
    if (!squareDragging || !squareEl) return;
    updateFromSquare(e);
  }
  function onSquarePointerUp() {
    squareDragging = false;
  }
  function updateFromSquare(e) {
    if (!squareEl) return;
    const rect = squareEl.getBoundingClientRect();
    pickerS = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    pickerV = clamp(1 - (e.clientY - rect.top) / rect.height, 0, 1);
    updateUI();
    emit2();
  }
  function onHuePointerDown(e) {
    hueDragging = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromHue(e);
  }
  function onHuePointerMove(e) {
    if (!hueDragging || !hueWrapEl) return;
    updateFromHue(e);
  }
  function onHuePointerUp() {
    hueDragging = false;
  }
  function updateFromHue(e) {
    if (!hueWrapEl) return;
    const rect = hueWrapEl.getBoundingClientRect();
    pickerH = Math.round(clamp((e.clientX - rect.left) / rect.width, 0, 1) * 360);
    updateUI();
    emit2();
  }
  function onHexChange() {
    if (!hexInputEl) return;
    const raw = hexInputEl.value.trim().replace(/^#/, "");
    if (/^[0-9a-f]{6}$/i.test(raw)) {
      const [h, s2, v] = hexToHsv(`#${raw}`);
      pickerH = h;
      pickerS = s2;
      pickerV = v;
      updateUI();
      emit2();
    }
  }
  function initColorPicker(doc) {
    if (doc.getElementById(PICKER_ID)) return;
    const styleId = "aurora-cp-styles";
    if (!doc.getElementById(styleId)) {
      const s2 = doc.createElement("style");
      s2.id = styleId;
      s2.textContent = PICKER_CSS;
      (doc.head ?? doc.documentElement).appendChild(s2);
    }
    popupEl = doc.createElement("div");
    popupEl.id = PICKER_ID;
    const square = doc.createElement("div");
    square.className = "aurora-cp-square";
    const sqColor = doc.createElement("div");
    sqColor.className = "aurora-cp-sq-color";
    const sqDark = doc.createElement("div");
    sqDark.className = "aurora-cp-sq-dark";
    const cursor = doc.createElement("div");
    cursor.className = "aurora-cp-cursor";
    square.appendChild(sqColor);
    square.appendChild(sqDark);
    square.appendChild(cursor);
    squareEl = square;
    cursorEl = cursor;
    square.addEventListener("pointerdown", onSquarePointerDown);
    square.addEventListener("pointermove", onSquarePointerMove);
    square.addEventListener("pointerup", onSquarePointerUp);
    const hueWrap = doc.createElement("div");
    hueWrap.className = "aurora-cp-hue-wrap";
    const hueThumb = doc.createElement("div");
    hueThumb.className = "aurora-cp-hue-thumb";
    hueWrap.appendChild(hueThumb);
    hueWrapEl = hueWrap;
    hueThumbEl = hueThumb;
    hueWrap.addEventListener("pointerdown", onHuePointerDown);
    hueWrap.addEventListener("pointermove", onHuePointerMove);
    hueWrap.addEventListener("pointerup", onHuePointerUp);
    const presetsGrid = doc.createElement("div");
    presetsGrid.className = "aurora-cp-presets";
    for (const col of PRESETS) {
      const sw = doc.createElement("div");
      sw.className = "aurora-cp-swatch";
      sw.dataset.color = col;
      sw.style.background = col;
      sw.title = col;
      sw.addEventListener("click", () => {
        const [h, s2, v] = hexToHsv(col);
        pickerH = h;
        pickerS = s2;
        pickerV = v;
        updateUI();
        emit2();
      });
      presetsGrid.appendChild(sw);
    }
    const hexRow = doc.createElement("div");
    hexRow.className = "aurora-cp-hex-row";
    const preview = doc.createElement("div");
    preview.className = "aurora-cp-preview";
    const hexIn = doc.createElement("input");
    hexIn.type = "text";
    hexIn.className = "aurora-cp-hex-input";
    hexIn.maxLength = 7;
    hexIn.placeholder = "#rrggbb";
    hexIn.addEventListener("change", onHexChange);
    hexIn.addEventListener("keydown", (e) => {
      if (e.key === "Enter") onHexChange();
    });
    const okBtn = doc.createElement("button");
    okBtn.textContent = "OK";
    okBtn.className = "aurora-cp-ok";
    okBtn.addEventListener("click", () => closeColorPicker());
    hexRow.appendChild(preview);
    hexRow.appendChild(hexIn);
    hexRow.appendChild(okBtn);
    previewEl = preview;
    hexInputEl = hexIn;
    popupEl.appendChild(square);
    popupEl.appendChild(hueWrap);
    popupEl.appendChild(presetsGrid);
    popupEl.appendChild(hexRow);
    doc.documentElement.appendChild(popupEl);
    doc.addEventListener("pointerdown", (e) => {
      if (!popupEl?.classList.contains("open")) return;
      if (!popupEl.contains(e.target)) closeColorPicker();
    }, { capture: true });
  }
  function openColorPicker(anchorEl, currentHex, onChange) {
    if (!popupEl) return;
    onChangeCb = onChange;
    const [h, s2, v] = hexToHsv(currentHex || "#7c6af7");
    pickerH = h;
    pickerS = s2;
    pickerV = v;
    updateUI();
    const rect = anchorEl.getBoundingClientRect();
    const PICKER_W = 244;
    const PICKER_H = 310;
    const nearRightEdge = rect.left + PICKER_W > window.innerWidth - 20;
    let left = nearRightEdge ? rect.right - PICKER_W : rect.left;
    let top = rect.bottom + 6;
    if (top + PICKER_H > window.innerHeight - 8) {
      top = rect.top - PICKER_H - 6;
    }
    left = Math.max(4, Math.min(left, window.innerWidth - PICKER_W - 4));
    top = Math.max(4, Math.min(top, window.innerHeight - PICKER_H - 4));
    popupEl.style.top = `${top}px`;
    popupEl.style.left = `${left}px`;
    popupEl.classList.add("open");
  }
  function closeColorPicker() {
    popupEl?.classList.remove("open");
  }

  // src/ui/controls.ts
  function getPref(pref, def = "") {
    try {
      return Services.prefs.getStringPref(pref, def) || def;
    } catch {
      return def;
    }
  }
  function getBoolPref(pref, def = false) {
    try {
      return Services.prefs.getBoolPref(pref, def);
    } catch {
      return def;
    }
  }
  function setPref(pref, v) {
    try {
      Services.prefs.setStringPref(pref, v);
    } catch {
    }
  }
  function setBoolPref(pref, v) {
    try {
      Services.prefs.setBoolPref(pref, v);
    } catch {
    }
  }
  function row(doc, label) {
    const wrap = doc.createElement("div");
    wrap.className = "aoc-row";
    const lbl = doc.createElement("label");
    lbl.className = "aoc-label";
    lbl.textContent = label;
    wrap.appendChild(lbl);
    return [wrap, lbl];
  }
  function buildToggle(doc, container, label, pref, def = false, onChange) {
    const [wrap] = row(doc, label);
    wrap.classList.add("aoc-row-toggle");
    const tog = doc.createElement("div");
    tog.className = "aoc-toggle" + (getBoolPref(pref, def) ? " on" : "");
    tog.tabIndex = 0;
    const thumb = doc.createElement("div");
    thumb.className = "aoc-thumb";
    tog.appendChild(thumb);
    const update = (v) => {
      tog.classList.toggle("on", v);
      setBoolPref(pref, v);
      onChange?.(v);
    };
    tog.addEventListener("click", () => update(!tog.classList.contains("on")));
    tog.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") update(!tog.classList.contains("on"));
    });
    wrap.appendChild(tog);
    container.appendChild(wrap);
  }
  function buildSlider(doc, container, label, pref, min, max, step, unit, def, onChange) {
    const [wrap] = row(doc, "");
    wrap.classList.add("aoc-row-slider");
    const lbl = doc.createElement("span");
    lbl.className = "aoc-label";
    lbl.textContent = label;
    const valDisp = doc.createElement("span");
    valDisp.className = "aoc-slider-val";
    const labelRow = doc.createElement("div");
    labelRow.className = "aoc-slider-header";
    labelRow.appendChild(lbl);
    labelRow.appendChild(valDisp);
    const slider = doc.createElement("input");
    slider.type = "range";
    slider.min = String(min);
    slider.max = String(max);
    slider.step = String(step);
    slider.className = "aoc-slider";
    const currentStr = getPref(pref, `${def}${unit}`);
    const currentNum = parseFloat(currentStr) || def;
    slider.value = String(currentNum);
    valDisp.textContent = `${currentNum}${unit}`;
    slider.addEventListener("input", () => {
      const v = `${slider.value}${unit}`;
      valDisp.textContent = v;
      setPref(pref, v);
      onChange?.(v);
    });
    wrap.appendChild(labelRow);
    wrap.appendChild(slider);
    container.appendChild(wrap);
  }
  function buildSelect(doc, container, label, pref, options, def, onChange) {
    const [wrap] = row(doc, label);
    wrap.classList.add("aoc-row-select");
    const sel = doc.createElement("select");
    sel.className = "aoc-select";
    const cur = getPref(pref, def);
    for (const opt of options) {
      const o = doc.createElement("option");
      o.value = opt.value;
      o.textContent = opt.label;
      if (opt.value === cur) o.selected = true;
      sel.appendChild(o);
    }
    sel.addEventListener("change", () => {
      setPref(pref, sel.value);
      onChange?.(sel.value);
    });
    wrap.appendChild(sel);
    container.appendChild(wrap);
  }
  function buildTextInput(doc, container, label, pref, placeholder, def = "", onChange) {
    const [wrap] = row(doc, label);
    wrap.classList.add("aoc-row-text");
    const inp = doc.createElement("input");
    inp.type = "text";
    inp.className = "aoc-input";
    inp.value = getPref(pref, def);
    inp.placeholder = placeholder;
    inp.addEventListener("change", () => {
      setPref(pref, inp.value);
      onChange?.(inp.value);
    });
    wrap.appendChild(inp);
    container.appendChild(wrap);
  }
  function buildSectionHeading(doc, container, text) {
    const h = doc.createElement("div");
    h.className = "aoc-section-heading";
    h.textContent = text;
    container.appendChild(h);
  }

  // src/ui/overlay.ts
  var OVERLAY_ID = "aurora-overlay";
  var BACKDROP_ID = "aurora-backdrop";
  var STYLES_ID = "aurora-overlay-styles";
  var CSS = `
/* Backdrop */
#aurora-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.72);
  z-index: 2147483640;
  opacity: 0; pointer-events: none;
  transition: opacity 0.18s ease;
}
#aurora-backdrop.open { opacity: 1; pointer-events: auto; }

/* Overlay dialog */
#aurora-overlay {
  position: fixed;
  inset: 0;
  z-index: 2147483641;
  display: flex;
  opacity: 0; pointer-events: none;
  transform: scale(0.97);
  transition: opacity 0.18s ease, transform 0.18s ease;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 13px;
  color: #e0e0ff;
}
#aurora-overlay.open { opacity: 1; pointer-events: auto; transform: scale(1); }

/* Left nav */
.ao-nav {
  width: 180px;
  flex-shrink: 0;
  background: #0b0b1f;
  border-right: 1px solid #1e1e44;
  display: flex;
  flex-direction: column;
  padding: 16px 0 8px;
  overflow-y: auto;
}
.ao-nav-logo {
  padding: 0 16px 16px;
  font-size: 16px;
  font-weight: 800;
  color: #a89bff;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #1e1e44;
  margin-bottom: 8px;
}
.ao-nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 16px;
  cursor: pointer;
  color: #6660aa;
  border-radius: 0;
  border-left: 2px solid transparent;
  transition: color 0.1s, background 0.1s, border-color 0.1s;
  user-select: none;
  font-size: 12.5px;
}
.ao-nav-item:hover { color: #c0b4ff; background: #12123a; }
.ao-nav-item.active {
  color: #c0b4ff;
  background: #16163a;
  border-left-color: #7c6af7;
  font-weight: 600;
}
.ao-nav-icon { font-size: 15px; width: 18px; text-align: center; }
.ao-nav-sep {
  height: 1px; background: #1e1e44;
  margin: 8px 16px;
}
.ao-nav-actions { margin-top: auto; padding: 8px; display: flex; flex-direction: column; gap: 6px; }
.ao-nav-btn {
  padding: 7px 10px;
  border: 1px solid #2d2d5c;
  border-radius: 8px;
  background: #0f0f28;
  color: #8880cc;
  font-size: 11px;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: background 0.1s, color 0.1s, border-color 0.1s;
  display: flex; align-items: center; gap: 6px;
}
.ao-nav-btn:hover { background: #1a1a3a; color: #c0b4ff; border-color: #4a4a8a; }
.ao-nav-btn.danger { border-color: #4a1a1a; color: #c06060; }
.ao-nav-btn.danger:hover { background: #2a1010; border-color: #8a2a2a; color: #ff8080; }

/* Main content */
.ao-main {
  flex: 1;
  background: #10102a;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.ao-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 24px;
  border-bottom: 1px solid #1e1e44;
  background: #0d0d22;
  flex-shrink: 0;
}
.ao-header-title {
  font-size: 15px; font-weight: 700; color: #c0b4ff;
  display: flex; align-items: center; gap: 8px;
}
.ao-header-sub { font-size: 11px; color: #5550aa; font-weight: 400; margin-left: 4px; }
.ao-header-close {
  background: #1a1a38; border: 1px solid #2d2d5c;
  border-radius: 8px; color: #8880cc;
  font-size: 13px; cursor: pointer; padding: 5px 12px;
  font-family: inherit; transition: background 0.1s, color 0.1s;
}
.ao-header-close:hover { background: #2a2a4e; color: #e0e0ff; }

.ao-content {
  flex: 1; overflow-y: auto; padding: 24px;
}
.ao-content::-webkit-scrollbar { width: 4px; }
.ao-content::-webkit-scrollbar-track { background: transparent; }
.ao-content::-webkit-scrollbar-thumb { background: #2d2d5c; border-radius: 4px; }

.ao-section { display: none; }
.ao-section.active { display: block; }

/* \u2500\u2500 Controls \u2500\u2500 */
.aoc-section-heading {
  font-size: 10px; font-weight: 700; letter-spacing: 1.2px;
  text-transform: uppercase; color: #4a4a8a;
  padding: 16px 0 8px; margin-top: 8px;
}
.aoc-section-heading:first-child { padding-top: 0; margin-top: 0; }

.aoc-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #16163a;
  gap: 12px;
  min-height: 40px;
}
.aoc-row:last-child { border-bottom: none; }
.aoc-label { color: #b0b0d0; font-size: 12.5px; flex: 1; }

/* Color row */
.aoc-color-swatch {
  width: 28px; height: 28px; border-radius: 7px;
  border: 2px solid #2d2d5c; cursor: pointer; flex-shrink: 0;
  transition: border-color 0.12s, transform 0.12s;
}
.aoc-color-swatch:hover { border-color: #7c6af7; transform: scale(1.08); }
.aoc-color-hex {
  width: 74px; background: #0d0d22;
  border: 1px solid #2d2d5c; border-radius: 6px;
  color: #c0b4ff; font-size: 11px; font-family: monospace;
  padding: 5px 6px; text-align: center; flex-shrink: 0;
}
.aoc-color-hex:focus { outline: 1px solid #7c6af7; border-color: #7c6af7; }

/* Toggle */
.aoc-row-toggle { }
.aoc-toggle {
  width: 36px; height: 20px; border-radius: 10px;
  background: #2a2a4e; flex-shrink: 0;
  position: relative; cursor: pointer;
  transition: background 0.15s;
  outline: none;
}
.aoc-toggle:focus-visible { box-shadow: 0 0 0 2px #7c6af7; }
.aoc-toggle.on { background: #7c6af7; }
.aoc-thumb {
  position: absolute; top: 2px; left: 2px;
  width: 16px; height: 16px; border-radius: 8px;
  background: #fff; transition: left 0.15s;
}
.aoc-toggle.on .aoc-thumb { left: 18px; }

/* Slider */
.aoc-row-slider { flex-direction: column; align-items: stretch; gap: 4px; }
.aoc-slider-header { display: flex; justify-content: space-between; align-items: center; }
.aoc-slider-val { color: #7c6af7; font-size: 12px; font-family: monospace; }
.aoc-slider {
  width: 100%; height: 4px; cursor: pointer;
  accent-color: #7c6af7;
  -webkit-appearance: none; appearance: none;
  background: #2d2d5c; border-radius: 2px;
}
.aoc-slider::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 16px; height: 16px; border-radius: 50%;
  background: #7c6af7; cursor: pointer;
  box-shadow: 0 0 0 2px #0d0d22;
}

/* Select */
.aoc-row-select { }
.aoc-select {
  background: #0d0d22; border: 1px solid #2d2d5c;
  border-radius: 6px; color: #c0b4ff;
  font-size: 12px; font-family: inherit;
  padding: 5px 8px; cursor: pointer; flex-shrink: 0;
  min-width: 180px;
}
.aoc-select:focus { outline: 1px solid #7c6af7; border-color: #7c6af7; }

/* Text input */
.aoc-row-text { }
.aoc-input {
  background: #0d0d22; border: 1px solid #2d2d5c;
  border-radius: 6px; color: #c0b4ff;
  font-size: 12px; font-family: inherit;
  padding: 5px 8px; flex: 1; min-width: 0;
}
.aoc-input:focus { outline: 1px solid #7c6af7; border-color: #7c6af7; }

/* Space tabs */
.ao-space-tabs {
  display: flex; gap: 4px; margin-bottom: 16px; flex-wrap: wrap;
}
.ao-space-tab {
  padding: 5px 12px; border-radius: 6px;
  border: 1px solid #2d2d5c;
  background: #0d0d22; color: #6660aa;
  font-size: 12px; cursor: pointer; font-family: inherit;
  transition: background 0.1s, color 0.1s, border-color 0.1s;
}
.ao-space-tab:hover { color: #c0b4ff; border-color: #4a4a8a; }
.ao-space-tab.active { background: #1e1e3e; color: #c0b4ff; border-color: #7c6af7; }
.ao-space-content { display: none; }
.ao-space-content.active { display: block; }

/* Dynamic status */
.ao-dynamic-status {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; margin-bottom: 12px;
  background: #0d0d22; border: 1px solid #1e1e44;
  border-radius: 8px; font-size: 11.5px; color: #9090c0;
}
.ao-dynamic-dot { width: 8px; height: 8px; border-radius: 50%; background: #3a3a6c; flex-shrink: 0; }
.ao-dynamic-dot.on { background: #7c6af7; box-shadow: 0 0 8px #7c6af7; }

/* Dynamic sub-config */
.ao-dynamic-config { display: none; margin-top: 8px; }
.ao-dynamic-config.visible { display: block; }

/* Presets */
.ao-preset-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.ao-preset-item {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; background: #0d0d22;
  border: 1px solid #1e1e44; border-radius: 8px;
  transition: border-color 0.1s;
}
.ao-preset-item:hover { border-color: #2d2d5c; }
.ao-preset-swatch-row {
  display: flex; gap: 3px; flex-shrink: 0;
}
.ao-preset-swatch {
  width: 14px; height: 14px; border-radius: 3px;
}
.ao-preset-name { flex: 1; color: #c0b4ff; font-size: 12.5px; }
.ao-preset-time { color: #5550aa; font-size: 11px; white-space: nowrap; }
.ao-preset-btn {
  padding: 4px 10px; border-radius: 5px; font-size: 11px;
  border: 1px solid #2d2d5c; background: #141432; color: #8880cc;
  cursor: pointer; font-family: inherit;
  transition: background 0.1s, color 0.1s;
}
.ao-preset-btn:hover { background: #1e1e44; color: #c0b4ff; }
.ao-preset-btn.load { border-color: #7c6af7; color: #a89bff; }
.ao-preset-btn.load:hover { background: #1e1e4a; }
.ao-preset-btn.del:hover { border-color: #8a2a2a; color: #ff8080; }

.ao-preset-save {
  display: flex; gap: 8px; align-items: center; margin-top: 4px;
}
.ao-preset-name-in {
  flex: 1; background: #0d0d22; border: 1px solid #2d2d5c;
  border-radius: 6px; color: #c0b4ff; font-size: 12px;
  font-family: inherit; padding: 7px 10px;
}
.ao-preset-name-in:focus { outline: 1px solid #7c6af7; border-color: #7c6af7; }
.ao-preset-save-btn {
  padding: 7px 16px; background: #7c6af7; border: none;
  border-radius: 6px; color: #fff; font-size: 12px;
  cursor: pointer; font-family: inherit;
  transition: background 0.1s;
}
.ao-preset-save-btn:hover { background: #9080ff; }

/* About */
.ao-about-card {
  padding: 16px; background: #0d0d22;
  border: 1px solid #1e1e44; border-radius: 10px;
  margin-bottom: 12px;
}
.ao-about-title { font-size: 18px; font-weight: 700; color: #a89bff; margin-bottom: 4px; }
.ao-about-sub { font-size: 12px; color: #5550aa; }
.ao-about-row { display: flex; gap: 6px; margin-top: 12px; }
.ao-about-link {
  padding: 6px 14px; border-radius: 6px;
  border: 1px solid #2d2d5c; color: #8880cc;
  font-size: 12px; cursor: pointer; background: transparent;
  font-family: inherit; text-decoration: none;
  transition: background 0.1s, color 0.1s;
}
.ao-about-link:hover { background: #1a1a38; color: #c0b4ff; }

/* Status message */
.ao-status {
  font-size: 11px; height: 16px; color: #5550aa;
  padding: 2px 0; transition: color 0.2s;
}
.ao-status.ok { color: #60c060; } .ao-status.err { color: #c06060; }
`;
  function status(el, msg, cls) {
    el.textContent = msg;
    el.className = `ao-status ${cls}`;
    if (cls) setTimeout(() => {
      el.textContent = "";
      el.className = "ao-status";
    }, 2200);
  }
  function buildColorRow(doc, container, label, pref, def, st) {
    const row2 = doc.createElement("div");
    row2.className = "aoc-row";
    const lbl = doc.createElement("span");
    lbl.className = "aoc-label";
    lbl.textContent = label;
    const cur = getPref(pref, def);
    const swatch = doc.createElement("div");
    swatch.className = "aoc-color-swatch";
    swatch.style.background = cur || def || "#555";
    const hexIn = doc.createElement("input");
    hexIn.type = "text";
    hexIn.className = "aoc-color-hex";
    hexIn.value = cur || def;
    hexIn.maxLength = 9;
    hexIn.placeholder = def || "#000000";
    const sync = (hex) => {
      swatch.style.background = hex;
      hexIn.value = hex;
      setPref(pref, hex);
      status(st, "\u2713", "ok");
    };
    swatch.addEventListener("click", (e) => {
      e.stopPropagation();
      openColorPicker(swatch, hexIn.value || def || "#7c6af7", sync);
    });
    hexIn.addEventListener("change", () => {
      const v = hexIn.value.trim();
      const h = v.startsWith("#") ? v : `#${v}`;
      sync(h);
    });
    row2.appendChild(lbl);
    row2.appendChild(swatch);
    row2.appendChild(hexIn);
    container.appendChild(row2);
  }
  var TEXT_COLOR_PREFS = [
    "mod.aurora.color.panel_text",
    "mod.aurora.color.tab_text",
    "mod.aurora.color.urlbar_text"
  ];
  function buildColors(doc, el, st) {
    const groups = [
      ["Panely & Sidebar", ["panel_bg", "toolbar_bg", "sidebar_bg", "border", "accent"]],
      ["Workspace strip", ["workspace_strip_bg", "workspace_dot", "workspace_dot_active"]],
      ["Z\xE1lo\u017Eky", ["tab_active_bg", "tab_inactive_bg", "tab_close_hover", "tab_hover_bg"]],
      ["URL li\u0161ta", ["urlbar_bg", "urlbar_border", "urlbar_focus"]],
      ["Obsah & Ostatn\xED", ["browser_bg", "selection_bg", "scrollbar", "button_bg", "button_hover"]]
    ];
    for (const [heading, keys] of groups) {
      buildSectionHeading(doc, el, heading);
      for (const key of keys) {
        const f = GLOBAL_COLORS.find((c) => c.pref.endsWith(`.${key}`));
        if (f) buildColorRow(doc, el, f.label, f.pref, f.default, st);
      }
    }
    buildSectionHeading(doc, el, "Barvy textu");
    const masterDef = "#e0e0ff";
    const masterCur = getPref("mod.aurora.color.panel_text", masterDef);
    const masterRow = doc.createElement("div");
    masterRow.className = "aoc-row";
    const masterLbl = doc.createElement("span");
    masterLbl.className = "aoc-label";
    masterLbl.textContent = "Barva v\u0161ech text\u016F";
    const masterSwatch = doc.createElement("div");
    masterSwatch.className = "aoc-color-swatch";
    masterSwatch.style.background = masterCur;
    const masterHex = doc.createElement("input");
    masterHex.type = "text";
    masterHex.className = "aoc-color-hex";
    masterHex.value = masterCur;
    masterHex.maxLength = 9;
    masterHex.placeholder = masterDef;
    const setAllText = (hex) => {
      masterSwatch.style.background = hex;
      masterHex.value = hex;
      for (const p of TEXT_COLOR_PREFS) setPref(p, hex);
      status(st, "\u2713 Text nastaven", "ok");
    };
    masterSwatch.addEventListener("click", (e) => {
      e.stopPropagation();
      openColorPicker(masterSwatch, masterHex.value || masterDef, setAllText);
    });
    masterHex.addEventListener("change", () => {
      const v = masterHex.value.trim();
      setAllText(v.startsWith("#") ? v : `#${v}`);
    });
    masterRow.appendChild(masterLbl);
    masterRow.appendChild(masterSwatch);
    masterRow.appendChild(masterHex);
    el.appendChild(masterRow);
    const expandBtn = doc.createElement("button");
    expandBtn.className = "ao-nav-btn";
    expandBtn.style.cssText = "margin: 6px 0; width: 100%; justify-content: center; font-size: 11px;";
    expandBtn.textContent = "\u25BC Nastavit ka\u017Ed\xFD text zvl\xE1\u0161\u0165";
    const indContainer = doc.createElement("div");
    indContainer.style.display = "none";
    let indBuilt = false;
    let expanded = false;
    expandBtn.addEventListener("click", () => {
      expanded = !expanded;
      if (expanded && !indBuilt) {
        indBuilt = true;
        const fields = TEXT_COLOR_PREFS.map((p) => GLOBAL_COLORS.find((f) => f.pref === p)).filter(Boolean);
        for (const f of fields) {
          if (f) buildColorRow(doc, indContainer, f.label, f.pref, f.default, st);
        }
      }
      indContainer.style.display = expanded ? "block" : "none";
      expandBtn.textContent = expanded ? "\u25B2 Skr\xFDt individu\xE1ln\xED nastaven\xED" : "\u25BC Nastavit ka\u017Ed\xFD text zvl\xE1\u0161\u0165";
    });
    el.appendChild(expandBtn);
    el.appendChild(indContainer);
  }
  function buildSpaces(doc, el, st) {
    const tabBar = doc.createElement("div");
    tabBar.className = "ao-space-tabs";
    el.appendChild(tabBar);
    const contents = [];
    for (let i = 0; i < SPACE_COUNT; i++) {
      const tab = doc.createElement("button");
      tab.className = "ao-space-tab" + (i === 0 ? " active" : "");
      tab.textContent = `Space ${i + 1}`;
      tab.dataset.idx = String(i);
      tabBar.appendChild(tab);
      const content = doc.createElement("div");
      content.className = "ao-space-content" + (i === 0 ? " active" : "");
      const note = doc.createElement("div");
      note.style.cssText = "font-size:11px;color:#5550aa;margin-bottom:10px;";
      note.textContent = `P\u0159ep\xED\u0161e glob\xE1ln\xED barvy jen pro Space ${i + 1}. Pr\xE1zdn\xE9 pole = pou\u017Eije se glob\xE1ln\xED hodnota.`;
      content.appendChild(note);
      for (const sc of SPACE_COLORS) {
        buildColorRow(doc, content, sc.label, spaceColorPref(i, sc.key), sc.default, st);
      }
      el.appendChild(content);
      contents.push(content);
    }
    const tabs = Array.from(tabBar.querySelectorAll(".ao-space-tab"));
    tabBar.addEventListener("click", (e) => {
      const t = e.target.closest(".ao-space-tab");
      if (!t) return;
      const idx = tabs.indexOf(t);
      tabs.forEach((tb, ti) => tb.classList.toggle("active", ti === idx));
      contents.forEach((c, ci) => c.classList.toggle("active", ci === idx));
    });
  }
  function buildDynamic(doc, el, st) {
    const statBar = doc.createElement("div");
    statBar.className = "ao-dynamic-status";
    const dot = doc.createElement("div");
    dot.className = "ao-dynamic-dot";
    const txt = doc.createElement("span");
    txt.textContent = getDynamicStatus();
    statBar.appendChild(dot);
    statBar.appendChild(txt);
    el.appendChild(statBar);
    const mode = getPref("mod.aurora.dynamic_mode", "off");
    if (mode !== "off") dot.classList.add("on");
    const timer = setInterval(() => {
      txt.textContent = getDynamicStatus();
      const m = getPref("mod.aurora.dynamic_mode", "off");
      dot.classList.toggle("on", m !== "off");
    }, 3e4);
    el._dynTimer = timer;
    buildSectionHeading(doc, el, "Re\u017Eim");
    buildSelect(doc, el, "Aktivn\xED re\u017Eim", "mod.aurora.dynamic_mode", [
      { label: "Vypnuto", value: "off" },
      { label: "Material You (z obr\xE1zku pozad\xED)", value: "material" },
      { label: "Denn\xED cyklus", value: "daynight" },
      { label: "Akcent z favikony z\xE1lo\u017Eky", value: "tab_accent" }
    ], "off", (v) => dot.classList.toggle("on", v !== "off"));
    buildSectionHeading(doc, el, "Material You");
    buildSelect(doc, el, "Intenzita", "mod.aurora.dynamic.material_intensity", [
      { label: "Slab\xE1 (25%)", value: "0.25" },
      { label: "St\u0159edn\xED (50%)", value: "0.5" },
      { label: "Siln\xE1 (75%)", value: "0.75" },
      { label: "Pln\xE1 (100%)", value: "1.0" }
    ], "0.75");
    buildSectionHeading(doc, el, "Denn\xED cyklus");
    buildSelect(
      doc,
      el,
      "Za\u010D\xE1tek dne",
      "mod.aurora.dynamic.day_hour",
      [5, 6, 7, 8].map((h) => ({ label: `${h}:00`, value: String(h) })),
      "7"
    );
    buildSelect(
      doc,
      el,
      "Za\u010D\xE1tek noci",
      "mod.aurora.dynamic.night_hour",
      [17, 18, 19, 20, 21, 22].map((h) => ({ label: `${h}:00`, value: String(h) })),
      "20"
    );
    buildSelect(doc, el, "D\xE9lka p\u0159echodu", "mod.aurora.dynamic.transition_minutes", [
      { label: "Okam\u017Eit\xFD", value: "0" },
      { label: "30 min", value: "30" },
      { label: "60 min", value: "60" },
      { label: "90 min", value: "90" },
      { label: "120 min", value: "120" }
    ], "60");
    buildColorRow(doc, el, "Akcent ve dne", "mod.aurora.dynamic.day_accent", "#4a90d9", st);
    buildColorRow(doc, el, "Pozad\xED ve dne", "mod.aurora.dynamic.day_bg", "#1a2035", st);
    buildColorRow(doc, el, "Text ve dne", "mod.aurora.dynamic.day_text", "#dde8ff", st);
    buildColorRow(doc, el, "Akcent v noci", "mod.aurora.dynamic.night_accent", "#e07840", st);
    buildColorRow(doc, el, "Pozad\xED v noci", "mod.aurora.dynamic.night_bg", "#1f1510", st);
    buildColorRow(doc, el, "Text v noci", "mod.aurora.dynamic.night_text", "#ffe0cc", st);
    buildSectionHeading(doc, el, "Akcent z favikony");
    buildColorRow(doc, el, "Z\xE1lo\u017En\xED barva", "mod.aurora.dynamic.favicon_fallback", "#7c6af7", st);
    buildSelect(doc, el, "Zes\xEDlen\xED saturace", "mod.aurora.dynamic.favicon_saturation_boost", [
      { label: "Bez zes\xEDlen\xED", value: "1.0" },
      { label: "M\xEDrn\xE9 (1.2\xD7)", value: "1.2" },
      { label: "V\xFDrazn\xE9 (1.5\xD7)", value: "1.5" },
      { label: "Maximum (2\xD7)", value: "2.0" }
    ], "1.2");
  }
  function buildBackground(doc, el, st) {
    buildSectionHeading(doc, el, "Obr\xE1zek pozad\xED");
    buildTextInput(
      doc,
      el,
      "URL obr\xE1zku",
      "mod.aurora.image.browser_bg",
      "https://example.com/wallpaper.jpg",
      ""
    );
    buildSelect(doc, el, "Velikost", "mod.aurora.image.bg_size", [
      { label: "P\u0159izp\u016Fsobit (cover)", value: "cover" },
      { label: "Cel\xFD (contain)", value: "contain" },
      { label: "P\u016Fvodn\xED (auto)", value: "auto" },
      { label: "100% \u0161\xED\u0159ka", value: "100% auto" }
    ], "cover");
    buildSelect(doc, el, "Pozice", "mod.aurora.image.bg_position", [
      { label: "St\u0159ed", value: "center" },
      { label: "Naho\u0159e", value: "top" },
      { label: "Dole", value: "bottom" },
      { label: "Vlevo", value: "left" },
      { label: "Vpravo", value: "right" }
    ], "center");
    buildSlider(doc, el, "Rozmaz\xE1n\xED pozad\xED", "mod.aurora.image.bg_blur", 0, 30, 1, "px", 0);
    buildSlider(doc, el, "Pr\u016Fhlednost pozad\xED", "mod.aurora.image.bg_opacity", 0, 1, 0.05, "", 1);
    buildSlider(doc, el, "Pr\u016Fhlednost panel\u016F", "mod.aurora.effect.panel_opacity", 0, 1, 0.05, "", 1);
    buildSlider(doc, el, "Rozmaz\xE1n\xED panel\u016F", "mod.aurora.effect.panel_blur", 0, 30, 1, "px", 0);
  }
  function buildLayout(doc, el, _st) {
    buildSectionHeading(doc, el, "Z\xE1lo\u017Eky");
    buildSlider(doc, el, "V\xFD\u0161ka z\xE1lo\u017Eky", "mod.aurora.layout.tab_height", 20, 60, 1, "px", 36);
    buildSlider(doc, el, "Zaoblen\xED z\xE1lo\u017Eky", "mod.aurora.layout.tab_border_radius", 0, 20, 1, "px", 8);
    buildSectionHeading(doc, el, "Panely");
    buildSlider(doc, el, "V\xFD\u0161ka toolbaru", "mod.aurora.layout.toolbar_height", 32, 64, 1, "px", 40);
    buildSlider(doc, el, "\u0160\xED\u0159ka sidebaru", "mod.aurora.layout.sidebar_width", 120, 400, 4, "px", 200);
    buildSlider(doc, el, "\u0160\xED\u0159ka workspace stripu", "mod.aurora.layout.workspace_strip_width", 20, 80, 2, "px", 36);
    buildSlider(doc, el, "Zaoblen\xED panel\u016F", "mod.aurora.layout.panel_border_radius", 0, 24, 1, "px", 8);
    buildSectionHeading(doc, el, "Ostatn\xED");
    buildSlider(doc, el, "Zaoblen\xED tla\u010D\xEDtek", "mod.aurora.layout.button_border_radius", 0, 20, 1, "px", 6);
    buildSlider(doc, el, "Tlou\u0161\u0165ka ohrani\u010Den\xED", "mod.aurora.layout.border_width", 0, 4, 1, "px", 1);
    buildSelect(doc, el, "Styl ohrani\u010Den\xED", "mod.aurora.effect.panel_border_style", [
      { label: "Pln\xE9 (solid)", value: "solid" },
      { label: "Te\u010Dky (dotted)", value: "dotted" },
      { label: "P\u0159eru\u0161ovan\xE9 (dashed)", value: "dashed" },
      { label: "\u017D\xE1dn\xE9", value: "none" }
    ], "solid");
  }
  function buildEffects(doc, el, _st) {
    buildSectionHeading(doc, el, "St\xEDny a z\xE1\u0159e");
    buildToggle(doc, el, "St\xEDn aktivn\xED z\xE1lo\u017Eky", "mod.aurora.effect.tab_shadow", false);
    buildToggle(doc, el, "Z\xE1\u0159e akcentu (glow)", "mod.aurora.effect.accent_glow", false);
    buildSectionHeading(doc, el, "Animace");
    buildSelect(doc, el, "Rychlost animac\xED", "mod.aurora.animation_speed", [
      { label: "Vypnut\xE9", value: "none" },
      { label: "Pomal\xE9 (0.45s)", value: "slow" },
      { label: "Norm\xE1ln\xED (0.18s)", value: "normal" },
      { label: "Rychl\xE9 (0.08s)", value: "fast" }
    ], "normal");
    buildSelect(doc, el, "K\u0159ivka animace", "mod.aurora.animation.easing", [
      { label: "Ease (v\xFDchoz\xED)", value: "ease" },
      { label: "Linear", value: "linear" },
      { label: "Ease In", value: "ease-in" },
      { label: "Ease Out", value: "ease-out" },
      { label: "Spring", value: "cubic-bezier(0.34, 1.56, 0.64, 1)" }
    ], "ease");
  }
  function buildFont(doc, el, _st) {
    buildSectionHeading(doc, el, "P\xEDsmo");
    buildTextInput(
      doc,
      el,
      "Rodina p\xEDsma",
      "mod.aurora.font.family",
      "system-ui, sans-serif",
      "inherit"
    );
    buildSlider(doc, el, "Velikost p\xEDsma", "mod.aurora.font.size", 10, 20, 1, "px", 13);
    buildSelect(doc, el, "Tu\u010Dnost", "mod.aurora.font.weight", [
      { label: "Tenk\xE9 (300)", value: "300" },
      { label: "Norm\xE1ln\xED (400)", value: "400" },
      { label: "St\u0159edn\xED (500)", value: "500" },
      { label: "Tu\u010Dn\xE9 (600)", value: "600" },
      { label: "Extra tu\u010Dn\xE9 (700)", value: "700" }
    ], "400");
  }
  function buildSounds(doc, el, _st) {
    buildSectionHeading(doc, el, "Zvukov\xE9 efekty");
    const note = doc.createElement("div");
    note.style.cssText = "font-size:11.5px;color:#5550aa;margin-bottom:12px;line-height:1.6;";
    note.textContent = "P\u0159ehraje jemn\xFD zvuk p\u0159i psan\xED. Zm\u011Bna vy\u017Eaduje restart prohl\xED\u017Ee\u010De.";
    el.appendChild(note);
    buildToggle(doc, el, "Zapnout zvukov\xE9 efekty kl\xE1vesnice", "mod.aurora.sounds_enabled", false);
  }
  var ALL_STRING_PREFS = [
    ...GLOBAL_COLORS.map((c) => c.pref),
    "mod.aurora.image.browser_bg",
    "mod.aurora.image.bg_size",
    "mod.aurora.image.bg_position",
    "mod.aurora.image.bg_blur",
    "mod.aurora.image.bg_opacity",
    "mod.aurora.effect.panel_opacity",
    "mod.aurora.effect.panel_blur",
    "mod.aurora.effect.panel_border_style",
    "mod.aurora.font.family",
    "mod.aurora.font.size",
    "mod.aurora.font.weight",
    "mod.aurora.layout.tab_height",
    "mod.aurora.layout.tab_border_radius",
    "mod.aurora.layout.panel_border_radius",
    "mod.aurora.layout.button_border_radius",
    "mod.aurora.layout.sidebar_width",
    "mod.aurora.layout.workspace_strip_width",
    "mod.aurora.layout.toolbar_height",
    "mod.aurora.layout.border_width",
    "mod.aurora.animation_speed",
    "mod.aurora.animation.easing",
    "mod.aurora.dynamic_mode"
  ];
  var ALL_BOOL_PREFS = ["mod.aurora.effect.tab_shadow", "mod.aurora.effect.accent_glow", "mod.aurora.sounds_enabled"];
  function capturePreset() {
    const data = {};
    for (const p of ALL_STRING_PREFS) {
      try {
        data[p] = Services.prefs.getStringPref(p, "");
      } catch {
      }
    }
    for (const p of ALL_BOOL_PREFS) {
      try {
        data[p] = Services.prefs.getBoolPref(p, false);
      } catch {
      }
    }
    return JSON.stringify(data);
  }
  function applyPresetData(json) {
    const data = JSON.parse(json);
    for (const [p, v] of Object.entries(data)) {
      if (!p.startsWith("mod.aurora.")) continue;
      if (typeof v === "boolean") {
        try {
          Services.prefs.setBoolPref(p, v);
        } catch {
        }
      } else {
        try {
          Services.prefs.setStringPref(p, v);
        } catch {
        }
      }
    }
  }
  function listPresets() {
    const result = [];
    for (let i = 1; i <= 20; i++) {
      try {
        const raw = Services.prefs.getStringPref(`mod.aurora.preset.${i}`, "");
        if (!raw) continue;
        const meta = JSON.parse(raw);
        result.push({ idx: i, name: meta.name, ts: meta.ts, json: meta.data });
      } catch {
      }
    }
    return result;
  }
  function savePreset(name) {
    for (let i = 1; i <= 20; i++) {
      const raw = Services.prefs.getStringPref(`mod.aurora.preset.${i}`, "");
      if (!raw) {
        Services.prefs.setStringPref(
          `mod.aurora.preset.${i}`,
          JSON.stringify({ name, ts: Date.now(), data: capturePreset() })
        );
        return i;
      }
    }
    return -1;
  }
  function deletePreset(idx) {
    try {
      Services.prefs.clearUserPref(`mod.aurora.preset.${idx}`);
    } catch {
    }
  }
  function buildPresets(doc, el, st) {
    buildSectionHeading(doc, el, "Ulo\u017Een\xE9 profily");
    const listEl = doc.createElement("div");
    listEl.className = "ao-preset-list";
    el.appendChild(listEl);
    function refresh() {
      listEl.innerHTML = "";
      const presets = listPresets();
      if (presets.length === 0) {
        const empty = doc.createElement("div");
        empty.style.cssText = "color:#5550aa;font-size:12px;padding:10px 0;";
        empty.textContent = "\u017D\xE1dn\xE9 ulo\u017Een\xE9 profily.";
        listEl.appendChild(empty);
        return;
      }
      for (const p of presets) {
        const item = doc.createElement("div");
        item.className = "ao-preset-item";
        const swatches = doc.createElement("div");
        swatches.className = "ao-preset-swatch-row";
        try {
          const data = JSON.parse(p.json);
          for (const key of ["mod.aurora.color.accent", "mod.aurora.color.panel_bg", "mod.aurora.color.tab_active_bg"]) {
            const sw = doc.createElement("div");
            sw.className = "ao-preset-swatch";
            sw.style.background = data[key] || "#333";
            swatches.appendChild(sw);
          }
        } catch {
        }
        const name = doc.createElement("span");
        name.className = "ao-preset-name";
        name.textContent = p.name;
        const time = doc.createElement("span");
        time.className = "ao-preset-time";
        time.textContent = new Date(p.ts).toLocaleDateString("cs-CZ");
        const loadBtn = doc.createElement("button");
        loadBtn.className = "ao-preset-btn load";
        loadBtn.textContent = "Na\u010D\xEDst";
        loadBtn.addEventListener("click", () => {
          applyPresetData(p.json);
          refreshColorSwatches(doc);
          status(st, `Na\u010Dten profil "${p.name}"`, "ok");
        });
        const delBtn = doc.createElement("button");
        delBtn.className = "ao-preset-btn del";
        delBtn.textContent = "Smazat";
        delBtn.addEventListener("click", () => {
          deletePreset(p.idx);
          refresh();
        });
        item.appendChild(swatches);
        item.appendChild(name);
        item.appendChild(time);
        item.appendChild(loadBtn);
        item.appendChild(delBtn);
        listEl.appendChild(item);
      }
    }
    refresh();
    buildSectionHeading(doc, el, "Ulo\u017Eit aktu\xE1ln\xED nastaven\xED jako profil");
    const saveRow = doc.createElement("div");
    saveRow.className = "ao-preset-save";
    const nameIn = doc.createElement("input");
    nameIn.type = "text";
    nameIn.className = "ao-preset-name-in";
    nameIn.placeholder = "N\xE1zev profilu (nap\u0159. Pracovn\xED)";
    const saveBtn = doc.createElement("button");
    saveBtn.className = "ao-preset-save-btn";
    saveBtn.textContent = "Ulo\u017Eit";
    saveBtn.addEventListener("click", () => {
      const n = nameIn.value.trim() || `Profil ${Date.now()}`;
      const idx = savePreset(n);
      if (idx < 0) {
        status(st, "Maximum 20 profil\u016F dosa\u017Eeno", "err");
        return;
      }
      nameIn.value = "";
      refresh();
      status(st, `Ulo\u017Een profil "${n}"`, "ok");
    });
    saveRow.appendChild(nameIn);
    saveRow.appendChild(saveBtn);
    el.appendChild(saveRow);
    buildSectionHeading(doc, el, "Export / Import (.txt)");
    const ioRow = doc.createElement("div");
    ioRow.style.cssText = "display:flex;gap:8px;";
    const expBtn = doc.createElement("button");
    expBtn.className = "ao-preset-btn";
    expBtn.textContent = "\u{1F4BE} Exportovat barvy (.txt)";
    expBtn.addEventListener("click", () => exportTxt(doc, st));
    const impBtn = doc.createElement("button");
    impBtn.className = "ao-preset-btn";
    impBtn.textContent = "\u{1F4C2} Na\u010D\xEDst z .txt";
    impBtn.addEventListener("click", () => importTxt(doc, el, st));
    ioRow.appendChild(expBtn);
    ioRow.appendChild(impBtn);
    el.appendChild(ioRow);
  }
  function exportTxt(doc, st) {
    const lines = ["# Aurora Theme Export", `# ${(/* @__PURE__ */ new Date()).toLocaleString("cs-CZ")}`, ""];
    for (const p of ALL_STRING_PREFS) lines.push(`${p}=${getPref(p, "")}`);
    for (const p of ALL_BOOL_PREFS) lines.push(`${p}=${getBoolPref(p, false)}`);
    try {
      const blob = new Blob([lines.join("\n")], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = doc.createElement("a");
      a.href = url;
      a.download = `aurora-${Date.now()}.txt`;
      doc.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      status(st, "Soubor sta\u017Een", "ok");
    } catch (e) {
      status(st, `Chyba: ${e}`, "err");
    }
  }
  function importTxt(doc, container, st) {
    const inp = doc.createElement("input");
    inp.type = "file";
    inp.accept = ".txt,text/plain";
    inp.style.display = "none";
    inp.addEventListener("change", () => {
      const f = inp.files?.[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = (e) => {
        let ok = 0, bad = 0;
        for (const line of (e.target?.result).split(/\r?\n/)) {
          const l = line.trim();
          if (!l || l.startsWith("#")) continue;
          const eq = l.indexOf("=");
          if (eq < 0) continue;
          const p = l.slice(0, eq).trim(), v = l.slice(eq + 1).trim();
          if (!p.startsWith("mod.aurora.")) {
            bad++;
            continue;
          }
          if (v === "true" || v === "false") {
            try {
              Services.prefs.setBoolPref(p, v === "true");
              ok++;
            } catch {
              bad++;
            }
          } else {
            try {
              Services.prefs.setStringPref(p, v);
              ok++;
            } catch {
              bad++;
            }
          }
        }
        refreshColorSwatches(doc);
        status(st, bad > 0 ? `Na\u010Dteno ${ok}, p\u0159esko\u010Deno ${bad}` : `Na\u010Dteno ${ok} hodnot`, ok > 0 ? "ok" : "err");
      };
      r.readAsText(f);
    });
    doc.body.appendChild(inp);
    inp.click();
    setTimeout(() => inp.remove(), 3e4);
  }
  function buildAbout(doc, el, st) {
    const card = doc.createElement("div");
    card.className = "ao-about-card";
    const t = doc.createElement("div");
    t.className = "ao-about-title";
    t.textContent = "\u2726 Aurora";
    const sub = doc.createElement("div");
    sub.className = "ao-about-sub";
    sub.textContent = "Kompletn\xED UI overhaul pro Zen Browser \xB7 v0.1.0";
    card.appendChild(t);
    card.appendChild(sub);
    el.appendChild(card);
    buildSectionHeading(doc, el, "Akce");
    const resetBtn = doc.createElement("button");
    resetBtn.className = "ao-nav-btn danger";
    resetBtn.style.cssText = "width:100%;margin-bottom:8px;";
    resetBtn.textContent = "\u27F3  Reset v\u0161ech barev na v\xFDchoz\xED hodnoty";
    resetBtn.addEventListener("click", () => {
      for (const f of GLOBAL_COLORS) {
        try {
          Services.prefs.setStringPref(f.pref, f.default);
        } catch {
        }
      }
      for (let i = 0; i < SPACE_COUNT; i++)
        for (const sc of SPACE_COLORS)
          try {
            Services.prefs.clearUserPref(spaceColorPref(i, sc.key));
          } catch {
          }
      refreshColorSwatches(doc);
      status(st, "Resetov\xE1no na v\xFDchoz\xED hodnoty", "ok");
    });
    el.appendChild(resetBtn);
  }
  function refreshColorSwatches(doc) {
    const overlay = doc.getElementById(OVERLAY_ID);
    if (!overlay) return;
    overlay.querySelectorAll(".aoc-row").forEach((rowEl) => {
      const label = rowEl.querySelector(".aoc-label")?.textContent ?? "";
      const swatch = rowEl.querySelector(".aoc-color-swatch");
      const hexInput = rowEl.querySelector(".aoc-color-hex");
      if (!swatch || !hexInput) return;
      const field = GLOBAL_COLORS.find((f) => f.label === label);
      if (!field) return;
      const v = getPref(field.pref, field.default);
      swatch.style.background = v;
      hexInput.value = v;
    });
  }
  var NAV_ITEMS = [
    { id: "colors", icon: "\u{1F3A8}", label: "Barvy" },
    { id: "spaces", icon: "\u{1F30C}", label: "Spaces" },
    { id: "dynamic", icon: "\u{1F305}", label: "Dynamika" },
    { id: "background", icon: "\u{1F5BC}\uFE0F", label: "Pozad\xED" },
    { id: "layout", icon: "\u{1F4D0}", label: "Rozm\u011Bry" },
    { id: "effects", icon: "\u2728", label: "Efekty" },
    { id: "font", icon: "\u{1F524}", label: "P\xEDsmo" },
    { id: "sounds", icon: "\u{1F50A}", label: "Zvuky" },
    { id: "presets", icon: "\u{1F4BE}", label: "Presety" },
    { id: "about", icon: "\u2139\uFE0F", label: "O m\xF3du" }
  ];
  var SECTION_BUILDERS = {
    colors: buildColors,
    spaces: buildSpaces,
    dynamic: buildDynamic,
    background: buildBackground,
    layout: buildLayout,
    effects: buildEffects,
    font: buildFont,
    sounds: buildSounds,
    presets: buildPresets,
    about: buildAbout
  };
  function buildOverlay(doc) {
    const backdrop = doc.createElement("div");
    backdrop.id = BACKDROP_ID;
    backdrop.addEventListener("click", () => closeOverlay(doc));
    const overlay = doc.createElement("div");
    overlay.id = OVERLAY_ID;
    overlay.addEventListener("click", (e) => e.stopPropagation());
    const nav = doc.createElement("div");
    nav.className = "ao-nav";
    const logo = doc.createElement("div");
    logo.className = "ao-nav-logo";
    logo.textContent = "\u2726 Aurora";
    nav.appendChild(logo);
    const main = doc.createElement("div");
    main.className = "ao-main";
    const header = doc.createElement("div");
    header.className = "ao-header";
    const headerTitle = doc.createElement("div");
    headerTitle.className = "ao-header-title";
    const headerSub = doc.createElement("span");
    headerSub.className = "ao-header-sub";
    headerSub.id = "aurora-header-sub";
    headerTitle.appendChild(doc.createTextNode("\u2726 Aurora"));
    headerTitle.appendChild(headerSub);
    const closeBtn = doc.createElement("button");
    closeBtn.className = "ao-header-close";
    closeBtn.textContent = "\u2715 Zav\u0159\xEDt  (Esc)";
    closeBtn.addEventListener("click", () => closeOverlay(doc));
    header.appendChild(headerTitle);
    header.appendChild(closeBtn);
    const content = doc.createElement("div");
    content.className = "ao-content";
    const st = doc.createElement("div");
    st.className = "ao-status";
    st.style.marginBottom = "4px";
    content.appendChild(st);
    main.appendChild(header);
    main.appendChild(content);
    overlay.appendChild(nav);
    overlay.appendChild(main);
    const sections = {};
    const navItems = [];
    let activeId = "colors";
    function showSection(id) {
      sections[activeId]?.classList.remove("active");
      navItems.find((n) => n.dataset.id === activeId)?.classList.remove("active");
      if (!sections[id]) {
        const sec = doc.createElement("div");
        sec.className = "ao-section";
        sec.dataset.section = id;
        SECTION_BUILDERS[id](doc, sec, st);
        content.appendChild(sec);
        sections[id] = sec;
      }
      sections[id].classList.add("active");
      navItems.find((n) => n.dataset.id === id)?.classList.add("active");
      activeId = id;
      const item = NAV_ITEMS.find((n) => n.id === id);
      if (item) headerSub.textContent = `\u2014 ${item.label}`;
      content.scrollTop = 0;
    }
    for (const item of NAV_ITEMS) {
      const navItem = doc.createElement("div");
      navItem.className = "ao-nav-item";
      navItem.dataset.id = item.id;
      const icon = doc.createElement("span");
      icon.className = "ao-nav-icon";
      icon.textContent = item.icon;
      const label = doc.createElement("span");
      label.textContent = item.label;
      navItem.appendChild(icon);
      navItem.appendChild(label);
      navItem.addEventListener("click", () => showSection(item.id));
      nav.appendChild(navItem);
      navItems.push(navItem);
    }
    const sep = doc.createElement("div");
    sep.className = "ao-nav-sep";
    nav.appendChild(sep);
    const acts = doc.createElement("div");
    acts.className = "ao-nav-actions";
    nav.appendChild(acts);
    showSection("colors");
    return { backdrop, overlay };
  }
  function openOverlay(doc) {
    doc.getElementById(BACKDROP_ID)?.classList.add("open");
    doc.getElementById(OVERLAY_ID)?.classList.add("open");
  }
  function closeOverlay(doc) {
    doc.getElementById(BACKDROP_ID)?.classList.remove("open");
    doc.getElementById(OVERLAY_ID)?.classList.remove("open");
  }
  function updateOverlayTop(doc) {
    const toolbox = doc.getElementById("navigator-toolbox") ?? doc.querySelector("#nav-bar");
    let top = 0;
    if (toolbox) {
      const r = toolbox.getBoundingClientRect();
      if (r.top < 8 && r.width > r.height && r.height > 0) top = Math.round(r.bottom);
    }
    const style = `top: ${top}px !important; height: calc(100vh - ${top}px) !important;`;
    for (const id of [BACKDROP_ID, OVERLAY_ID]) {
      const el = doc.getElementById(id);
      if (el) {
        el.style.top = `${top}px`;
        el.style.height = `calc(100vh - ${top}px)`;
      }
    }
  }
  function initOverlay(doc) {
    if (!doc.getElementById(STYLES_ID)) {
      const s2 = doc.createElement("style");
      s2.id = STYLES_ID;
      s2.textContent = CSS;
      (doc.head ?? doc.documentElement).appendChild(s2);
    }
    initColorPicker(doc);
    if (!doc.getElementById(OVERLAY_ID)) {
      const { backdrop, overlay } = buildOverlay(doc);
      doc.documentElement.appendChild(backdrop);
      doc.documentElement.appendChild(overlay);
    }
    updateOverlayTop(doc);
    let resizeTimer = null;
    const resizeObs = new ResizeObserver(() => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => updateOverlayTop(doc), 100);
    });
    const toolbox = doc.getElementById("navigator-toolbox");
    if (toolbox) resizeObs.observe(toolbox);
    const onKey = (e) => {
      if (e.key === "Escape") closeOverlay(doc);
    };
    doc.addEventListener("keydown", onKey, { capture: true });
    const prefObs = {
      observe(_s, topic, data) {
        if (topic !== "nsPref:changed" || data !== "mod.aurora.ui.open_panel") return;
        try {
          if (Services.prefs.getBoolPref("mod.aurora.ui.open_panel", false)) {
            openOverlay(doc);
            Services.prefs.setBoolPref("mod.aurora.ui.open_panel", false);
          }
        } catch {
        }
      }
    };
    Services.prefs.addObserver("mod.aurora.ui.open_panel", prefObs);
    return () => {
      doc.getElementById(OVERLAY_ID)?.remove();
      doc.getElementById(BACKDROP_ID)?.remove();
      doc.getElementById(STYLES_ID)?.remove();
      doc.getElementById("aurora-cp-popup")?.remove();
      doc.getElementById("aurora-cp-styles")?.remove();
      resizeObs.disconnect();
      if (resizeTimer) clearTimeout(resizeTimer);
      doc.removeEventListener("keydown", onKey, true);
      Services.prefs.removeObserver("mod.aurora.ui.open_panel", prefObs);
    };
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
  var soundsRunning = false;
  var dynamicRunning = false;
  var stopSpaces = null;
  var stopOverlay = null;
  var stopZenSync = null;
  var debounceTimer = null;
  function scheduleApply(doc) {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      applyAll(doc).catch((e) => dump(`[Aurora] ${e}
`));
    }, 80);
  }
  async function applyAll(doc) {
    const theme = loadTheme();
    applyTheme(theme, doc);
    refreshSpaces(doc);
    if (theme.sounds.enabled && !soundsRunning) {
      soundsRunning = true;
      await initSounds(theme);
    } else if (!theme.sounds.enabled && soundsRunning) {
      stopSounds();
      soundsRunning = false;
    }
    if (theme.dynamicMode !== "off" && !dynamicRunning) {
      dynamicRunning = true;
      initDynamicTheme(doc);
    } else if (theme.dynamicMode === "off" && dynamicRunning) {
      stopDynamicTheme();
      dynamicRunning = false;
    }
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
        stopSounds();
        stopDynamicTheme();
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

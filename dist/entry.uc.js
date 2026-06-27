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

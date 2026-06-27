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
        buttonHover: s("mod.aurora.color.button_hover", "#3a3a6e")
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
  function saveTheme(theme) {
    const p = Services.prefs;
    const ss = (k, v) => p.setStringPref(k, v);
    const sb = (k, v) => p.setBoolPref(k, v);
    ss("mod.aurora.color.panel_bg", theme.colors.panelBg);
    ss("mod.aurora.color.toolbar_bg", theme.colors.toolbarBg);
    ss("mod.aurora.color.sidebar_bg", theme.colors.sidebarBg);
    ss("mod.aurora.color.panel_text", theme.colors.panelText);
    ss("mod.aurora.color.border", theme.colors.border);
    ss("mod.aurora.color.accent", theme.colors.accent);
    ss("mod.aurora.color.tab_active_bg", theme.colors.tabActiveBg);
    ss("mod.aurora.color.tab_inactive_bg", theme.colors.tabInactiveBg);
    ss("mod.aurora.color.tab_text", theme.colors.tabText);
    ss("mod.aurora.color.tab_close_hover", theme.colors.tabCloseHover);
    ss("mod.aurora.color.tab_hover_bg", theme.colors.tabHoverBg);
    ss("mod.aurora.color.urlbar_bg", theme.colors.urlbarBg);
    ss("mod.aurora.color.urlbar_text", theme.colors.urlbarText);
    ss("mod.aurora.color.urlbar_border", theme.colors.urlbarBorder);
    ss("mod.aurora.color.urlbar_focus", theme.colors.urlbarFocus);
    ss("mod.aurora.color.browser_bg", theme.colors.browserBg);
    ss("mod.aurora.color.selection_bg", theme.colors.selectionBg);
    ss("mod.aurora.color.scrollbar", theme.colors.scrollbar);
    ss("mod.aurora.color.button_bg", theme.colors.buttonBg);
    ss("mod.aurora.color.button_hover", theme.colors.buttonHover);
    ss("mod.aurora.image.bg_size", theme.images.bgSize);
    ss("mod.aurora.image.bg_position", theme.images.bgPosition);
    ss("mod.aurora.image.bg_blur", theme.images.bgBlur);
    ss("mod.aurora.image.bg_opacity", theme.images.bgOpacity);
    ss("mod.aurora.font.family", theme.typography.fontFamily);
    ss("mod.aurora.font.size", theme.typography.fontSize);
    ss("mod.aurora.font.weight", theme.typography.fontWeight);
    ss("mod.aurora.layout.tab_height", theme.layout.tabHeight);
    ss("mod.aurora.layout.tab_border_radius", theme.layout.tabBorderRadius);
    ss("mod.aurora.layout.panel_border_radius", theme.layout.panelBorderRadius);
    ss("mod.aurora.layout.button_border_radius", theme.layout.buttonBorderRadius);
    ss("mod.aurora.layout.sidebar_width", theme.layout.sidebarWidth);
    ss("mod.aurora.layout.toolbar_height", theme.layout.toolbarHeight);
    ss("mod.aurora.layout.border_width", theme.layout.borderWidth);
    ss("mod.aurora.effect.panel_opacity", theme.effects.panelOpacity);
    ss("mod.aurora.effect.panel_blur", theme.effects.panelBlur);
    sb("mod.aurora.effect.tab_shadow", theme.effects.tabShadow);
    sb("mod.aurora.effect.accent_glow", theme.effects.accentGlow);
    ss("mod.aurora.effect.panel_border_style", theme.effects.panelBorderStyle);
    ss("mod.aurora.animation_speed", theme.animations.speed);
    ss("mod.aurora.animation.easing", theme.animations.easing);
    ss("mod.aurora.dynamic_mode", theme.dynamicMode);
    sb("mod.aurora.sounds_enabled", theme.sounds.enabled);
  }

  // src/core/cssEngine.ts
  var STYLE_ID = "aurora-dynamic-styles";
  var ANIM_SPEED = {
    none: "0s",
    slow: "0.5s",
    normal: "0.2s",
    fast: "0.08s"
  };
  function generateCSS(t) {
    const dur = ANIM_SPEED[t.animations.speed] ?? "0.2s";
    const ease = t.animations.easing;
    const trans = `${dur} ${ease}`;
    const noAnim = t.animations.speed === "none";
    const bgImage = t.images.browserBg ? `url("${t.images.browserBg}")` : "none";
    const panelRgba = hexToRgba(t.colors.panelBg, t.effects.panelOpacity);
    const toolbarRgba = hexToRgba(t.colors.toolbarBg, t.effects.panelOpacity);
    const sidebarRgba = hexToRgba(t.colors.sidebarBg, t.effects.panelOpacity);
    const blur = t.effects.panelBlur !== "0px" ? `blur(${t.effects.panelBlur})` : "";
    const tabShadow = t.effects.tabShadow ? `0 2px 8px ${t.colors.accent}66` : "none";
    const accentGlow = t.effects.accentGlow ? `0 0 12px ${t.colors.accent}88, 0 0 24px ${t.colors.accent}44` : "";
    return `
/* \u2500\u2500 Aurora CSS Variables \u2500\u2500 */
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

/* \u2500\u2500 Toolbars & Panels \u2500\u2500 */
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

/* \u2500\u2500 Sidebar \u2500\u2500 */
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

/* \u2500\u2500 Tabs \u2500\u2500 */
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

/* \u2500\u2500 URL Bar \u2500\u2500 */
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

/* \u2500\u2500 Main browser area \u2500\u2500 */
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

/* \u2500\u2500 Buttons & Toolbar items \u2500\u2500 */
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

/* \u2500\u2500 Popup menus \u2500\u2500 */
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

/* \u2500\u2500 Scrollbar \u2500\u2500 */
scrollbar,
scrollbarbutton,
slider {
  background-color: transparent !important;
}

thumb {
  background-color: var(--aurora-scrollbar) !important;
  border-radius: 999px !important;
}

/* \u2500\u2500 Accent glow na aktivn\xED z\xE1lo\u017Ece \u2500\u2500 */
${t.effects.accentGlow ? `
.tabbrowser-tab[selected] .tab-background {
  box-shadow: var(--aurora-tab-shadow), var(--aurora-accent-glow) !important;
}
` : ""}

/* \u2500\u2500 Zen Browser native variable sync \u2500\u2500 */
${Services.prefs.getBoolPref("mod.aurora.zen.sync_primary_color", true) ? `
:root {
  --zen-primary-color: ${t.colors.accent} !important;
}` : ""}

/* \u2500\u2500 Vypnut\xED animac\xED \u2500\u2500 */
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
  function injectStyles(css, targetDoc = document) {
    let el = targetDoc.getElementById(STYLE_ID);
    if (!el) {
      el = targetDoc.createElement("style");
      el.id = STYLE_ID;
      (targetDoc.head ?? targetDoc.documentElement).appendChild(el);
    }
    el.textContent = css;
  }
  function applyTheme(theme, targetDoc = document) {
    injectStyles(generateCSS(theme), targetDoc);
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
  function lerp(a, b2, t) {
    return Math.round(a + (b2 - a) * t);
  }
  function lerpHex(hexA, hexB, t) {
    const [ar, ag, ab] = hexA.slice(1).match(/.{2}/g).map((h) => parseInt(h, 16));
    const [br, bg, bb] = hexB.slice(1).match(/.{2}/g).map((h) => parseInt(h, 16));
    return "#" + [lerp(ar, br, t), lerp(ag, bg, t), lerp(ab, bb, t)].map((v) => v.toString(16).padStart(2, "0")).join("");
  }
  var DAY_PALETTE = {
    dominant: "#4a90d9",
    primary: "#6aaff0",
    secondary: "#3a7bc8",
    surface: "#1a2035",
    onSurface: "#dde8ff"
  };
  var NIGHT_PALETTE = {
    dominant: "#c0622a",
    primary: "#e07840",
    secondary: "#a04c1a",
    surface: "#1f1510",
    onSurface: "#ffe0cc"
  };
  function getDayNightFactor() {
    const h = (/* @__PURE__ */ new Date()).getHours();
    if (h >= 9 && h < 18) return 0;
    if (h >= 0 && h < 6) return 1;
    if (h >= 18 && h < 21) return (h - 18) / 3;
    return 1 - (h - 6) / 3;
  }
  function paletteToColors(p) {
    return {
      accent: p.primary,
      panelBg: p.surface,
      panelText: p.onSurface,
      border: p.secondary,
      browserBg: p.surface
    };
  }
  async function applyMaterialTheme(doc) {
    const theme = loadTheme();
    if (!theme.images.browserBg) return;
    const palette = await extractPalette(theme.images.browserBg);
    const dynamicColors = paletteToColors(palette);
    const merged = { ...theme, colors: { ...theme.colors, ...dynamicColors } };
    saveTheme(merged);
    applyTheme(merged, doc);
  }
  function applyDayNight(doc) {
    const t = getDayNightFactor();
    const colors = {
      accent: lerpHex(DAY_PALETTE.primary, NIGHT_PALETTE.primary, t),
      panelBg: lerpHex(DAY_PALETTE.surface, NIGHT_PALETTE.surface, t),
      panelText: lerpHex(DAY_PALETTE.onSurface, NIGHT_PALETTE.onSurface, t),
      border: lerpHex(DAY_PALETTE.secondary, NIGHT_PALETTE.secondary, t),
      browserBg: lerpHex(DAY_PALETTE.surface, NIGHT_PALETTE.surface, t)
    };
    const theme = loadTheme();
    const merged = { ...theme, colors: { ...theme.colors, ...colors } };
    applyTheme(merged, doc);
  }
  function initDynamicTheme(doc) {
    stopDynamicTheme();
    const theme = loadTheme();
    if (theme.dynamicMode === "material") {
      applyMaterialTheme(doc);
      dynamicTimer = setInterval(() => applyMaterialTheme(doc), 5 * 60 * 1e3);
    } else if (theme.dynamicMode === "daynight") {
      applyDayNight(doc);
      dynamicTimer = setInterval(() => applyDayNight(doc), 10 * 60 * 1e3);
    }
  }
  function stopDynamicTheme() {
    if (dynamicTimer !== null) {
      clearInterval(dynamicTimer);
      dynamicTimer = null;
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
    let el = doc.getElementById(SPACE_STYLE_ID);
    if (!el) {
      el = doc.createElement("style");
      el.id = SPACE_STYLE_ID;
      (doc.head ?? doc.documentElement).appendChild(el);
    }
    el.textContent = spaceCSS;
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
    const styleObserver = new MutationObserver(() => {
      onPossibleSpaceChange(doc);
    });
    styleObserver.observe(doc.documentElement, {
      attributes: true,
      attributeFilter: ["style"]
    });
    const onTabSelect = () => onPossibleSpaceChange(doc);
    doc.addEventListener("TabSelect", onTabSelect, { capture: true });
    return () => {
      styleObserver.disconnect();
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
    { pref: "mod.aurora.color.button_hover", label: "Tla\u010D\xEDtka hover", default: "#3a3a6e" }
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

  // src/ui/panel.ts
  var PANEL_ID = "aurora-ui-panel";
  var BTN_ID = "aurora-ui-fab";
  var STYLES_ID = "aurora-ui-styles";
  var PANEL_CSS = `
#aurora-ui-fab {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 2147483647;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #7c6af7;
  color: #fff;
  font-size: 18px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 16px #7c6af766;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  user-select: none;
}
#aurora-ui-fab:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px #7c6af799;
}

#aurora-ui-panel {
  position: fixed;
  top: 0;
  right: -440px;
  width: 420px;
  height: 100vh;
  z-index: 2147483646;
  background: #13132a;
  border-left: 1px solid #2d2d5c;
  box-shadow: -8px 0 32px #00000088;
  display: flex;
  flex-direction: column;
  font-family: system-ui, sans-serif;
  font-size: 13px;
  color: #e0e0ff;
  transition: right 0.25s cubic-bezier(0.4,0,0.2,1);
  overflow: hidden;
}
#aurora-ui-panel.aurora-open {
  right: 0;
}

.aurora-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: #0f0f22;
  border-bottom: 1px solid #2d2d5c;
  flex-shrink: 0;
}
.aurora-panel-title {
  font-size: 15px;
  font-weight: 700;
  color: #c0b4ff;
  letter-spacing: 0.5px;
}
.aurora-panel-close {
  background: transparent;
  border: none;
  color: #8880cc;
  font-size: 18px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  line-height: 1;
}
.aurora-panel-close:hover { background: #2a2a4e; color: #e0e0ff; }

.aurora-panel-actions {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid #2d2d5c;
  flex-shrink: 0;
}
.aurora-action-btn {
  padding: 7px 6px;
  border: 1px solid #3a3a6c;
  border-radius: 8px;
  background: #1e1e3a;
  color: #c0b4ff;
  font-size: 11px;
  cursor: pointer;
  text-align: center;
  transition: background 0.12s;
  font-family: inherit;
}
.aurora-action-btn:hover { background: #2a2a5a; border-color: #7c6af7; }
.aurora-action-btn.danger { border-color: #6c2a2a; color: #ff9090; }
.aurora-action-btn.danger:hover { background: #3a1a1a; border-color: #ff6060; }

.aurora-tab-bar {
  display: flex;
  gap: 2px;
  padding: 10px 16px 0;
  border-bottom: 1px solid #2d2d5c;
  flex-shrink: 0;
  overflow-x: auto;
}
.aurora-tab {
  padding: 6px 12px;
  border-radius: 6px 6px 0 0;
  border: 1px solid transparent;
  border-bottom: none;
  background: transparent;
  color: #8880cc;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  font-family: inherit;
  transition: color 0.12s, background 0.12s;
}
.aurora-tab:hover { color: #c0b4ff; background: #1e1e3a; }
.aurora-tab.active {
  background: #13132a;
  color: #c0b4ff;
  border-color: #2d2d5c;
  border-bottom-color: #13132a;
  margin-bottom: -1px;
}

.aurora-panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px 20px;
}
.aurora-panel-content::-webkit-scrollbar { width: 4px; }
.aurora-panel-content::-webkit-scrollbar-track { background: transparent; }
.aurora-panel-content::-webkit-scrollbar-thumb { background: #3a3a6c; border-radius: 99px; }

.aurora-tab-content { display: none; }
.aurora-tab-content.active { display: block; }

.aurora-section-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #5550aa;
  padding: 8px 0 4px;
  margin-top: 8px;
}
.aurora-section-label:first-child { margin-top: 0; }

.aurora-color-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 8px;
  padding: 5px 0;
  border-bottom: 1px solid #1e1e3a;
}
.aurora-color-row:last-child { border-bottom: none; }
.aurora-color-label {
  font-size: 12px;
  color: #b0b0d0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.aurora-color-picker {
  width: 28px;
  height: 28px;
  border: 2px solid #3a3a6c;
  border-radius: 6px;
  padding: 0;
  cursor: pointer;
  background: none;
  flex-shrink: 0;
}
.aurora-color-picker::-webkit-color-swatch-wrapper { padding: 0; }
.aurora-color-picker::-webkit-color-swatch { border: none; border-radius: 4px; }
.aurora-color-hex {
  width: 72px;
  background: #1a1a32;
  border: 1px solid #2d2d5c;
  border-radius: 5px;
  color: #c0b4ff;
  font-size: 11px;
  font-family: monospace;
  padding: 4px 5px;
  text-align: center;
}
.aurora-color-hex:focus { outline: 1px solid #7c6af7; border-color: #7c6af7; }

.aurora-space-note {
  font-size: 11px;
  color: #6060a0;
  padding: 6px 0 10px;
  line-height: 1.5;
}
.aurora-status-bar {
  text-align: center;
  font-size: 11px;
  color: #6060a0;
  padding: 4px 0 0;
  min-height: 18px;
}
.aurora-status-bar.ok   { color: #60c060; }
.aurora-status-bar.err  { color: #c06060; }
`;
  function getPref(pref, def = "") {
    try {
      return Services.prefs.getStringPref(pref, def);
    } catch {
      return def;
    }
  }
  function setPref(pref, value) {
    try {
      Services.prefs.setStringPref(pref, value);
    } catch {
    }
  }
  function toHex6(v) {
    const s2 = v.trim().replace(/^#/, "");
    if (/^[0-9a-f]{6}$/i.test(s2)) return `#${s2.toLowerCase()}`;
    if (/^[0-9a-f]{3}$/i.test(s2)) {
      const [a, b2, c] = s2.split("");
      return `#${a}${a}${b2}${b2}${c}${c}`.toLowerCase();
    }
    return v;
  }
  function toPickerHex(v) {
    const cleaned = toHex6(v);
    if (/^#[0-9a-f]{6}$/i.test(cleaned)) return cleaned;
    return "#000000";
  }
  function buildColorRow(label, pref, defaultVal, container, status) {
    const row = container.ownerDocument.createElement("div");
    row.className = "aurora-color-row";
    const lbl = container.ownerDocument.createElement("span");
    lbl.className = "aurora-color-label";
    lbl.textContent = label;
    const current = getPref(pref, defaultVal);
    const picker = container.ownerDocument.createElement("input");
    picker.type = "color";
    picker.className = "aurora-color-picker";
    picker.value = toPickerHex(current);
    const hex = container.ownerDocument.createElement("input");
    hex.type = "text";
    hex.className = "aurora-color-hex";
    hex.value = current || defaultVal;
    hex.maxLength = 9;
    hex.placeholder = defaultVal || "#000000";
    picker.addEventListener("input", () => {
      hex.value = picker.value;
      setPref(pref, picker.value);
      showStatus(status, "Ulo\u017Eeno", "ok");
    });
    hex.addEventListener("change", () => {
      const val = hex.value.trim();
      const norm = toHex6(val);
      hex.value = norm;
      picker.value = toPickerHex(norm);
      setPref(pref, norm);
      showStatus(status, "Ulo\u017Eeno", "ok");
    });
    row.appendChild(lbl);
    row.appendChild(picker);
    row.appendChild(hex);
    container.appendChild(row);
  }
  function showStatus(el, msg, cls) {
    el.textContent = msg;
    el.className = `aurora-status-bar ${cls}`;
    if (cls) {
      setTimeout(() => {
        el.textContent = "";
        el.className = "aurora-status-bar";
      }, 2e3);
    }
  }
  function buildPanel(doc) {
    const panel = doc.createElement("div");
    panel.id = PANEL_ID;
    const header = doc.createElement("div");
    header.className = "aurora-panel-header";
    const title = doc.createElement("span");
    title.className = "aurora-panel-title";
    title.textContent = "\u2726 Aurora \u2014 Nastaven\xED barev";
    const closeBtn = doc.createElement("button");
    closeBtn.className = "aurora-panel-close";
    closeBtn.textContent = "\u2715";
    closeBtn.title = "Zav\u0159\xEDt";
    closeBtn.addEventListener("click", () => togglePanel(doc));
    header.appendChild(title);
    header.appendChild(closeBtn);
    panel.appendChild(header);
    const actions = doc.createElement("div");
    actions.className = "aurora-panel-actions";
    const statusBar = doc.createElement("div");
    statusBar.className = "aurora-status-bar";
    const resetBtn = doc.createElement("button");
    resetBtn.className = "aurora-action-btn danger";
    resetBtn.textContent = "\u27F3  Reset na v\xFDchoz\xED";
    resetBtn.addEventListener("click", () => resetColors(doc, statusBar));
    const importBtn = doc.createElement("button");
    importBtn.className = "aurora-action-btn";
    importBtn.textContent = "\u{1F4C2}  Na\u010D\xEDst .txt";
    importBtn.addEventListener("click", () => importFromTxt(doc, panel, statusBar));
    const exportBtn = doc.createElement("button");
    exportBtn.className = "aurora-action-btn";
    exportBtn.textContent = "\u{1F4BE}  Ulo\u017Eit .txt";
    exportBtn.addEventListener("click", () => exportToTxt(doc, statusBar));
    actions.appendChild(resetBtn);
    actions.appendChild(importBtn);
    actions.appendChild(exportBtn);
    panel.appendChild(actions);
    const tabBar = doc.createElement("div");
    tabBar.className = "aurora-tab-bar";
    panel.appendChild(tabBar);
    const content = doc.createElement("div");
    content.className = "aurora-panel-content";
    content.appendChild(statusBar);
    panel.appendChild(content);
    const globalTab = makeTab(doc, tabBar, "Glob\xE1ln\xED barvy", true);
    const globalContent = makeTabContent(doc, content, true);
    buildGlobalColors(doc, globalContent, statusBar);
    for (let i = 0; i < SPACE_COUNT; i++) {
      const spaceTab = makeTab(doc, tabBar, `Space ${i + 1}`, false);
      const spaceContent = makeTabContent(doc, content, false);
      buildSpaceColors(doc, spaceContent, i, statusBar);
    }
    const tabs = tabBar.querySelectorAll(".aurora-tab");
    const contents = content.querySelectorAll(".aurora-tab-content");
    tabBar.addEventListener("click", (e) => {
      const clicked = e.target.closest(".aurora-tab");
      if (!clicked) return;
      const idx = Array.from(tabs).indexOf(clicked);
      tabs.forEach((t, ti) => t.classList.toggle("active", ti === idx));
      contents.forEach((c, ci) => c.classList.toggle("active", ci === idx));
    });
    return panel;
  }
  function makeTab(doc, bar, label, active) {
    const btn = doc.createElement("button");
    btn.className = "aurora-tab" + (active ? " active" : "");
    btn.textContent = label;
    bar.appendChild(btn);
    return btn;
  }
  function makeTabContent(doc, container, active) {
    const div = doc.createElement("div");
    div.className = "aurora-tab-content" + (active ? " active" : "");
    container.appendChild(div);
    return div;
  }
  function buildGlobalColors(doc, container, status) {
    const sections = [
      ["Panely & Sidebar", ["panel_bg", "toolbar_bg", "sidebar_bg", "panel_text", "border", "accent"]],
      ["Z\xE1lo\u017Eky", ["tab_active_bg", "tab_inactive_bg", "tab_text", "tab_close_hover", "tab_hover_bg"]],
      ["URL li\u0161ta", ["urlbar_bg", "urlbar_text", "urlbar_border", "urlbar_focus"]],
      ["Obsah & Ostatn\xED", ["browser_bg", "selection_bg", "scrollbar", "button_bg", "button_hover"]]
    ];
    for (const [sectionLabel, keys] of sections) {
      const lbl = doc.createElement("div");
      lbl.className = "aurora-section-label";
      lbl.textContent = sectionLabel;
      container.appendChild(lbl);
      for (const key of keys) {
        const field = GLOBAL_COLORS.find((c) => c.pref.endsWith(`.${key}`));
        if (!field) continue;
        buildColorRow(field.label, field.pref, field.default, container, status);
      }
    }
  }
  function buildSpaceColors(doc, container, spaceIdx, status) {
    const note = doc.createElement("div");
    note.className = "aurora-space-note";
    note.textContent = `Barvy pro Space ${spaceIdx + 1}. Pr\xE1zdn\xE9 pole = pou\u017Eije se glob\xE1ln\xED barva. Po\u0159ad\xED odpov\xEDd\xE1 po\u0159ad\xED spaces v sidebaru.`;
    container.appendChild(note);
    for (const sc of SPACE_COLORS) {
      const pref = spaceColorPref(spaceIdx, sc.key);
      buildColorRow(sc.label, pref, sc.default, container, status);
    }
  }
  function resetColors(doc, status) {
    for (const field of GLOBAL_COLORS) {
      try {
        Services.prefs.setStringPref(field.pref, field.default);
      } catch {
      }
    }
    for (let i = 0; i < SPACE_COUNT; i++) {
      for (const sc of SPACE_COLORS) {
        try {
          Services.prefs.clearUserPref(spaceColorPref(i, sc.key));
        } catch {
        }
      }
    }
    const panel = doc.getElementById(PANEL_ID);
    if (panel) {
      panel.querySelectorAll(".aurora-color-picker").forEach((picker) => {
        const row = picker.closest(".aurora-color-row");
        if (!row) return;
        const hexInput = row.querySelector(".aurora-color-hex");
        if (!hexInput) return;
        const label = row.querySelector(".aurora-color-label")?.textContent ?? "";
        const field = GLOBAL_COLORS.find((f) => f.label === label);
        const def = field?.default ?? "#000000";
        picker.value = toPickerHex(def);
        hexInput.value = def;
      });
    }
    showStatus(status, "Resetov\xE1no na v\xFDchoz\xED hodnoty", "ok");
  }
  function exportToTxt(doc, status) {
    const lines = [
      "# Aurora Theme Export",
      `# Vytvo\u0159eno: ${(/* @__PURE__ */ new Date()).toLocaleString("cs-CZ")}`,
      "",
      "# == Glob\xE1ln\xED barvy =="
    ];
    for (const field of GLOBAL_COLORS) {
      const val = getPref(field.pref, field.default);
      lines.push(`${field.pref}=${val}`);
    }
    lines.push("", "# == Barvy Spaces ==");
    for (let i = 0; i < SPACE_COUNT; i++) {
      lines.push(`# Space ${i + 1}`);
      for (const sc of SPACE_COLORS) {
        const pref = spaceColorPref(i, sc.key);
        const val = getPref(pref, "");
        lines.push(`${pref}=${val}`);
      }
    }
    const text = lines.join("\n");
    try {
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = doc.createElement("a");
      a.href = url;
      a.download = `aurora-theme-${Date.now()}.txt`;
      doc.body.appendChild(a);
      a.click();
      doc.body.removeChild(a);
      URL.revokeObjectURL(url);
      showStatus(status, "Soubor sta\u017Een", "ok");
    } catch (e) {
      showStatus(status, `Chyba exportu: ${e}`, "err");
    }
  }
  function importFromTxt(doc, panel, status) {
    const input = doc.createElement("input");
    input.type = "file";
    input.accept = ".txt,text/plain";
    input.style.display = "none";
    input.addEventListener("change", () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        let applied = 0;
        let errors = 0;
        for (const rawLine of text.split(/\r?\n/)) {
          const line = rawLine.trim();
          if (!line || line.startsWith("#")) continue;
          const eq = line.indexOf("=");
          if (eq < 0) continue;
          const pref = line.slice(0, eq).trim();
          const val = line.slice(eq + 1).trim();
          if (!pref.startsWith("mod.aurora.")) {
            errors++;
            continue;
          }
          try {
            Services.prefs.setStringPref(pref, val);
            applied++;
          } catch {
            errors++;
          }
        }
        panel.querySelectorAll(".aurora-color-hex").forEach((hexIn) => {
          const row = hexIn.closest(".aurora-color-row");
          if (!row) return;
          const picker = row.querySelector(".aurora-color-picker");
          const labelEl = row.querySelector(".aurora-color-label");
          if (!picker || !labelEl) return;
          const field = GLOBAL_COLORS.find((f) => f.label === labelEl.textContent);
          if (!field) return;
          const newVal = getPref(field.pref, field.default);
          hexIn.value = newVal;
          picker.value = toPickerHex(newVal);
        });
        const msg = errors > 0 ? `Na\u010Dteno ${applied} hodnot, ${errors} p\u0159esko\u010Deno` : `Na\u010Dteno ${applied} hodnot`;
        showStatus(status, msg, applied > 0 ? "ok" : "err");
      };
      reader.readAsText(file);
    });
    doc.body.appendChild(input);
    input.click();
    setTimeout(() => input.remove(), 3e4);
  }
  function togglePanel(doc) {
    const panel = doc.getElementById(PANEL_ID);
    if (!panel) return;
    panel.classList.toggle("aurora-open");
  }
  function initPanel(doc) {
    let styleEl = doc.getElementById(STYLES_ID);
    if (!styleEl) {
      styleEl = doc.createElement("style");
      styleEl.id = STYLES_ID;
      (doc.head ?? doc.documentElement).appendChild(styleEl);
    }
    styleEl.textContent = PANEL_CSS;
    let fab = doc.getElementById(BTN_ID);
    if (!fab) {
      fab = doc.createElement("button");
      fab.id = BTN_ID;
      fab.title = "Aurora \u2014 nastaven\xED barev";
      fab.textContent = "\u2726";
      fab.addEventListener("click", () => togglePanel(doc));
      doc.documentElement.appendChild(fab);
    }
    let panel = doc.getElementById(PANEL_ID);
    if (!panel) {
      panel = buildPanel(doc);
      doc.documentElement.appendChild(panel);
    }
    const onKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        togglePanel(doc);
      }
    };
    doc.addEventListener("keydown", onKey, { capture: true });
    return () => {
      doc.getElementById(PANEL_ID)?.remove();
      doc.getElementById(BTN_ID)?.remove();
      doc.getElementById(STYLES_ID)?.remove();
      doc.removeEventListener("keydown", onKey, true);
    };
  }

  // src/entry.uc.mts
  var soundsRunning = false;
  var dynamicRunning = false;
  var stopSpaces = null;
  var stopPanel = null;
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
      const enabled = Services.prefs.getBoolPref("mod.aurora.enabled", true);
      if (!enabled) {
        dump("[Aurora] Disabled.\n");
        return;
      }
      const doc = document;
      await applyAll(doc);
      initEvents(doc);
      stopSpaces = initSpaces(doc);
      stopPanel = initPanel(doc);
      const observer = {
        observe(_subject, topic, data) {
          if (topic === "nsPref:changed" && data.startsWith("mod.aurora.")) {
            applyAll(doc).catch((e) => dump(`[Aurora] Observer error: ${e}
`));
          }
        }
      };
      Services.prefs.addObserver("mod.aurora.", observer);
      doc.defaultView?.addEventListener("beforeunload", () => {
        Services.prefs.removeObserver("mod.aurora.", observer);
        stopSounds();
        stopDynamicTheme();
        stopSpaces?.();
        stopPanel?.();
      }, { once: true });
      dump("[Aurora] Loaded successfully.\n");
    } catch (e) {
      dump(`[Aurora] Error during init: ${e}
`);
      console.error("[Aurora] Error during init:", e);
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

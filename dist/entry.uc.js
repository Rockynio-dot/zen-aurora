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
    let top = rect.bottom + 6;
    let left = rect.left;
    if (left + 240 > window.innerWidth) left = window.innerWidth - 244;
    if (top + 320 > window.innerHeight) top = rect.top - 324;
    if (left < 4) left = 4;
    if (top < 4) top = 4;
    popupEl.style.top = `${top}px`;
    popupEl.style.left = `${left}px`;
    popupEl.classList.add("open");
  }
  function closeColorPicker() {
    popupEl?.classList.remove("open");
  }

  // src/ui/panel.ts
  var PANEL_ID = "aurora-ui-panel";
  var BTN_ID = "aurora-ui-sidebar-btn";
  var STYLES_ID = "aurora-ui-styles";
  var PANEL_CSS = `
/* Sidebar button \u2014 injected into Zen's sidebar action buttons */
#aurora-ui-sidebar-btn {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 32px !important;
  height: 32px !important;
  border-radius: 8px !important;
  background: transparent !important;
  border: none !important;
  cursor: pointer !important;
  color: var(--aurora-panel-text, #c0b4ff) !important;
  font-size: 16px !important;
  opacity: 0.75 !important;
  transition: opacity 0.15s, background 0.15s !important;
  margin: 2px auto !important;
}
#aurora-ui-sidebar-btn:hover {
  opacity: 1 !important;
  background: var(--aurora-button-hover, #2a2a5a) !important;
}
#aurora-ui-sidebar-btn.aurora-panel-open {
  opacity: 1 !important;
  background: var(--aurora-accent, #7c6af7) !important;
  color: #fff !important;
}

/* Dynamic theme info bar in panel */
.aurora-dynamic-bar {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 10px; margin-bottom: 2px;
  background: #1a1a38; border-radius: 6px;
  font-size: 11px; color: #9090c0; line-height: 1.4;
}
.aurora-dynamic-dot {
  width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
  background: #5550aa;
}
.aurora-dynamic-dot.active { background: #7c6af7; box-shadow: 0 0 6px #7c6af7; }

#aurora-ui-panel {
  position: fixed;
  top: 0; right: -440px;
  width: 420px; height: 100vh;
  z-index: 2147483639;
  background: #13132a;
  border-left: 1px solid #2d2d5c;
  box-shadow: -8px 0 32px #00000088;
  display: flex; flex-direction: column;
  font-family: system-ui, sans-serif;
  font-size: 13px; color: #e0e0ff;
  transition: right 0.25s cubic-bezier(0.4,0,0.2,1);
  overflow: hidden;
}
#aurora-ui-panel.aurora-open { right: 0; }

.aurora-ph {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px;
  background: #0f0f22;
  border-bottom: 1px solid #2d2d5c;
  flex-shrink: 0;
}
.aurora-ph-title { font-size: 15px; font-weight: 700; color: #c0b4ff; letter-spacing: 0.5px; }
.aurora-ph-close {
  background: transparent; border: none; color: #8880cc;
  font-size: 18px; cursor: pointer; padding: 2px 6px; border-radius: 4px; line-height: 1;
}
.aurora-ph-close:hover { background: #2a2a4e; color: #e0e0ff; }

.aurora-actions {
  display: grid; grid-template-columns: 1fr 1fr 1fr;
  gap: 8px; padding: 12px 16px;
  border-bottom: 1px solid #2d2d5c; flex-shrink: 0;
}
.aurora-abtn {
  padding: 7px 6px;
  border: 1px solid #3a3a6c; border-radius: 8px;
  background: #1e1e3a; color: #c0b4ff;
  font-size: 11px; cursor: pointer; text-align: center;
  transition: background 0.12s; font-family: inherit;
}
.aurora-abtn:hover { background: #2a2a5a; border-color: #7c6af7; }
.aurora-abtn.danger { border-color: #6c2a2a; color: #ff9090; }
.aurora-abtn.danger:hover { background: #3a1a1a; border-color: #ff6060; }

.aurora-tab-bar {
  display: flex; gap: 2px; padding: 10px 16px 0;
  border-bottom: 1px solid #2d2d5c; flex-shrink: 0; overflow-x: auto;
}
.aurora-tab {
  padding: 6px 12px; border-radius: 6px 6px 0 0;
  border: 1px solid transparent; border-bottom: none;
  background: transparent; color: #8880cc; font-size: 12px;
  cursor: pointer; white-space: nowrap; font-family: inherit;
  transition: color 0.12s, background 0.12s;
}
.aurora-tab:hover { color: #c0b4ff; background: #1e1e3a; }
.aurora-tab.active {
  background: #13132a; color: #c0b4ff;
  border-color: #2d2d5c; border-bottom-color: #13132a;
  margin-bottom: -1px;
}

.aurora-pc {
  flex: 1; overflow-y: auto; padding: 12px 16px 20px;
}
.aurora-pc::-webkit-scrollbar { width: 4px; }
.aurora-pc::-webkit-scrollbar-track { background: transparent; }
.aurora-pc::-webkit-scrollbar-thumb { background: #3a3a6c; border-radius: 99px; }

.aurora-tab-content { display: none; }
.aurora-tab-content.active { display: block; }

.aurora-sec-label {
  font-size: 10px; font-weight: 600; letter-spacing: 1px;
  text-transform: uppercase; color: #5550aa; padding: 10px 0 4px; margin-top: 4px;
}
.aurora-sec-label:first-child { margin-top: 0; padding-top: 4px; }

/* Color row */
.aurora-cr {
  display: flex; align-items: center;
  padding: 5px 0; border-bottom: 1px solid #1e1e3a; gap: 8px;
}
.aurora-cr:last-child { border-bottom: none; }
.aurora-cr-label {
  flex: 1; font-size: 12px; color: #b0b0d0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0;
}
.aurora-cr-swatch {
  width: 26px; height: 26px; border-radius: 6px;
  border: 2px solid #3a3a6c; cursor: pointer; flex-shrink: 0;
  transition: border-color 0.12s, transform 0.12s;
}
.aurora-cr-swatch:hover { border-color: #7c6af7; transform: scale(1.1); }
.aurora-cr-hex {
  width: 70px; background: #1a1a32;
  border: 1px solid #2d2d5c; border-radius: 5px;
  color: #c0b4ff; font-size: 11px; font-family: monospace;
  padding: 4px 5px; text-align: center; flex-shrink: 0;
}
.aurora-cr-hex:focus { outline: 1px solid #7c6af7; border-color: #7c6af7; }

.aurora-status {
  text-align: center; font-size: 11px; color: #6060a0;
  padding: 4px 0 0; min-height: 18px;
}
.aurora-status.ok  { color: #60c060; }
.aurora-status.err { color: #c06060; }

.aurora-space-note {
  font-size: 11px; color: #6060a0; padding: 4px 0 8px; line-height: 1.5;
}
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
  function showStatus(el, msg, cls) {
    el.textContent = msg;
    el.className = `aurora-status ${cls}`;
    if (cls) setTimeout(() => {
      el.textContent = "";
      el.className = "aurora-status";
    }, 2200);
  }
  function buildColorRow(label, pref, defaultVal, container, status) {
    const doc = container.ownerDocument;
    const current = getPref(pref, defaultVal);
    const row = doc.createElement("div");
    row.className = "aurora-cr";
    const lbl = doc.createElement("span");
    lbl.className = "aurora-cr-label";
    lbl.textContent = label;
    const swatch = doc.createElement("div");
    swatch.className = "aurora-cr-swatch";
    swatch.style.background = current || defaultVal || "#000";
    swatch.title = "Klikni pro v\xFDb\u011Br barvy";
    const hexIn = doc.createElement("input");
    hexIn.type = "text";
    hexIn.className = "aurora-cr-hex";
    hexIn.value = current || defaultVal;
    hexIn.maxLength = 9;
    hexIn.placeholder = defaultVal || "#000000";
    const syncFromHex = (val) => {
      swatch.style.background = val;
      setPref(pref, val);
      showStatus(status, "Ulo\u017Eeno", "ok");
    };
    swatch.addEventListener("click", (e) => {
      e.stopPropagation();
      openColorPicker(swatch, hexIn.value || defaultVal || "#7c6af7", (hex) => {
        hexIn.value = hex;
        syncFromHex(hex);
      });
    });
    hexIn.addEventListener("change", () => {
      const v = hexIn.value.trim();
      const norm = v.startsWith("#") ? v : `#${v}`;
      hexIn.value = norm;
      swatch.style.background = norm;
      syncFromHex(norm);
    });
    row.appendChild(lbl);
    row.appendChild(swatch);
    row.appendChild(hexIn);
    container.appendChild(row);
  }
  function secLabel(doc, container, text) {
    const el = doc.createElement("div");
    el.className = "aurora-sec-label";
    el.textContent = text;
    container.appendChild(el);
  }
  function buildGlobalColors(doc, container, status) {
    const sections = [
      ["Panely & Sidebar", ["panel_bg", "toolbar_bg", "sidebar_bg", "panel_text", "border", "accent"]],
      ["Z\xE1lo\u017Eky", ["tab_active_bg", "tab_inactive_bg", "tab_text", "tab_close_hover", "tab_hover_bg"]],
      ["URL li\u0161ta", ["urlbar_bg", "urlbar_text", "urlbar_border", "urlbar_focus"]],
      ["Obsah & Ostatn\xED", ["browser_bg", "selection_bg", "scrollbar", "button_bg", "button_hover"]]
    ];
    for (const [sec, keys] of sections) {
      secLabel(doc, container, sec);
      for (const key of keys) {
        const field = GLOBAL_COLORS.find((c) => c.pref.endsWith(`.${key}`));
        if (field) buildColorRow(field.label, field.pref, field.default, container, status);
      }
    }
  }
  function buildSpaceColors(doc, container, idx, status) {
    const note = doc.createElement("div");
    note.className = "aurora-space-note";
    note.textContent = `Barvy pro Space ${idx + 1}. Pr\xE1zdn\xE9 = pou\u017Eije se glob\xE1ln\xED barva.`;
    container.appendChild(note);
    for (const sc of SPACE_COLORS) {
      buildColorRow(sc.label, spaceColorPref(idx, sc.key), sc.default, container, status);
    }
  }
  function resetColors(doc, panel, status) {
    for (const f of GLOBAL_COLORS) {
      try {
        Services.prefs.setStringPref(f.pref, f.default);
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
    panel.querySelectorAll(".aurora-cr").forEach((row) => {
      const labelEl = row.querySelector(".aurora-cr-label");
      const swatch = row.querySelector(".aurora-cr-swatch");
      const hexInput = row.querySelector(".aurora-cr-hex");
      if (!labelEl || !swatch || !hexInput) return;
      const field = GLOBAL_COLORS.find((f) => f.label === labelEl.textContent);
      if (!field) return;
      swatch.style.background = field.default;
      hexInput.value = field.default;
    });
    showStatus(status, "Resetov\xE1no na v\xFDchoz\xED hodnoty", "ok");
  }
  function exportToTxt(doc, status) {
    const lines = [`# Aurora Theme Export`, `# ${(/* @__PURE__ */ new Date()).toLocaleString("cs-CZ")}`, ""];
    lines.push("# == Glob\xE1ln\xED barvy ==");
    for (const f of GLOBAL_COLORS) lines.push(`${f.pref}=${getPref(f.pref, f.default)}`);
    lines.push("", "# == Spaces ==");
    for (let i = 0; i < SPACE_COUNT; i++) {
      lines.push(`# Space ${i + 1}`);
      for (const sc of SPACE_COLORS) {
        const p = spaceColorPref(i, sc.key);
        lines.push(`${p}=${getPref(p, "")}`);
      }
    }
    try {
      const blob = new Blob([lines.join("\n")], { type: "text/plain" });
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
      showStatus(status, `Chyba: ${e}`, "err");
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
        let applied = 0, errors = 0;
        const text = e.target?.result;
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
        panel.querySelectorAll(".aurora-cr").forEach((row) => {
          const labelEl = row.querySelector(".aurora-cr-label");
          const swatch = row.querySelector(".aurora-cr-swatch");
          const hexInput = row.querySelector(".aurora-cr-hex");
          if (!labelEl || !swatch || !hexInput) return;
          const field = GLOBAL_COLORS.find((f) => f.label === labelEl.textContent);
          if (!field) return;
          const newVal = getPref(field.pref, field.default);
          swatch.style.background = newVal;
          hexInput.value = newVal;
        });
        showStatus(
          status,
          errors > 0 ? `Na\u010Dteno ${applied}, p\u0159esko\u010Deno ${errors}` : `Na\u010Dteno ${applied} hodnot`,
          applied > 0 ? "ok" : "err"
        );
      };
      reader.readAsText(file);
    });
    doc.body.appendChild(input);
    input.click();
    setTimeout(() => input.remove(), 3e4);
  }
  function buildPanel(doc) {
    const panel = doc.createElement("div");
    panel.id = PANEL_ID;
    const hdr = doc.createElement("div");
    hdr.className = "aurora-ph";
    const title = doc.createElement("span");
    title.className = "aurora-ph-title";
    title.textContent = "\u2726 Aurora \u2014 Barvy";
    const closeBtn = doc.createElement("button");
    closeBtn.className = "aurora-ph-close";
    closeBtn.textContent = "\u2715";
    closeBtn.title = "Zav\u0159\xEDt";
    closeBtn.addEventListener("click", () => togglePanel(doc));
    hdr.appendChild(title);
    hdr.appendChild(closeBtn);
    panel.appendChild(hdr);
    const status = doc.createElement("div");
    status.className = "aurora-status";
    const acts = doc.createElement("div");
    acts.className = "aurora-actions";
    const resetBtn = doc.createElement("button");
    resetBtn.className = "aurora-abtn danger";
    resetBtn.textContent = "\u27F3  Reset";
    const importBtn = doc.createElement("button");
    importBtn.className = "aurora-abtn";
    importBtn.textContent = "\u{1F4C2}  Na\u010D\xEDst .txt";
    const exportBtn = doc.createElement("button");
    exportBtn.className = "aurora-abtn";
    exportBtn.textContent = "\u{1F4BE}  Ulo\u017Eit .txt";
    acts.appendChild(resetBtn);
    acts.appendChild(importBtn);
    acts.appendChild(exportBtn);
    panel.appendChild(acts);
    panel.appendChild(status);
    const tabBar = doc.createElement("div");
    tabBar.className = "aurora-tab-bar";
    panel.appendChild(tabBar);
    const pc = doc.createElement("div");
    pc.className = "aurora-pc";
    panel.appendChild(pc);
    const dynBar = doc.createElement("div");
    dynBar.className = "aurora-dynamic-bar";
    const dynDot = doc.createElement("div");
    dynDot.className = "aurora-dynamic-dot";
    const dynTxt = doc.createElement("span");
    dynTxt.textContent = getDynamicStatus();
    dynBar.appendChild(dynDot);
    dynBar.appendChild(dynTxt);
    pc.appendChild(dynBar);
    try {
      const mode = Services.prefs.getStringPref("mod.aurora.dynamic_mode", "off");
      if (mode !== "off") dynDot.classList.add("active");
    } catch {
    }
    const dynInterval = setInterval(() => {
      dynTxt.textContent = getDynamicStatus();
      try {
        const mode = Services.prefs.getStringPref("mod.aurora.dynamic_mode", "off");
        dynDot.classList.toggle("active", mode !== "off");
      } catch {
      }
    }, 3e4);
    panel._dynInterval = dynInterval;
    makeTab(doc, tabBar, "Glob\xE1ln\xED barvy", true);
    const globalContent = makeTabContent(doc, pc, true);
    buildGlobalColors(doc, globalContent, status);
    for (let i = 0; i < SPACE_COUNT; i++) {
      makeTab(doc, tabBar, `Space ${i + 1}`, false);
      const sc = makeTabContent(doc, pc, false);
      buildSpaceColors(doc, sc, i, status);
    }
    const tabs = tabBar.querySelectorAll(".aurora-tab");
    const contents = pc.querySelectorAll(".aurora-tab-content");
    tabBar.addEventListener("click", (e) => {
      const t = e.target.closest(".aurora-tab");
      if (!t) return;
      const idx = Array.from(tabs).indexOf(t);
      tabs.forEach((tb, ti) => tb.classList.toggle("active", ti === idx));
      contents.forEach((ct, ci) => ct.classList.toggle("active", ci === idx));
    });
    resetBtn.addEventListener("click", () => resetColors(doc, panel, status));
    importBtn.addEventListener("click", () => importFromTxt(doc, panel, status));
    exportBtn.addEventListener("click", () => exportToTxt(doc, status));
    return panel;
  }
  function makeTab(doc, bar, label, active) {
    const btn = doc.createElement("button");
    btn.className = "aurora-tab" + (active ? " active" : "");
    btn.textContent = label;
    bar.appendChild(btn);
  }
  function makeTabContent(doc, container, active) {
    const div = doc.createElement("div");
    div.className = "aurora-tab-content" + (active ? " active" : "");
    container.appendChild(div);
    return div;
  }
  function togglePanel(doc) {
    const panel = doc.getElementById(PANEL_ID);
    const btn = doc.getElementById(BTN_ID);
    const isOpen = panel?.classList.toggle("aurora-open");
    btn?.classList.toggle("aurora-panel-open", isOpen);
  }
  var SIDEBAR_TARGETS = [
    "#zen-sidebar-top-buttons",
    "#zen-sidebar-top-buttons-customization-target",
    "#TabsToolbar",
    "#nav-bar"
  ];
  function injectSidebarButton(doc) {
    if (doc.getElementById(BTN_ID)) return doc.getElementById(BTN_ID);
    const btn = doc.createElement("button");
    btn.id = BTN_ID;
    btn.title = "Aurora \u2014 nastaven\xED barev  (Ctrl+Shift+A)";
    btn.textContent = "\u2726";
    btn.addEventListener("click", () => togglePanel(doc));
    for (const sel of SIDEBAR_TARGETS) {
      const target = doc.querySelector(sel);
      if (target) {
        target.appendChild(btn);
        return btn;
      }
    }
    btn.style.cssText = "position:fixed;bottom:12px;right:12px;z-index:2147483638;width:32px;height:32px;border-radius:50%;border:none;cursor:pointer;background:#7c6af7;color:#fff;font-size:15px;";
    doc.documentElement.appendChild(btn);
    return btn;
  }
  function initPanel(doc) {
    let styleEl = doc.getElementById(STYLES_ID);
    if (!styleEl) {
      styleEl = doc.createElement("style");
      styleEl.id = STYLES_ID;
      (doc.head ?? doc.documentElement).appendChild(styleEl);
    }
    styleEl.textContent = PANEL_CSS;
    initColorPicker(doc);
    injectSidebarButton(doc);
    let panel = doc.getElementById(PANEL_ID);
    if (!panel) {
      const built = buildPanel(doc);
      doc.documentElement.appendChild(built);
      panel = built;
    }
    const onKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        togglePanel(doc);
      }
    };
    doc.addEventListener("keydown", onKey, { capture: true });
    const prefObserver = {
      observe(_s, topic, data) {
        if (topic === "nsPref:changed" && data === "mod.aurora.ui.open_panel") {
          try {
            const val = Services.prefs.getBoolPref("mod.aurora.ui.open_panel", false);
            if (val) {
              togglePanel(doc);
              Services.prefs.setBoolPref("mod.aurora.ui.open_panel", false);
            }
          } catch {
          }
        }
      }
    };
    Services.prefs.addObserver("mod.aurora.ui.open_panel", prefObserver);
    return () => {
      const p = doc.getElementById(PANEL_ID);
      if (p?._dynInterval) clearInterval(p._dynInterval);
      p?.remove();
      doc.getElementById(BTN_ID)?.remove();
      doc.getElementById(STYLES_ID)?.remove();
      doc.getElementById("aurora-cp-popup")?.remove();
      doc.getElementById("aurora-cp-styles")?.remove();
      doc.removeEventListener("keydown", onKey, true);
      Services.prefs.removeObserver("mod.aurora.ui.open_panel", prefObserver);
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

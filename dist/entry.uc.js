"use strict";
(() => {
  // src/core/state.ts
  function getPref(key, fallback) {
    try {
      return Services.prefs.getStringPref(key, fallback);
    } catch {
      return fallback;
    }
  }
  function getBoolPref(key, fallback) {
    try {
      return Services.prefs.getBoolPref(key, fallback);
    } catch {
      return fallback;
    }
  }
  function loadTheme() {
    const speed = getPref("mod.aurora.animation_speed", "normal");
    const dynamicMode = getPref("mod.aurora.dynamic_mode", "off");
    return {
      colors: {
        panelBg: getPref("mod.aurora.color.panel_bg", "#1a1a2e"),
        panelText: getPref("mod.aurora.color.panel_text", "#e0e0ff"),
        border: getPref("mod.aurora.color.border", "#3a3a5c"),
        browserBg: getPref("mod.aurora.color.browser_bg", "#0f0f1a"),
        accent: getPref("mod.aurora.color.accent", "#7c6af7")
      },
      images: {
        browserBg: getPref("mod.aurora.image.browser_bg", "") || null,
        newTabBg: getPref("mod.aurora.image.newtab_bg", "") || null
      },
      sounds: {
        enabled: getBoolPref("mod.aurora.sounds_enabled", false),
        pack: getPref("mod.aurora.sound_pack", "default"),
        customPack: null
      },
      animations: {
        speed: ["none", "slow", "normal", "fast"].includes(speed) ? speed : "normal"
      },
      dynamicMode: ["off", "material", "daynight"].includes(dynamicMode) ? dynamicMode : "off",
      folderIcons: {}
    };
  }
  function saveTheme(theme) {
    Services.prefs.setStringPref("mod.aurora.color.panel_bg", theme.colors.panelBg);
    Services.prefs.setStringPref("mod.aurora.color.panel_text", theme.colors.panelText);
    Services.prefs.setStringPref("mod.aurora.color.border", theme.colors.border);
    Services.prefs.setStringPref("mod.aurora.color.browser_bg", theme.colors.browserBg);
    Services.prefs.setStringPref("mod.aurora.color.accent", theme.colors.accent);
    Services.prefs.setStringPref("mod.aurora.animation_speed", theme.animations.speed);
    Services.prefs.setBoolPref("mod.aurora.sounds_enabled", theme.sounds.enabled);
    Services.prefs.setStringPref("mod.aurora.dynamic_mode", theme.dynamicMode);
  }
  function mergeTheme(partial) {
    const current = loadTheme();
    const merged = {
      ...current,
      ...partial,
      colors: { ...current.colors, ...partial.colors ?? {} },
      images: { ...current.images, ...partial.images ?? {} },
      sounds: { ...current.sounds, ...partial.sounds ?? {} },
      animations: { ...current.animations, ...partial.animations ?? {} },
      folderIcons: { ...current.folderIcons, ...partial.folderIcons ?? {} }
    };
    saveTheme(merged);
    return merged;
  }
  var DEFAULT_THEME = loadTheme();

  // src/core/cssEngine.ts
  var STYLE_ID = "aurora-dynamic-styles";
  var ANIMATION_DURATIONS = {
    none: "0s",
    slow: "0.5s",
    normal: "0.2s",
    fast: "0.08s"
  };
  function generateCSS(theme) {
    const animDuration = ANIMATION_DURATIONS[theme.animations.speed] ?? "0.2s";
    const bgImage = theme.images.browserBg ? `url("${theme.images.browserBg}")` : "none";
    return `
    :root {
      --aurora-panel-bg: ${theme.colors.panelBg};
      --aurora-panel-text: ${theme.colors.panelText};
      --aurora-border: ${theme.colors.border};
      --aurora-browser-bg: ${theme.colors.browserBg};
      --aurora-accent: ${theme.colors.accent};
      --aurora-anim: ${animDuration};
      --aurora-bg-image: ${bgImage};
    }

    #navigator-toolbox,
    #sidebar-box,
    #TabsToolbar {
      background-color: var(--aurora-panel-bg) !important;
      color: var(--aurora-panel-text) !important;
      border-color: var(--aurora-border) !important;
    }

    #browser {
      background: var(--aurora-browser-bg) var(--aurora-bg-image) center/cover no-repeat !important;
    }

    .tab-background,
    .tabbrowser-tab[selected] .tab-background {
      transition: background-color var(--aurora-anim) ease,
                  opacity var(--aurora-anim) ease !important;
    }

    toolbarbutton,
    .tab-close-button {
      transition: opacity var(--aurora-anim) ease !important;
    }

    ${theme.animations.speed === "none" ? "* { transition: none !important; animation: none !important; }" : ""}
  `.trim();
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
    const css = generateCSS(theme);
    injectStyles(css, targetDoc);
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
        const loaded = await Promise.all(srcs.map((s) => loadBuffer(audioCtx, s)));
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
  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
  }
  function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255];
  }
  function luminance(r, g, b) {
    const sRGB = [r, g, b].map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  }
  function darken(hex, factor) {
    const [r, g, b] = hexToRgb(hex);
    return rgbToHex(
      Math.round(r * (1 - factor)),
      Math.round(g * (1 - factor)),
      Math.round(b * (1 - factor))
    );
  }
  function lighten(hex, factor) {
    const [r, g, b] = hexToRgb(hex);
    return rgbToHex(
      Math.min(255, Math.round(r + (255 - r) * factor)),
      Math.min(255, Math.round(g + (255 - g) * factor)),
      Math.min(255, Math.round(b + (255 - b) * factor))
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
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const lum2 = luminance(r, g, b);
      if (lum2 > 0.05 && lum2 < 0.95) pixels.push([r, g, b]);
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
        ([ar, ag, ab], [r, g, b]) => [ar + r, ag + g, ab + b],
        [0, 0, 0]
      ).map((v) => Math.round(v / pixels.length));
      return [avg];
    }
    const ranges = [0, 1, 2].map((ch) => {
      const vals = pixels.map((p) => p[ch]);
      return Math.max(...vals) - Math.min(...vals);
    });
    const channel = ranges.indexOf(Math.max(...ranges));
    pixels.sort((a, b) => a[channel] - b[channel]);
    const mid = Math.floor(pixels.length / 2);
    return [
      ...medianCut(pixels.slice(0, mid), depth - 1),
      ...medianCut(pixels.slice(mid), depth - 1)
    ];
  }

  // src/features/dynamicTheme.ts
  var dynamicTimer = null;
  function lerp(a, b, t) {
    return Math.round(a + (b - a) * t);
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
    const merged = mergeTheme({ colors: paletteToColors(palette) });
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
    const merged = mergeTheme({ colors });
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

  // src/entry.uc.mts
  var soundsRunning = false;
  var dynamicRunning = false;
  async function applyAll(doc) {
    const theme = loadTheme();
    applyTheme(theme, doc);
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
        dump("[Aurora] Disabled via preferences.\n");
        return;
      }
      const doc = document;
      await applyAll(doc);
      initEvents(doc);
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

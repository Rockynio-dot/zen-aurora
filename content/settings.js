"use strict";
(() => {
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
  function hsvToHex(h, s, v) {
    const c = v * s;
    const x = c * (1 - Math.abs(h / 60 % 2 - 1));
    const m = v - c;
    let r = 0, g = 0, b = 0;
    if (h < 60) {
      r = c;
      g = x;
    } else if (h < 120) {
      r = x;
      g = c;
    } else if (h < 180) {
      g = c;
      b = x;
    } else if (h < 240) {
      g = x;
      b = c;
    } else if (h < 300) {
      r = x;
      b = c;
    } else {
      r = c;
      b = x;
    }
    return "#" + [r + m, g + m, b + m].map((n) => Math.round(n * 255).toString(16).padStart(2, "0")).join("");
  }
  function hexToHsv(hex) {
    const clean = hex.replace("#", "").slice(0, 6);
    if (clean.length < 6) return [0, 0, 0.5];
    const r = parseInt(clean.slice(0, 2), 16) / 255;
    const g = parseInt(clean.slice(2, 4), 16) / 255;
    const b = parseInt(clean.slice(4, 6), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    if (d > 0) {
      if (max === r) h = (g - b) / d % 6;
      else if (max === g) h = (b - r) / d + 2;
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
  function emit() {
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
    emit();
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
    emit();
  }
  function onHexChange() {
    if (!hexInputEl) return;
    const raw = hexInputEl.value.trim().replace(/^#/, "");
    if (/^[0-9a-f]{6}$/i.test(raw)) {
      const [h, s, v] = hexToHsv(`#${raw}`);
      pickerH = h;
      pickerS = s;
      pickerV = v;
      updateUI();
      emit();
    }
  }
  function initColorPicker(doc) {
    if (doc.getElementById(PICKER_ID)) return;
    const styleId = "aurora-cp-styles";
    if (!doc.getElementById(styleId)) {
      const s = doc.createElement("style");
      s.id = styleId;
      s.textContent = PICKER_CSS;
      (doc.head ?? doc.documentElement).appendChild(s);
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
        const [h, s, v] = hexToHsv(col);
        pickerH = h;
        pickerS = s;
        pickerV = v;
        updateUI();
        emit();
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
    const [h, s, v] = hexToHsv(currentHex || "#7c6af7");
    pickerH = h;
    pickerS = s;
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
    const seg = doc.createElement("div");
    seg.className = "aoc-seg";
    let cur = getPref(pref, def);
    const btns = [];
    for (const opt of options) {
      const b = doc.createElement("button");
      b.type = "button";
      b.className = "aoc-seg-btn" + (opt.value === cur ? " active" : "");
      b.textContent = opt.label;
      b.dataset.value = opt.value;
      b.addEventListener("click", () => {
        cur = opt.value;
        setPref(pref, cur);
        for (const o of btns) o.classList.toggle("active", o === b);
        onChange?.(cur);
      });
      seg.appendChild(b);
      btns.push(b);
    }
    wrap.appendChild(seg);
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

  // src/core/state.ts
  var AURORA_COLOR_DEFAULTS = {
    "mod.aurora.color.panel_bg": "#1a1a2e",
    "mod.aurora.color.toolbar_bg": "#16162a",
    "mod.aurora.color.sidebar_bg": "#12122a",
    "mod.aurora.color.panel_text": "#e0e0ff",
    "mod.aurora.color.tab_text": "#c0c0e0",
    "mod.aurora.color.urlbar_text": "#e0e0ff",
    "mod.aurora.color.border": "#3a3a5c",
    "mod.aurora.color.accent": "#7c6af7",
    "mod.aurora.color.tab_active_bg": "#2a2a4e",
    "mod.aurora.color.tab_inactive_bg": "#1a1a2e",
    "mod.aurora.color.tab_close_hover": "#ff6b6b",
    "mod.aurora.color.tab_hover_bg": "#252550",
    "mod.aurora.color.urlbar_bg": "#1e1e3a",
    "mod.aurora.color.urlbar_border": "#3a3a6c",
    "mod.aurora.color.urlbar_focus": "#7c6af7",
    "mod.aurora.color.browser_bg": "#0f0f1a",
    "mod.aurora.color.selection_bg": "#7c6af740",
    "mod.aurora.color.scrollbar": "#3a3a6c",
    "mod.aurora.color.button_bg": "#2a2a4e",
    "mod.aurora.color.button_hover": "#3a3a6e",
    "mod.aurora.color.workspace_strip_bg": "#0d0d1e",
    "mod.aurora.color.workspace_dot": "#3a3a6c",
    "mod.aurora.color.workspace_dot_active": "#7c6af7"
  };

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
  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    let h = 0;
    if (d !== 0) {
      if (max === r) h = (g - b) / d % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
    }
    const l = (min + max) / 2;
    const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    return [h * 60, s, l];
  }
  function hueToRgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
  function hslToRgb(h, s, l) {
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hueToRgb(p, q, h + 1 / 3);
      g = hueToRgb(p, q, h);
      b = hueToRgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
  function luminance([r, g, b]) {
    const a = [r, g, b].map((v) => {
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
        const b = toolbarBaseRaw(isDark);
        return `rgba(${b[0]}, ${b[1]}, ${b[2]}, 1)`;
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
    const [h, s, l] = rgbToHsl(dominant[0], dominant[1], dominant[2]);
    const saturation = Math.min(1, s + 0.3);
    const targetLightness = windowDark ? 0.62 : 0.42;
    const lightness = l * 0.4 + targetLightness * 0.6;
    const [r, g, b] = hslToRgb(h / 360, saturation, lightness);
    return `rgb(${r}, ${g}, ${b})`;
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
  function rgbToHex([r, g, b]) {
    return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
  }

  // src/ui/i18n.ts
  function getLang() {
    try {
      return Services.prefs.getStringPref("mod.aurora.ui.lang", "cs") || "cs";
    } catch {
      return "cs";
    }
  }
  function setLang(lang) {
    try {
      Services.prefs.setStringPref("mod.aurora.ui.lang", lang);
    } catch {
    }
  }
  var EN = {
    // ── Chrome / header ──
    "\u2715 Zav\u0159\xEDt  (Esc)": "\u2715 Close  (Esc)",
    "Jazyk": "Language",
    "Vzhled": "Appearance",
    "Barva": "Colour",
    "Tmav\xFD": "Dark",
    "Sv\u011Btl\xFD": "Light",
    // ── Nav ──
    "Rychl\xE9": "Quick",
    "Barvy": "Colours",
    "Spaces": "Spaces",
    "Pozad\xED": "Background",
    "Rozm\u011Bry": "Sizing",
    "Efekty": "Effects",
    "P\xEDsmo & Text": "Font & Text",
    "P\u0159\xEDstupnost": "Accessibility",
    "Presety": "Presets",
    "O m\xF3du": "About",
    // ── Quick ──
    'Vyberte 1\u20133 barvy a pr\u016Fhlednost \u2014 Aurora vygeneruje gradient na toolbar i pozad\xED a slad\xED akcent, text i celou plochou paletu. Stejn\xFD algoritmus jako "Upravit motiv" v Zenu.': 'Pick 1\u20133 colours and an opacity \u2014 Aurora builds a gradient for the toolbar and background and matches the accent, text and the whole flat palette. Same algorithm as "Edit theme" in Zen.',
    "Barvy motivu (1\u20133)": "Theme colours (1\u20133)",
    "Upravit barvu": "Edit colour",
    "Odebrat barvu": "Remove colour",
    "P\u0159idat barvu": "Add colour",
    "Pr\u016Fhlednost (sytost gradientu)": "Opacity (gradient strength)",
    "Re\u017Eim": "Mode",
    "\u{1F319} Tmav\xFD": "\u{1F319} Dark",
    "\u2600\uFE0F Sv\u011Btl\xFD": "\u2600\uFE0F Light",
    "N\xE1hled": "Preview",
    "Pozad\xED obsahu": "Content background",
    "Akcent": "Accent",
    "Sch\xE9ma": "Scheme",
    "Pou\u017E\xEDt": "Apply",
    "Pou\u017E\xEDt motiv zapne gradient a z\xE1rove\u0148 vygeneruje slad\u011Bnou plochou paletu (z\xE1lo\u017Eky, urlbar, sidebar\u2026). Jen ploch\xE1 paleta vypne gradient a nastav\xED jen barvy.": "Apply theme turns the gradient on and also generates a matching flat palette (tabs, urlbar, sidebar\u2026). Flat palette only turns the gradient off and sets just the colours.",
    "\u2726 Pou\u017E\xEDt motiv (gradient + paleta)": "\u2726 Apply theme (gradient + palette)",
    "Jen ploch\xE1 paleta (bez gradientu)": "Flat palette only (no gradient)",
    "\u2713 Motiv aplikov\xE1n \u2014 gradient + paleta": "\u2713 Theme applied \u2014 gradient + palette",
    "\u2713 Ploch\xE1 paleta aplikov\xE1na, gradient vypnut": "\u2713 Flat palette applied, gradient off",
    // ── Colours ──
    "Akcent & Ohrani\u010Den\xED": "Accent & Border",
    "Ohrani\u010Den\xED": "Border",
    "v\u0161echny border": "all borders",
    "Pozad\xED toolbaru": "Toolbar background",
    "Panely (nav bar \xB7 z\xE1lo\u017Ekov\xFD \xB7 menu)": "Panels (nav bar \xB7 tabs \xB7 menu)",
    "Pozad\xED panel\u016F": "Panel background",
    "Tla\u010D\xEDtka aktivn\xED": "Buttons active",
    "Tla\u010D\xEDtka hover": "Buttons hover",
    "Pozad\xED sidebaru": "Sidebar background",
    "Workspace strip (lev\xFD panel se spaces)": "Workspace strip (left spaces panel)",
    "Pozad\xED stripu": "Strip background",
    "Dot neaktivn\xED": "Dot inactive",
    "Dot aktivn\xED": "Dot active",
    "Z\xE1lo\u017Eky (.tabbrowser-tab)": "Tabs (.tabbrowser-tab)",
    "Aktivn\xED z\xE1lo\u017Eka": "Active tab",
    "Neaktivn\xED z\xE1lo\u017Eka": "Inactive tab",
    "Hover z\xE1lo\u017Eky": "Tab hover",
    "\u2715 tla\u010D\xEDtko hover": "\u2715 button hover",
    "URL li\u0161ta (#urlbar)": "URL bar (#urlbar)",
    "Ohrani\u010Den\xED idle": "Border idle",
    "Ohrani\u010Den\xED focus": "Border focus",
    "Obsah a ostatn\xED": "Content & other",
    "Pozad\xED obsahu (#browser)": "Content background (#browser)",
    "V\xFDb\u011Br textu (::selection)": "Text selection (::selection)",
    "Scrollbar (thumb)": "Scrollbar (thumb)",
    // ── Mockup (WYSIWYG colour editor) ──
    "Klikni na prvek v n\xE1hledu prohl\xED\u017Ee\u010De a uprav jeho barvy. Hrubou paletu nastav\xED\u0161 v sekci Rychl\xE9.": "Click an element in the browser preview to edit its colours. Set the rough palette in the Quick section.",
    "Gradient je aktivn\xED \u2014 pozad\xED toolbaru, sidebaru a obsahu \u0159\xEDd\xED gradient (sekce Rychl\xE9), proto na n\u011B ploch\xE9 barvy nemaj\xED vliv.": "Gradient is active \u2014 the toolbar, sidebar and content backgrounds are driven by the gradient (Quick section), so flat colours don't affect them.",
    "N\xE1hled prohl\xED\u017Ee\u010De": "Browser preview",
    "Rozlo\u017Een\xED prohl\xED\u017Ee\u010De": "Browser layout",
    "Jeden panel": "Single bar",
    "V\xEDce panel\u016F": "Multiple bars",
    "Sbalen\xFD": "Collapsed",
    "Z\xE1lo\u017Eky": "Tabs",
    "URL li\u0161ta": "URL bar",
    "Obsah": "Content",
    "Glob\xE1ln\xED": "Global",
    "Text panel\u016F": "Panel text",
    "Text z\xE1lo\u017Eek": "Tab text",
    "V\xFDb\u011Br textu": "Text selection",
    "Text URL li\u0161ty": "URL bar text",
    "Z\xE1lo\u017Eka": "Tab",
    "Polo\u017Eka": "Item",
    // ── Spaces ──
    "P\u0159ep\xED\u0161e glob\xE1ln\xED barvy jen pro vybran\xFD Space. Pr\xE1zdn\xE9 pole = glob\xE1ln\xED hodnota.": "Overrides global colours for the selected Space only. Empty field = global value.",
    // ── Background ──
    "Obr\xE1zek se zobrazuje za #browser::before. Pr\u016Fhlednost a blur panel\u016F nastav v sekci Efekty.": "The image renders behind #browser::before. Set panel opacity and blur in the Effects section.",
    "Obr\xE1zek pozad\xED (#browser::before)": "Background image (#browser::before)",
    "URL nebo cesta k souboru": "URL or file path",
    "Vybrat soubor": "Choose file",
    "https://... nebo file:///C:/...": "https://... or file:///C:/...",
    "Velikost (background-size)": "Size (background-size)",
    "Cover \u2014 vypln\xED plochu": "Cover \u2014 fill area",
    "Contain \u2014 cel\xFD viditeln\xFD": "Contain \u2014 fully visible",
    "Auto \u2014 p\u0159irozen\xE1 velikost": "Auto \u2014 natural size",
    "100% \u0161\xED\u0159ka": "100% width",
    "Pozice (background-position)": "Position (background-position)",
    "St\u0159ed": "Center",
    "Naho\u0159e": "Top",
    "Dole": "Bottom",
    "Vlevo": "Left",
    "Vpravo": "Right",
    "Rozmaz\xE1n\xED obr\xE1zku (filter: blur)": "Image blur (filter: blur)",
    "Pr\u016Fhlednost obr\xE1zku (opacity)": "Image opacity (opacity)",
    "Startovac\xED str\xE1nka": "Start page",
    "V\u017Edy otev\u0159\xEDt domovskou str\xE1nku na nov\xE9 z\xE1lo\u017Ece": "Always open homepage on new tab",
    // ── Sizing ──
    "Zapnut\xED stylov\xE1n\xED prvk\u016F": "Enable element styling",
    "Pokud prvek vypne\u0161, Aurora ho nech\xE1 v Zen v\xFDchoz\xEDm stylu.": "If you turn an element off, Aurora leaves it in Zen's default style.",
    "Sidebar (#sidebar-box)": "Sidebar (#sidebar-box)",
    "Toolbar (#navigator-toolbox, #TabsToolbar\u2026)": "Toolbar (#navigator-toolbox, #TabsToolbar\u2026)",
    "Workspace strip (#zen-appcontent-navbar)": "Workspace strip (#zen-appcontent-navbar)",
    "Popup menu (menupopup, menuitem)": "Popup menu (menupopup, menuitem)",
    "V\xFD\u0161ka z\xE1lo\u017Eky (min/max-height)": "Tab height (min/max-height)",
    "Zaoblen\xED z\xE1lo\u017Eky (border-radius)": "Tab radius (border-radius)",
    "Panely (#TabsToolbar \xB7 #nav-bar \xB7 #PersonalToolbar)": "Panels (#TabsToolbar \xB7 #nav-bar \xB7 #PersonalToolbar)",
    "V\xFD\u0161ka panel\u016F (min-height)": "Panel height (min-height)",
    "\u0160\xED\u0159ka sidebaru (min/max-width)": "Sidebar width (min/max-width)",
    "\u0160\xED\u0159ka stripu (min/max-width)": "Strip width (min/max-width)",
    "Zaoblen\xED": "Rounding",
    "Zaoblen\xED panel\u016F / URL (#urlbar, menupopup)": "Panel / URL rounding (#urlbar, menupopup)",
    "Zaoblen\xED tla\u010D\xEDtek / polo\u017Eek menu": "Button / menu item rounding",
    "Tlou\u0161\u0165ka (border-width \u2014 v\u0161e)": "Thickness (border-width \u2014 all)",
    "Rozvr\u017Een\xED toolbaru": "Toolbar layout",
    "Re\u017Eim toolbaru": "Toolbar mode",
    "V\xEDce panel\u016F (v\xFDchoz\xED)": "Multiple bars (default)",
    "Jeden panel (bez z\xE1lo\u017Ekov\xE9 li\u0161ty)": "Single bar (no tab strip)",
    "Sbalen\xFD (auto-hide)": "Collapsed (auto-hide)",
    "Hitbox horn\xED li\u0161ty (p\u0159i auto-hide)": "Top bar hitbox (when auto-hidden)",
    "Zv\u011Bt\u0161\xED neviditelnou oblast naho\u0159e, kter\xE1 aktivuje vysunut\xED li\u0161ty.": "Enlarges the invisible zone at the top that triggers the bar to slide out.",
    "V\xFD\u0161ka hitboxu": "Hitbox height",
    // ── Effects ──
    "Pr\u016Fhlednost panel\u016F": "Panel transparency",
    "Ovliv\u0148uje #navigator-toolbox, #sidebar-box, #zen-appcontent-navbar, menupopup. Blur = frosted glass.": "Affects #navigator-toolbox, #sidebar-box, #zen-appcontent-navbar, menupopup. Blur = frosted glass.",
    "Pr\u016Fhlednost panel\u016F (rgba alpha)": "Panel opacity (rgba alpha)",
    "Blur panel\u016F (backdrop-filter)": "Panel blur (backdrop-filter)",
    "Odstran\xED mezery a zaoblen\xED okolo obsahu prohl\xED\u017Ee\u010De. Portov\xE1no z github.com/Comp-Tech-Guy/No-Gaps v2.5.2.": "Removes gaps and rounding around the browser content. Ported from github.com/Comp-Tech-Guy/No-Gaps v2.5.2.",
    "Zapnout No Gap Mod": "Enable No Gap Mod",
    "M\xF3d aplikace": "Apply mode",
    "Oba (compact + non-compact) \u2014 v\xFDchoz\xED": "Both (compact + non-compact) \u2014 default",
    "Pouze kompaktn\xED m\xF3d": "Compact mode only",
    "Odstranit zv\xFDrazn\u011Bn\xED split z\xE1lo\u017Eek (outline: none)": "Remove split tab highlight (outline: none)",
    "Odstranit box-shadow kontejneru obsahu": "Remove content container box-shadow",
    "Barva pozad\xED tabpanels": "Tabpanels background colour",
    "St\xEDny a z\xE1\u0159e": "Shadows & glow",
    "St\xEDn aktivn\xED z\xE1lo\u017Eky (.tabbrowser-tab[selected])": "Active tab shadow (.tabbrowser-tab[selected])",
    "Z\xE1\u0159e akcentu p\u0159i hoveru a aktivn\xED z\xE1lo\u017Ece (glow)": "Accent glow on hover & active tab",
    "Styl ohrani\u010Den\xED (border-style \u2014 v\u0161e)": "Border style (border-style \u2014 all)",
    "Styl": "Style",
    "Pln\xE9 (solid)": "Solid",
    "Te\u010Dky (dotted)": "Dotted",
    "P\u0159eru\u0161ovan\xE9 (dashed)": "Dashed",
    "\u017D\xE1dn\xE9 (none)": "None",
    "Animace (CSS transitions \u2014 v\u0161e)": "Animation (CSS transitions \u2014 all)",
    "Rychlost (transition-duration)": "Speed (transition-duration)",
    "Vypnut\xE9 \u2014 \u017E\xE1dn\xE9 (0s)": "Off \u2014 none (0s)",
    "Pomal\xE9 (0.45s)": "Slow (0.45s)",
    "Norm\xE1ln\xED (0.18s)": "Normal (0.18s)",
    "Rychl\xE9 (0.08s)": "Fast (0.08s)",
    "K\u0159ivka (transition-timing-function)": "Curve (transition-timing-function)",
    "Material ease (v\xFDchoz\xED)": "Material ease (default)",
    "Spring (p\u0159ekmit)": "Spring (overshoot)",
    // ── Font & Text ──
    "P\xEDsmo (z\xE1lo\u017Eky, panely, URL li\u0161ta)": "Font (tabs, panels, URL bar)",
    "Rodina (font-family)": "Family (font-family)",
    "Velikost (font-size)": "Size (font-size)",
    "Tu\u010Dnost (font-weight)": "Weight (font-weight)",
    "300 \u2014 tenk\xE9": "300 \u2014 thin",
    "400 \u2014 norm\xE1ln\xED": "400 \u2014 normal",
    "500 \u2014 st\u0159edn\xED": "500 \u2014 medium",
    "600 \u2014 semibold": "600 \u2014 semibold",
    "700 \u2014 tu\u010Dn\xE9": "700 \u2014 bold",
    "Barvy textu": "Text colours",
    "Text panel\u016F (toolbar, sidebar, menu)": "Panel text (toolbar, sidebar, menu)",
    "Text z\xE1lo\u017Eek (.tab-label)": "Tab text (.tab-label)",
    "Text URL li\u0161ty (#urlbar-input)": "URL bar text (#urlbar-input)",
    "Individu\xE1ln\xED barvy textu (z\xE1lo\u017Eky a urlbar maj\xED vlastn\xED barvu, jinak se kop\xEDruje barva panel\u016F)": "Individual text colours (tabs and urlbar use their own colour, otherwise the panel colour is copied)",
    // ── Accessibility ──
    "Barevn\xE9 sch\xE9ma obsahu (prefers-color-scheme)": "Content colour scheme (prefers-color-scheme)",
    "Nastav\xED jak webov\xE9 str\xE1nky vid\xED v\xE1\u0161 preferovan\xFD barevn\xFD motiv. Ovliv\u0148uje weby kter\xE9 reaguj\xED na dark/light mode.": "Sets the preferred colour theme web pages see. Affects sites that respond to dark/light mode.",
    "Sch\xE9ma obsahu": "Content scheme",
    "Dle syst\xE9mu (auto)": "System (auto)",
    "Tmav\xFD (dark)": "Dark",
    "Sv\u011Btl\xFD (light)": "Light",
    "Vysok\xFD kontrast prohl\xED\u017Ee\u010De": "Browser high contrast",
    "Kontrast": "Contrast",
    "Vypnuto": "Off",
    "Vysok\xFD kontrast tmav\xFD": "High contrast dark",
    "Vysok\xFD kontrast sv\u011Btl\xFD": "High contrast light",
    "Simulace barvosleposti": "Colour-blindness simulation",
    "Aplikuje CSS filtr na cel\xFD prohl\xED\u017Ee\u010D. Pom\xE1h\xE1 p\u0159i n\xE1vrhu p\u0159\xEDstupn\xE9ho UI nebo pro u\u017Eivatele s vadou barvocitu.": "Applies a CSS filter to the whole browser. Helps when designing accessible UI or for users with colour-vision deficiency.",
    "Typ barvosleposti": "Colour-blindness type",
    "Protanopie (nedostatek \u010Derven\xE9)": "Protanopia (red deficiency)",
    "Deuteranopie (nedostatek zelen\xE9)": "Deuteranopia (green deficiency)",
    "Tritanopie (nedostatek modr\xE9)": "Tritanopia (blue deficiency)",
    "Achromatopsie (bez barev)": "Achromatopsia (no colour)",
    // ── Presets ──
    "Ulo\u017Een\xE9 profily": "Saved profiles",
    "\u017D\xE1dn\xE9 ulo\u017Een\xE9 profily.": "No saved profiles.",
    "Na\u010D\xEDst": "Load",
    "P\u0159ejmenovat": "Rename",
    "\u2191 P\u0159epsat": "\u2191 Overwrite",
    "Profil na\u010Dten": "Profile loaded",
    "P\u0159ejmenov\xE1no": "Renamed",
    "Profil p\u0159eps\xE1n": "Profile overwritten",
    "Ulo\u017Eit aktu\xE1ln\xED nastaven\xED": "Save current settings",
    "N\xE1zev profilu": "Profile name",
    "Ulo\u017Eit": "Save",
    "Maximum 20 profil\u016F dosa\u017Eeno": "Maximum 20 profiles reached",
    "Profil ulo\u017Een": "Profile saved",
    "Export / Import (.txt)": "Export / Import (.txt)",
    "\u{1F4BE} Export": "\u{1F4BE} Export",
    "\u{1F4C2} Import": "\u{1F4C2} Import",
    "Soubor sta\u017Een": "File downloaded",
    // ── About ──
    "Kompletn\xED UI overhaul pro Zen Browser \xB7 v0.2.0 \xB7 Rockynio-dot": "Complete UI overhaul for Zen Browser \xB7 v0.2.0 \xB7 Rockynio-dot",
    "Reset barev": "Reset colours",
    "\u27F3  Reset barev na Aurora v\xFDchoz\xED (fialov\xFD dark)": "\u27F3  Reset colours to Aurora default (purple dark)",
    "Opravdu resetovat v\u0161echny barvy na Aurora v\xFDchoz\xED?": "Really reset all colours to Aurora default?",
    "Barvy resetov\xE1ny": "Colours reset",
    "Reset ve\u0161ker\xFDch nastaven\xED": "Reset all settings",
    "\u27F3  Reset VE\u0160KER\xDDCH nastaven\xED Aurora": "\u27F3  Reset ALL Aurora settings",
    "Opravdu resetovat ve\u0161ker\xE1 nastaven\xED Aurora?": "Really reset all Aurora settings?",
    "Ve\u0161ker\xE1 nastaven\xED resetov\xE1na": "All settings reset"
  };
  function tr(s) {
    if (getLang() === "cs") return s;
    return EN[s.trim()] ?? s;
  }
  function translateTree(root) {
    if (getLang() === "cs") return;
    const doc = root.ownerDocument ?? document;
    const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const texts = [];
    let n;
    while (n = walker.nextNode()) texts.push(n);
    for (const t of texts) {
      const key = (t.data ?? "").trim();
      if (!key) continue;
      const en = EN[key];
      if (en && en !== t.data) t.data = t.data.replace(key, en);
    }
    const els = root.querySelectorAll?.("[placeholder],[title]") ?? [];
    els.forEach((el) => {
      const ph = el.getAttribute("placeholder");
      if (ph && EN[ph.trim()]) el.setAttribute("placeholder", EN[ph.trim()]);
      const ti = el.getAttribute("title");
      if (ti && EN[ti.trim()]) el.setAttribute("title", EN[ti.trim()]);
    });
  }

  // src/ui/settingsPage.ts
  var CSS = `
*, *::before, *::after { box-sizing: border-box; }
body {
  /* Dark theme (default) \u2014 black gradient */
  --ao-bg: linear-gradient(160deg, #0b0b1c 0%, #07070f 55%, #000000 100%);
  --ao-nav-bg: #08080f;
  --ao-header-bg: #0b0b18;
  --ao-panel: #0d0d22;
  --ao-panel-2: #141432;
  --ao-border: #2d2d5c;
  --ao-border-soft: #1c1c40;
  --ao-row-sep: #16163a;
  --ao-text: #e0e0ff;
  --ao-text-dim: #b0b0d0;
  --ao-text-muted: #6660aa;
  --ao-text-faint: #5550aa;
  --ao-heading: #4a4a8a;
  --ao-accent: #7c6af7;
  --ao-accent-2: #9080ff;
  --ao-accent-soft: #a89bff;
  --ao-on-accent: #ffffff;
  --ao-badge-bg: #141430;
  --ao-badge-border: #252550;

  margin: 0; padding: 0; display: flex; height: 100vh; overflow: hidden;
  font-family: system-ui, -apple-system, sans-serif; font-size: 13px;
  color: var(--ao-text); background: var(--ao-bg); background-attachment: fixed;
}
body.ao-light {
  /* Light theme \u2014 white gradient */
  --ao-bg: linear-gradient(160deg, #ffffff 0%, #eef0f8 60%, #e3e6f2 100%);
  --ao-nav-bg: #eef0f8;
  --ao-header-bg: #f4f5fb;
  --ao-panel: #ffffff;
  --ao-panel-2: #f3f4fb;
  --ao-border: #cbcfe4;
  --ao-border-soft: #e2e5f1;
  --ao-row-sep: #e8eaf3;
  --ao-text: #16162e;
  --ao-text-dim: #34344f;
  --ao-text-muted: #6a6a92;
  --ao-text-faint: #8888aa;
  --ao-heading: #9a9ac0;
  --ao-accent: #6a58e0;
  --ao-accent-2: #5a48d0;
  --ao-accent-soft: #5a48c0;
  --ao-on-accent: #ffffff;
  --ao-badge-bg: #eceefa;
  --ao-badge-border: #d6daee;
}
.ao-nav {
  width: 180px; flex-shrink: 0; background: var(--ao-nav-bg);
  border-right: 1px solid var(--ao-border-soft); display: flex; flex-direction: column;
  padding: 16px 0 8px; overflow-y: auto;
}
.ao-nav-logo {
  padding: 0 16px 16px; font-size: 16px; font-weight: 800; color: var(--ao-accent-soft);
  border-bottom: 1px solid var(--ao-border-soft); margin-bottom: 8px;
}
.ao-nav-item {
  display: flex; align-items: center; gap: 10px; padding: 9px 16px;
  cursor: pointer; color: var(--ao-text-muted); border-left: 2px solid transparent;
  transition: color .1s, background .1s, border-color .1s;
  user-select: none; font-size: 12.5px;
}
.ao-nav-item:hover { color: var(--ao-text); background: color-mix(in srgb, var(--ao-accent) 12%, transparent); }
.ao-nav-item.active { color: var(--ao-text); background: color-mix(in srgb, var(--ao-accent) 16%, transparent); border-left-color: var(--ao-accent); font-weight: 600; }
.ao-nav-icon { font-size: 15px; width: 18px; text-align: center; }
.ao-nav-sep { height: 1px; background: var(--ao-border-soft); margin: 8px 16px; }
.ao-nav-btn {
  padding: 7px 10px; border: 1px solid var(--ao-border); border-radius: 8px;
  background: var(--ao-panel); color: var(--ao-text-dim); font-size: 11px; cursor: pointer;
  font-family: inherit; transition: background .1s, color .1s, border-color .1s;
  display: flex; align-items: center; gap: 6px; text-align: left;
}
.ao-nav-btn:hover { background: var(--ao-panel-2); color: var(--ao-text); border-color: var(--ao-accent); }
.ao-nav-btn.danger { border-color: #6a2a2a; color: #c06060; }
.ao-nav-btn.danger:hover { background: color-mix(in srgb, #c04040 18%, transparent); border-color: #c04040; color: #ff8080; }
.ao-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.ao-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 24px; border-bottom: 1px solid var(--ao-border-soft); background: var(--ao-header-bg); flex-shrink: 0; gap: 12px;
}
.ao-header-title { font-size: 15px; font-weight: 700; color: var(--ao-accent-soft); display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.ao-header-sub { font-size: 11px; color: var(--ao-text-faint); font-weight: 400; margin-left: 4px; }
.ao-head-ctrls { display: flex; align-items: center; gap: 14px; margin-left: auto; flex-wrap: wrap; }
.ao-head-group { display: flex; align-items: center; gap: 6px; }
.ao-head-group-lbl { font-size: 10px; text-transform: uppercase; letter-spacing: .8px; color: var(--ao-text-faint); }
.ao-head-swatch { width: 24px; height: 24px; border-radius: 7px; border: 2px solid var(--ao-border); cursor: pointer; transition: border-color .12s, transform .12s; }
.ao-head-swatch:hover { border-color: var(--ao-accent); transform: scale(1.08); }
.ao-header-close {
  background: var(--ao-panel); border: 1px solid var(--ao-border); border-radius: 8px;
  color: var(--ao-text-dim); font-size: 13px; cursor: pointer; padding: 5px 12px;
  font-family: inherit; transition: background .1s, color .1s;
}
.ao-header-close:hover { background: var(--ao-panel-2); color: var(--ao-text); }
.ao-content { flex: 1; overflow-y: auto; padding: 24px; }
.ao-content::-webkit-scrollbar { width: 4px; }
.ao-content::-webkit-scrollbar-thumb { background: var(--ao-border); border-radius: 4px; }
.ao-section { display: none; }
.ao-section.active { display: block; }

/* Controls */
.aoc-section-heading {
  font-size: 10px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase;
  color: var(--ao-heading); padding: 16px 0 8px; margin-top: 8px;
}
.aoc-section-heading:first-child { padding-top: 0; margin-top: 0; }
.aoc-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 0; border-bottom: 1px solid var(--ao-row-sep); gap: 12px; min-height: 40px;
}
.aoc-row:last-child { border-bottom: none; }
.aoc-row-select { flex-wrap: wrap; }
.aoc-label { color: var(--ao-text-dim); font-size: 12.5px; flex: 1; min-width: 140px; }
.aoc-color-swatch {
  width: 28px; height: 28px; border-radius: 7px; border: 2px solid var(--ao-border);
  cursor: pointer; flex-shrink: 0; transition: border-color .12s, transform .12s;
}
.aoc-color-swatch:hover { border-color: var(--ao-accent); transform: scale(1.08); }
.aoc-color-hex {
  width: 74px; background: var(--ao-panel); border: 1px solid var(--ao-border); border-radius: 6px;
  color: var(--ao-accent-soft); font-size: 11px; font-family: monospace;
  padding: 5px 6px; text-align: center; flex-shrink: 0;
}
.aoc-color-hex:focus { outline: 1px solid var(--ao-accent); border-color: var(--ao-accent); }
.aoc-toggle {
  width: 36px; height: 20px; border-radius: 10px; background: var(--ao-border);
  flex-shrink: 0; position: relative; cursor: pointer; transition: background .15s; outline: none;
}
.aoc-toggle.on { background: var(--ao-accent); }
.aoc-thumb { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 8px; background: #fff; transition: left .15s; }
.aoc-toggle.on .aoc-thumb { left: 18px; }
.aoc-row-slider { flex-direction: column; align-items: stretch; gap: 4px; }
.aoc-slider-header { display: flex; justify-content: space-between; align-items: center; }
.aoc-slider-val { color: var(--ao-accent); font-size: 12px; font-family: monospace; }
.aoc-slider { width: 100%; height: 4px; cursor: pointer; -webkit-appearance: none; appearance: none; background: var(--ao-border); border-radius: 2px; }
.aoc-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: var(--ao-accent); cursor: pointer; box-shadow: 0 0 0 2px var(--ao-panel); }
.aoc-input { background: var(--ao-panel); border: 1px solid var(--ao-border); border-radius: 6px; color: var(--ao-text); font-size: 12px; font-family: inherit; padding: 5px 8px; flex: 1; min-width: 0; }
.aoc-input:focus { outline: 1px solid var(--ao-accent); border-color: var(--ao-accent); }

/* Segmented control (replaces native <select>) */
.aoc-seg { display: inline-flex; flex-wrap: wrap; gap: 4px; justify-content: flex-end; }
.aoc-seg-btn {
  padding: 5px 11px; border: 1px solid var(--ao-border); border-radius: 7px;
  background: var(--ao-panel); color: var(--ao-text-muted); font-size: 12px; cursor: pointer;
  font-family: inherit; transition: background .1s, color .1s, border-color .1s;
}
.aoc-seg-btn:hover { color: var(--ao-text); border-color: var(--ao-accent); }
.aoc-seg-btn.active { background: var(--ao-accent); color: var(--ao-on-accent); border-color: var(--ao-accent); font-weight: 600; }
.aoc-seg.mini .aoc-seg-btn { padding: 4px 9px; font-size: 11px; border-radius: 6px; }

/* Quick settings */
.ao-quick-swatch-big {
  width: 64px; height: 64px; border-radius: 14px; border: 3px solid var(--ao-border);
  cursor: pointer; flex-shrink: 0; transition: border-color .12s, transform .12s;
}
.ao-quick-swatch-big:hover { border-color: var(--ao-accent); transform: scale(1.04); }
.ao-quick-preview { display: flex; gap: 6px; flex-wrap: wrap; margin: 12px 0; }
.ao-quick-preview-dot { width: 24px; height: 24px; border-radius: 6px; border: 1px solid var(--ao-border); }
.ao-apply-btn {
  padding: 10px 20px; background: var(--ao-accent); border: none; border-radius: 8px;
  color: var(--ao-on-accent); font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit;
  transition: background .1s, transform .1s;
}
.ao-apply-btn:hover { background: var(--ao-accent-2); transform: translateY(-1px); }
.ao-apply-btn:active { transform: translateY(0); }

/* Badge */
.ao-badge {
  display: inline-block; font-size: 9px; font-family: monospace;
  background: var(--ao-badge-bg); border: 1px solid var(--ao-badge-border); border-radius: 3px;
  color: var(--ao-text-faint); padding: 1px 4px; margin-left: 6px; vertical-align: middle;
}

/* Note */
.ao-note {
  font-size: 11.5px; color: var(--ao-text-faint); line-height: 1.6; padding: 8px 12px;
  background: var(--ao-panel); border: 1px solid var(--ao-border-soft); border-radius: 6px; margin-bottom: 12px;
}

/* Space tabs */
.ao-space-tabs { display: flex; gap: 4px; margin-bottom: 16px; flex-wrap: wrap; }
.ao-space-tab {
  padding: 5px 12px; border-radius: 6px; border: 1px solid var(--ao-border);
  background: var(--ao-panel); color: var(--ao-text-muted); font-size: 12px; cursor: pointer; font-family: inherit;
  transition: background .1s, color .1s, border-color .1s;
}
.ao-space-tab:hover { color: var(--ao-text); border-color: var(--ao-accent); }
.ao-space-tab.active { background: var(--ao-accent); color: var(--ao-on-accent); border-color: var(--ao-accent); }
.ao-space-content { display: none; }
.ao-space-content.active { display: block; }

/* Presets */
.ao-preset-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.ao-preset-item {
  display: flex; align-items: center; gap: 8px; padding: 10px 14px;
  background: var(--ao-panel); border: 1px solid var(--ao-border-soft); border-radius: 8px; transition: border-color .1s;
}
.ao-preset-item:hover { border-color: var(--ao-border); }
.ao-preset-swatch-row { display: flex; gap: 3px; flex-shrink: 0; }
.ao-preset-swatch { width: 14px; height: 14px; border-radius: 3px; }
.ao-preset-name-view { flex: 1; color: var(--ao-text); font-size: 12.5px; }
.ao-preset-name-edit {
  flex: 1; background: var(--ao-panel-2); border: 1px solid var(--ao-accent); border-radius: 4px;
  color: var(--ao-text); font-size: 12px; font-family: inherit; padding: 3px 7px; min-width: 0;
}
.ao-preset-time { color: var(--ao-text-faint); font-size: 11px; white-space: nowrap; }
.ao-preset-btn {
  padding: 4px 10px; border-radius: 5px; font-size: 11px;
  border: 1px solid var(--ao-border); background: var(--ao-panel-2); color: var(--ao-text-dim);
  cursor: pointer; font-family: inherit; transition: background .1s, color .1s;
}
.ao-preset-btn:hover { background: var(--ao-panel); color: var(--ao-text); }
.ao-preset-btn.load { border-color: var(--ao-accent); color: var(--ao-accent-soft); }
.ao-preset-btn.save { border-color: #3a6a3a; color: #60a060; }
.ao-preset-btn.del:hover { border-color: #c04040; color: #ff8080; }
.ao-preset-save-row { display: flex; gap: 8px; align-items: center; margin-top: 4px; }
.ao-preset-name-in {
  flex: 1; background: var(--ao-panel); border: 1px solid var(--ao-border); border-radius: 6px;
  color: var(--ao-text); font-size: 12px; font-family: inherit; padding: 7px 10px;
}
.ao-preset-name-in:focus { outline: 1px solid var(--ao-accent); border-color: var(--ao-accent); }
.ao-preset-save-btn {
  padding: 7px 16px; background: var(--ao-accent); border: none; border-radius: 6px;
  color: var(--ao-on-accent); font-size: 12px; cursor: pointer; font-family: inherit; transition: background .1s;
}
.ao-preset-save-btn:hover { background: var(--ao-accent-2); }

/* About */
.ao-about-card { padding: 16px; background: var(--ao-panel); border: 1px solid var(--ao-border-soft); border-radius: 10px; margin-bottom: 12px; }
.ao-about-title { font-size: 18px; font-weight: 700; color: var(--ao-accent-soft); margin-bottom: 4px; }
.ao-about-sub { font-size: 12px; color: var(--ao-text-faint); }

/* Status */
.ao-status { font-size: 11px; height: 16px; color: var(--ao-text-faint); padding: 2px 0; transition: color .2s; }
.ao-status.ok  { color: #4caf6a; }
.ao-status.err { color: #c06060; }

/* Interactive Zen mockup (WYSIWYG colour editor) */
.ao-mock {
  position: relative; display: flex; height: 300px; margin: 4px 0 8px;
  border: 1px solid var(--ao-border); border-radius: 12px; overflow: hidden;
  background: var(--m-browser-bg); font-size: 11px; user-select: none;
  box-shadow: 0 6px 24px #00000044;
}
.ao-mock [data-el] { outline: 2px solid transparent; outline-offset: -2px; transition: outline-color .1s; cursor: pointer; }
.ao-mock [data-el]:hover { outline-color: var(--m-accent); position: relative; z-index: 3; }
/* only highlight the innermost element under the cursor */
.ao-mock [data-el]:has([data-el]:hover) { outline-color: transparent; }
.ao-mock-strip { display: flex; align-items: center; gap: 6px; background: var(--m-strip-bg); border-radius: 6px; padding: 5px 7px; }
.ao-mock-strip.small { justify-content: center; padding: 4px; }
.ao-mock-dot { width: 13px; height: 13px; border-radius: 50%; background: var(--m-dot); flex-shrink: 0; }
.ao-mock-dot.active { background: var(--m-dot-active); }
.ao-mock-sidebar { width: 154px; flex-shrink: 0; background: var(--m-sidebar-bg); display: flex; flex-direction: column; gap: 8px; padding: 9px; }
.ao-mock-urlbar { background: var(--m-urlbar-bg); border: 1px solid var(--m-urlbar-border); border-radius: 7px; color: var(--m-urlbar-text); padding: 5px 8px; font-size: 10.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ao-mock-tabs { display: flex; flex-direction: column; gap: 4px; }
.ao-mock-tab { background: var(--m-tab-inactive); color: var(--m-tab-text); border-radius: 6px; padding: 5px 8px; display: flex; align-items: center; justify-content: space-between; gap: 6px; }
.ao-mock-tab.active { background: var(--m-tab-active); }
.ao-mock-tab:not(.active):hover { background: var(--m-tab-hover); }
.ao-mock-tab .x { opacity: .55; font-size: 10px; }
.ao-mock-tab .x:hover { color: var(--m-close); opacity: 1; }
.ao-mock.has-topbar { flex-direction: column; }
.ao-mock-topbar { background: var(--m-toolbar-bg); padding: 7px 9px; display: flex; gap: 7px; align-items: center; }
.ao-mock-topbar .ao-mock-urlbar { flex: 1; }
.ao-mock-body { flex: 1; display: flex; min-height: 0; }
.ao-mock-tbrow { display: flex; gap: 6px; background: var(--m-toolbar-bg); padding: 5px 6px; border-radius: 6px; }
.ao-mock-sidebar.collapsed { width: 36px; padding: 9px 5px; }
.ao-mock-sidebar.collapsed .ao-mock-tab { height: 16px; padding: 0; }
.ao-mock-btn { width: 22px; height: 22px; border-radius: 6px; background: var(--m-btn-bg); flex-shrink: 0; }
.ao-mock-btn:hover { background: var(--m-btn-hover); }
.ao-mock-content { flex: 1; background: var(--m-browser-bg); color: var(--m-panel-text); padding: 14px; position: relative; overflow: hidden; line-height: 1.5; }
.ao-mock-sel { background: var(--m-selection); border-radius: 2px; padding: 0 2px; }
.ao-mock-menu { position: absolute; top: 26px; right: 22px; width: 116px; background: var(--m-panel-bg); border: 1px solid var(--m-border); border-radius: 8px; padding: 4px; color: var(--m-panel-text); }
.ao-mock-menu .mi { padding: 4px 7px; border-radius: 4px; font-size: 10.5px; }
.ao-mock-menu .mi:hover { background: var(--m-btn-hover); }
.ao-mock-scroll { position: absolute; right: 3px; top: 10px; bottom: 10px; width: 5px; border-radius: 3px; background: var(--m-scrollbar); }
.ao-mock-extra { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
.ao-mock-chip { padding: 5px 11px; border: 1px solid var(--ao-border); border-radius: 7px; background: var(--ao-panel); color: var(--ao-text-dim); font-size: 12px; cursor: pointer; font-family: inherit; transition: background .1s, color .1s, border-color .1s; }
.ao-mock-chip:hover { color: var(--ao-text); border-color: var(--ao-accent); }

/* Mockup element inspector popover */
.ao-mock-pop {
  position: fixed; z-index: 50; width: 234px; background: var(--ao-panel);
  border: 1px solid var(--ao-border); border-radius: 10px; box-shadow: 0 10px 34px #00000077;
  padding: 10px;
}
.ao-mock-pop-h { font-size: 12.5px; font-weight: 700; color: var(--ao-text); margin-bottom: 8px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.ao-mock-pop-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 5px 0; border-bottom: 1px solid var(--ao-row-sep); }
.ao-mock-pop-row:last-child { border-bottom: none; }
.ao-mock-pop-row > span { color: var(--ao-text-dim); font-size: 12px; }
`;
  var invalidateSections = null;
  function status(el, msg, cls) {
    el.textContent = tr(msg);
    el.className = `ao-status ${cls}`;
    if (cls) setTimeout(() => {
      el.textContent = "";
      el.className = "ao-status";
    }, 2400);
  }
  function note(doc, text) {
    const n = doc.createElement("div");
    n.className = "ao-note";
    n.textContent = text;
    return n;
  }
  function badge(doc, text) {
    const b = doc.createElement("span");
    b.className = "ao-badge";
    b.textContent = text;
    return b;
  }
  function colorRow(doc, container, label, pref, def, st, cssTarget) {
    const row2 = doc.createElement("div");
    row2.className = "aoc-row";
    const lbl = doc.createElement("span");
    lbl.className = "aoc-label";
    lbl.textContent = label;
    if (cssTarget) lbl.appendChild(badge(doc, cssTarget));
    const cur = getPref(pref, def);
    const sw = doc.createElement("div");
    sw.className = "aoc-color-swatch";
    sw.style.background = cur || def || "#555";
    const hex = doc.createElement("input");
    hex.type = "text";
    hex.className = "aoc-color-hex";
    hex.value = cur || def;
    hex.maxLength = 9;
    const sync = (v) => {
      sw.style.background = v;
      hex.value = v;
      setPref(pref, v);
      status(st, "\u2713", "ok");
    };
    sw.addEventListener("click", (e) => {
      e.stopPropagation();
      openColorPicker(sw, hex.value || def, sync);
    });
    hex.addEventListener("change", () => {
      const v = hex.value.trim();
      sync(v.startsWith("#") ? v : `#${v}`);
    });
    row2.appendChild(lbl);
    row2.appendChild(sw);
    row2.appendChild(hex);
    container.appendChild(row2);
  }
  function hexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  }
  function hslHex(h, s, l) {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => {
      const k = (n + h / 30) % 12, c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * c).toString(16).padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }
  function generateDarkPalette(accent) {
    const [h, s] = hexToHsl(accent);
    const sat = Math.min(s, 40);
    return {
      colors: {
        "mod.aurora.color.accent": accent,
        "mod.aurora.color.urlbar_focus": accent,
        "mod.aurora.color.workspace_dot_active": accent,
        "mod.aurora.color.browser_bg": hslHex(h, Math.min(sat, 20), 7),
        "mod.aurora.color.workspace_strip_bg": hslHex(h, Math.min(sat, 25), 8),
        "mod.aurora.color.toolbar_bg": hslHex(h, Math.min(sat, 28), 10),
        "mod.aurora.color.sidebar_bg": hslHex(h, Math.min(sat, 28), 9),
        "mod.aurora.color.panel_bg": hslHex(h, Math.min(sat, 28), 12),
        "mod.aurora.color.tab_inactive_bg": hslHex(h, Math.min(sat, 26), 12),
        "mod.aurora.color.urlbar_bg": hslHex(h, Math.min(sat, 30), 14),
        "mod.aurora.color.tab_active_bg": hslHex(h, Math.min(sat, 42), 19),
        "mod.aurora.color.tab_hover_bg": hslHex(h, Math.min(sat, 35), 16),
        "mod.aurora.color.button_bg": hslHex(h, Math.min(sat, 42), 18),
        "mod.aurora.color.button_hover": hslHex(h, Math.min(sat, 38), 22),
        "mod.aurora.color.border": hslHex(h, Math.min(sat, 42), 24),
        "mod.aurora.color.urlbar_border": hslHex(h, Math.min(sat, 42), 26),
        "mod.aurora.color.workspace_dot": hslHex(h, Math.min(sat, 38), 26),
        "mod.aurora.color.scrollbar": hslHex(h, Math.min(sat, 38), 28),
        "mod.aurora.color.selection_bg": accent + "40",
        "mod.aurora.color.panel_text": hslHex(h, 20, 90),
        "mod.aurora.color.tab_text": hslHex(h, 15, 82),
        "mod.aurora.color.urlbar_text": hslHex(h, 20, 90),
        "mod.aurora.color.tab_close_hover": "#ff6b6b"
      },
      strings: {
        "mod.aurora.effect.panel_opacity": "1.0",
        "mod.aurora.effect.panel_blur": "0px",
        "mod.aurora.effect.panel_border_style": "solid",
        "mod.aurora.animation_speed": "normal",
        "mod.aurora.animation.easing": "ease",
        "mod.aurora.layout.toolbar_mode": "multi",
        "mod.aurora.layout.no_gap_bg": hslHex(h, Math.min(sat, 20), 4)
      },
      booleans: {
        // NOTE: No Gap mod prefs are intentionally NOT set here — applying a
        // colour palette must not toggle a structural feature the user controls.
        "mod.aurora.effect.tab_shadow": false,
        "mod.aurora.effect.accent_glow": false,
        "mod.aurora.style.tabs": true,
        "mod.aurora.style.urlbar": true,
        "mod.aurora.style.sidebar": true,
        "mod.aurora.style.toolbar": true,
        "mod.aurora.style.workspace_strip": true,
        "mod.aurora.style.menus": true,
        "mod.aurora.style.individual_text_colors": false
      }
    };
  }
  function generateLightPalette(accent) {
    const [h, s] = hexToHsl(accent);
    const sat = Math.min(s, 45);
    return {
      colors: {
        "mod.aurora.color.accent": accent,
        "mod.aurora.color.urlbar_focus": accent,
        "mod.aurora.color.workspace_dot_active": accent,
        // Backgrounds — výrazně tmavší než dříve pro viditelný gradient
        "mod.aurora.color.browser_bg": hslHex(h, Math.min(sat, 16), 82),
        "mod.aurora.color.workspace_strip_bg": hslHex(h, Math.min(sat, 32), 62),
        "mod.aurora.color.toolbar_bg": hslHex(h, Math.min(sat, 28), 72),
        "mod.aurora.color.sidebar_bg": hslHex(h, Math.min(sat, 28), 68),
        "mod.aurora.color.panel_bg": hslHex(h, Math.min(sat, 22), 76),
        "mod.aurora.color.tab_inactive_bg": hslHex(h, Math.min(sat, 30), 64),
        "mod.aurora.color.urlbar_bg": hslHex(h, Math.min(sat, 14), 80),
        "mod.aurora.color.tab_active_bg": hslHex(h, Math.min(sat, 40), 52),
        "mod.aurora.color.tab_hover_bg": hslHex(h, Math.min(sat, 34), 58),
        "mod.aurora.color.button_bg": hslHex(h, Math.min(sat, 38), 52),
        "mod.aurora.color.button_hover": hslHex(h, Math.min(sat, 30), 44),
        "mod.aurora.color.border": hslHex(h, Math.min(sat, 36), 40),
        "mod.aurora.color.urlbar_border": hslHex(h, Math.min(sat, 32), 36),
        "mod.aurora.color.workspace_dot": hslHex(h, Math.min(sat, 42), 34),
        "mod.aurora.color.scrollbar": hslHex(h, Math.min(sat, 28), 42),
        "mod.aurora.color.selection_bg": accent + "35",
        "mod.aurora.color.panel_text": hslHex(h, 12, 6),
        "mod.aurora.color.tab_text": hslHex(h, 9, 10),
        "mod.aurora.color.urlbar_text": hslHex(h, 12, 6),
        "mod.aurora.color.tab_close_hover": "#cc2222"
      },
      strings: {
        "mod.aurora.effect.panel_opacity": "1.0",
        "mod.aurora.effect.panel_blur": "0px",
        "mod.aurora.effect.panel_border_style": "solid",
        "mod.aurora.animation_speed": "normal",
        "mod.aurora.animation.easing": "ease",
        "mod.aurora.layout.toolbar_mode": "multi",
        "mod.aurora.layout.no_gap_bg": hslHex(h, Math.min(sat, 16), 60)
      },
      booleans: {
        // NOTE: No Gap mod prefs are intentionally NOT set here — applying a
        // colour palette must not toggle a structural feature the user controls.
        "mod.aurora.effect.tab_shadow": false,
        "mod.aurora.effect.accent_glow": false,
        "mod.aurora.style.tabs": true,
        "mod.aurora.style.urlbar": true,
        "mod.aurora.style.sidebar": true,
        "mod.aurora.style.toolbar": true,
        "mod.aurora.style.workspace_strip": true,
        "mod.aurora.style.menus": true,
        "mod.aurora.style.individual_text_colors": false
      }
    };
  }
  function applyPalette(data) {
    for (const [k, v] of Object.entries(data.colors)) {
      try {
        Services.prefs.setStringPref(k, v);
      } catch {
      }
    }
    for (const [k, v] of Object.entries(data.strings)) {
      try {
        Services.prefs.setStringPref(k, v);
      } catch {
      }
    }
    for (const [k, v] of Object.entries(data.booleans)) {
      try {
        Services.prefs.setBoolPref(k, v);
      } catch {
      }
    }
  }
  function buildQuick(doc, el, st) {
    el.appendChild(note(doc, 'Vyberte 1\u20133 barvy a pr\u016Fhlednost \u2014 Aurora vygeneruje gradient na toolbar i pozad\xED a slad\xED akcent, text i celou plochou paletu. Stejn\xFD algoritmus jako "Upravit motiv" v Zenu.'));
    let colors = getPref("mod.aurora.gradient.colors", "#7c6af7").split(",").map((c) => c.trim()).filter(Boolean).slice(0, 3);
    if (!colors.length) colors = ["#7c6af7"];
    let dark = getBoolPref("mod.aurora.gradient.dark", true);
    buildSectionHeading(doc, el, "Barvy motivu (1\u20133)");
    const dotsRow = doc.createElement("div");
    dotsRow.style.cssText = "display:flex;gap:12px;align-items:center;flex-wrap:wrap;padding:8px 0;";
    el.appendChild(dotsRow);
    function renderDots() {
      dotsRow.innerHTML = "";
      colors.forEach((c, i) => {
        const wrap = doc.createElement("div");
        wrap.style.cssText = "position:relative;";
        const sw = doc.createElement("div");
        sw.className = "ao-quick-swatch-big";
        sw.style.background = c;
        sw.title = "Upravit barvu";
        sw.addEventListener("click", (e) => {
          e.stopPropagation();
          openColorPicker(sw, colors[i], (v) => {
            colors[i] = v;
            sw.style.background = v;
            updatePreview();
          });
        });
        wrap.appendChild(sw);
        if (colors.length > 1) {
          const rm = doc.createElement("button");
          rm.textContent = "\u2715";
          rm.style.cssText = "position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:9px;border:none;background:#c04040;color:#fff;font-size:10px;cursor:pointer;line-height:1;";
          rm.title = "Odebrat barvu";
          rm.addEventListener("click", () => {
            colors.splice(i, 1);
            renderDots();
            updatePreview();
          });
          wrap.appendChild(rm);
        }
        dotsRow.appendChild(wrap);
      });
      if (colors.length < 3) {
        const add = doc.createElement("button");
        add.textContent = "\uFF0B";
        add.style.cssText = "width:64px;height:64px;border-radius:14px;border:2px dashed #3a3a6c;background:transparent;color:#6660aa;font-size:26px;cursor:pointer;";
        add.title = "P\u0159idat barvu";
        add.addEventListener("click", () => {
          colors.push(colors[colors.length - 1] ?? "#7c6af7");
          renderDots();
          updatePreview();
        });
        dotsRow.appendChild(add);
      }
    }
    const ctrlRow = doc.createElement("div");
    ctrlRow.style.cssText = "display:flex;gap:20px;align-items:center;flex-wrap:wrap;padding:4px 0 8px;";
    const opWrap = doc.createElement("div");
    opWrap.style.cssText = "flex:1;min-width:200px;";
    const opHead = doc.createElement("div");
    opHead.style.cssText = "display:flex;justify-content:space-between;font-size:12px;color:#b0b0d0;margin-bottom:4px;";
    const opLbl = doc.createElement("span");
    opLbl.textContent = "Pr\u016Fhlednost (sytost gradientu)";
    const opVal = doc.createElement("span");
    opVal.className = "aoc-slider-val";
    opHead.appendChild(opLbl);
    opHead.appendChild(opVal);
    const opSlider = doc.createElement("input");
    opSlider.type = "range";
    opSlider.min = "0.1";
    opSlider.max = "1";
    opSlider.step = "0.05";
    opSlider.className = "aoc-slider";
    opSlider.value = getPref("mod.aurora.gradient.opacity", "0.5");
    opVal.textContent = opSlider.value;
    opSlider.addEventListener("input", () => {
      opVal.textContent = opSlider.value;
      updatePreview();
    });
    opWrap.appendChild(opHead);
    opWrap.appendChild(opSlider);
    const modeWrap = doc.createElement("div");
    modeWrap.style.cssText = "display:flex;align-items:center;gap:8px;";
    const modeLbl = doc.createElement("span");
    modeLbl.style.cssText = "font-size:12px;color:var(--ao-text-dim);";
    modeLbl.textContent = "Re\u017Eim";
    const modeSeg = doc.createElement("div");
    modeSeg.className = "aoc-seg";
    const modeBtns = [];
    for (const [val, lbl] of [["dark", "\u{1F319} Tmav\xFD"], ["light", "\u2600\uFE0F Sv\u011Btl\xFD"]]) {
      const b = doc.createElement("button");
      b.type = "button";
      b.className = "aoc-seg-btn" + (val === "dark" === dark ? " active" : "");
      b.textContent = lbl;
      b.dataset.value = val;
      b.addEventListener("click", () => {
        dark = val === "dark";
        for (const o of modeBtns) o.classList.toggle("active", o === b);
        updatePreview();
      });
      modeSeg.appendChild(b);
      modeBtns.push(b);
    }
    modeWrap.appendChild(modeLbl);
    modeWrap.appendChild(modeSeg);
    ctrlRow.appendChild(opWrap);
    ctrlRow.appendChild(modeWrap);
    el.appendChild(ctrlRow);
    buildSectionHeading(doc, el, "N\xE1hled");
    const previewCard = doc.createElement("div");
    previewCard.style.cssText = "border:1px solid #1e1e44;border-radius:10px;overflow:hidden;margin-bottom:8px;";
    const pvToolbar = doc.createElement("div");
    pvToolbar.style.cssText = "height:40px;display:flex;align-items:center;padding:0 12px;font-size:12px;font-weight:600;";
    const pvToolbarTxt = doc.createElement("span");
    pvToolbarTxt.textContent = "Toolbar";
    pvToolbar.appendChild(pvToolbarTxt);
    const pvContent = doc.createElement("div");
    pvContent.style.cssText = "height:90px;display:flex;align-items:center;justify-content:center;font-size:11px;color:#9090c0;";
    pvContent.textContent = "Pozad\xED obsahu";
    previewCard.appendChild(pvToolbar);
    previewCard.appendChild(pvContent);
    el.appendChild(previewCard);
    const swatchRow = doc.createElement("div");
    swatchRow.style.cssText = "display:flex;gap:16px;align-items:center;font-size:11px;color:#8880cc;margin-bottom:8px;";
    el.appendChild(swatchRow);
    function updatePreview() {
      const op = parseFloat(opSlider.value) || 0.5;
      const z = generateZenTheme(colors, op, dark);
      pvToolbar.style.background = z.toolbar;
      pvToolbar.style.color = z.textColor;
      pvContent.style.background = z.background;
      pvContent.style.backgroundColor = dark ? "#131313" : "#e9e9e9";
      swatchRow.innerHTML = "";
      const mk = (label, col) => {
        const s2 = doc.createElement("div");
        s2.style.cssText = "display:flex;align-items:center;gap:6px;";
        const c = doc.createElement("div");
        c.style.cssText = `width:20px;height:20px;border-radius:5px;border:1px solid #2d2d5c;background:${col};`;
        const t = doc.createElement("span");
        t.textContent = label;
        s2.appendChild(c);
        s2.appendChild(t);
        return s2;
      };
      swatchRow.appendChild(mk(`${tr("Akcent")} ${z.primaryColor}`, z.primaryColor));
      swatchRow.appendChild(mk(`${tr("Sch\xE9ma")}: ${z.colorScheme}`, z.colorScheme === "dark" ? "#222" : "#eee"));
    }
    renderDots();
    updatePreview();
    buildSectionHeading(doc, el, "Pou\u017E\xEDt");
    el.appendChild(note(doc, "Pou\u017E\xEDt motiv zapne gradient a z\xE1rove\u0148 vygeneruje slad\u011Bnou plochou paletu (z\xE1lo\u017Eky, urlbar, sidebar\u2026). Jen ploch\xE1 paleta vypne gradient a nastav\xED jen barvy."));
    const btnRow = doc.createElement("div");
    btnRow.style.cssText = "display:flex;gap:10px;flex-wrap:wrap;";
    const applyBtn = doc.createElement("button");
    applyBtn.className = "ao-apply-btn";
    applyBtn.textContent = "\u2726 Pou\u017E\xEDt motiv (gradient + paleta)";
    applyBtn.addEventListener("click", () => {
      const op = opSlider.value;
      setPref("mod.aurora.gradient.colors", colors.join(","));
      setPref("mod.aurora.gradient.opacity", op);
      setBoolPref("mod.aurora.gradient.dark", dark);
      setBoolPref("mod.aurora.gradient.enabled", true);
      const z = generateZenTheme(colors, parseFloat(op) || 0.5, dark);
      const seed = rgbToHex(z.dominant);
      applyPalette(dark ? generateDarkPalette(seed) : generateLightPalette(seed));
      invalidateSections?.();
      status(st, "\u2713 Motiv aplikov\xE1n \u2014 gradient + paleta", "ok");
    });
    const flatBtn = doc.createElement("button");
    flatBtn.className = "ao-nav-btn";
    flatBtn.style.cssText = "padding:10px 18px;";
    flatBtn.textContent = "Jen ploch\xE1 paleta (bez gradientu)";
    flatBtn.addEventListener("click", () => {
      setBoolPref("mod.aurora.gradient.enabled", false);
      applyPalette(dark ? generateDarkPalette(colors[0]) : generateLightPalette(colors[0]));
      invalidateSections?.();
      status(st, "\u2713 Ploch\xE1 paleta aplikov\xE1na, gradient vypnut", "ok");
    });
    btnRow.appendChild(applyBtn);
    btnRow.appendChild(flatBtn);
    el.appendChild(btnRow);
  }
  var MOCK_VARS = [
    { pref: "mod.aurora.color.browser_bg", def: "#0f0f1a", v: "--m-browser-bg" },
    { pref: "mod.aurora.color.toolbar_bg", def: "#16162a", v: "--m-toolbar-bg" },
    { pref: "mod.aurora.color.panel_bg", def: "#1a1a2e", v: "--m-panel-bg" },
    { pref: "mod.aurora.color.sidebar_bg", def: "#12122a", v: "--m-sidebar-bg" },
    { pref: "mod.aurora.color.workspace_strip_bg", def: "#0d0d1e", v: "--m-strip-bg" },
    { pref: "mod.aurora.color.workspace_dot", def: "#3a3a6c", v: "--m-dot" },
    { pref: "mod.aurora.color.workspace_dot_active", def: "#7c6af7", v: "--m-dot-active" },
    { pref: "mod.aurora.color.tab_active_bg", def: "#2a2a4e", v: "--m-tab-active" },
    { pref: "mod.aurora.color.tab_inactive_bg", def: "#1a1a2e", v: "--m-tab-inactive" },
    { pref: "mod.aurora.color.tab_hover_bg", def: "#252550", v: "--m-tab-hover" },
    { pref: "mod.aurora.color.tab_text", def: "#c0c0e0", v: "--m-tab-text" },
    { pref: "mod.aurora.color.tab_close_hover", def: "#ff6b6b", v: "--m-close" },
    { pref: "mod.aurora.color.panel_text", def: "#e0e0ff", v: "--m-panel-text" },
    { pref: "mod.aurora.color.button_bg", def: "#2a2a4e", v: "--m-btn-bg" },
    { pref: "mod.aurora.color.button_hover", def: "#3a3a6e", v: "--m-btn-hover" },
    { pref: "mod.aurora.color.urlbar_bg", def: "#1e1e3a", v: "--m-urlbar-bg" },
    { pref: "mod.aurora.color.urlbar_border", def: "#3a3a6c", v: "--m-urlbar-border" },
    { pref: "mod.aurora.color.urlbar_text", def: "#e0e0ff", v: "--m-urlbar-text" },
    { pref: "mod.aurora.color.accent", def: "#7c6af7", v: "--m-accent" },
    { pref: "mod.aurora.color.border", def: "#3a3a5c", v: "--m-border" },
    { pref: "mod.aurora.color.selection_bg", def: "#7c6af740", v: "--m-selection" },
    { pref: "mod.aurora.color.scrollbar", def: "#3a3a6c", v: "--m-scrollbar" }
  ];
  var MOCK_ELS = [
    { id: "strip", label: "Workspace strip", selector: "#zen-appcontent-navbar", props: [
      { label: "Pozad\xED stripu", pref: "mod.aurora.color.workspace_strip_bg", def: "#0d0d1e" },
      { label: "Dot neaktivn\xED", pref: "mod.aurora.color.workspace_dot", def: "#3a3a6c" },
      { label: "Dot aktivn\xED", pref: "mod.aurora.color.workspace_dot_active", def: "#7c6af7" }
    ] },
    { id: "sidebar", label: "Sidebar", selector: "#sidebar-box", props: [
      { label: "Pozad\xED sidebaru", pref: "mod.aurora.color.sidebar_bg", def: "#12122a" }
    ] },
    { id: "tab", label: "Z\xE1lo\u017Eky", selector: ".tabbrowser-tab", props: [
      { label: "Aktivn\xED z\xE1lo\u017Eka", pref: "mod.aurora.color.tab_active_bg", def: "#2a2a4e" },
      { label: "Neaktivn\xED z\xE1lo\u017Eka", pref: "mod.aurora.color.tab_inactive_bg", def: "#1a1a2e" },
      { label: "Hover z\xE1lo\u017Eky", pref: "mod.aurora.color.tab_hover_bg", def: "#252550" },
      { label: "Text z\xE1lo\u017Eek", pref: "mod.aurora.color.tab_text", def: "#c0c0e0" },
      { label: "\u2715 tla\u010D\xEDtko hover", pref: "mod.aurora.color.tab_close_hover", def: "#ff6b6b" }
    ] },
    { id: "urlbar", label: "URL li\u0161ta", selector: "#urlbar", props: [
      { label: "Pozad\xED", pref: "mod.aurora.color.urlbar_bg", def: "#1e1e3a" },
      { label: "Ohrani\u010Den\xED idle", pref: "mod.aurora.color.urlbar_border", def: "#3a3a6c" },
      { label: "Ohrani\u010Den\xED focus", pref: "mod.aurora.color.urlbar_focus", def: "#7c6af7" },
      { label: "Text URL li\u0161ty", pref: "mod.aurora.color.urlbar_text", def: "#e0e0ff" }
    ] },
    { id: "toolbar", label: "Toolbar", selector: "#nav-bar \xB7 #navigator-toolbox", props: [
      { label: "Pozad\xED toolbaru", pref: "mod.aurora.color.toolbar_bg", def: "#16162a" },
      { label: "Pozad\xED panel\u016F", pref: "mod.aurora.color.panel_bg", def: "#1a1a2e" },
      { label: "Tla\u010D\xEDtka aktivn\xED", pref: "mod.aurora.color.button_bg", def: "#2a2a4e" },
      { label: "Tla\u010D\xEDtka hover", pref: "mod.aurora.color.button_hover", def: "#3a3a6e" },
      { label: "Text panel\u016F", pref: "mod.aurora.color.panel_text", def: "#e0e0ff" }
    ] },
    { id: "content", label: "Obsah", selector: "#browser", props: [
      { label: "Pozad\xED obsahu", pref: "mod.aurora.color.browser_bg", def: "#0f0f1a" },
      { label: "V\xFDb\u011Br textu", pref: "mod.aurora.color.selection_bg", def: "#7c6af740" },
      { label: "Scrollbar", pref: "mod.aurora.color.scrollbar", def: "#3a3a6c" }
    ] },
    { id: "menu", label: "Menu", selector: "menupopup", props: [
      { label: "Pozad\xED panel\u016F", pref: "mod.aurora.color.panel_bg", def: "#1a1a2e" },
      { label: "Tla\u010D\xEDtka hover", pref: "mod.aurora.color.button_hover", def: "#3a3a6e" },
      { label: "Text panel\u016F", pref: "mod.aurora.color.panel_text", def: "#e0e0ff" }
    ] },
    { id: "global", label: "Glob\xE1ln\xED", selector: ":root", props: [
      { label: "Akcent", pref: "mod.aurora.color.accent", def: "#7c6af7" },
      { label: "Ohrani\u010Den\xED", pref: "mod.aurora.color.border", def: "#3a3a5c" }
    ] }
  ];
  var MOCK_DOTS = `<div class="ao-mock-dot active"></div><div class="ao-mock-dot"></div><div class="ao-mock-dot"></div>`;
  var MOCK_URLBAR = `<div class="ao-mock-urlbar" data-el="urlbar">example.com</div>`;
  var MOCK_BTNS = `<div class="ao-mock-btn"></div><div class="ao-mock-btn"></div><div class="ao-mock-btn"></div>`;
  var MOCK_CONTENT = `<div class="ao-mock-content" data-el="content">
  <div>Lorem ipsum <span class="ao-mock-sel">dolor sit</span> amet.</div>
  <div class="ao-mock-menu" data-el="menu"><div class="mi">Polo\u017Eka</div><div class="mi">Polo\u017Eka</div><div class="mi">Polo\u017Eka</div></div>
  <div class="ao-mock-scroll"></div>
</div>`;
  function mockTabs(collapsed) {
    const tab = (active) => collapsed ? `<div class="ao-mock-tab${active ? " active" : ""}" data-el="tab"></div>` : `<div class="ao-mock-tab${active ? " active" : ""}" data-el="tab"><span>Z\xE1lo\u017Eka</span><span class="x">\u2715</span></div>`;
    return `<div class="ao-mock-tabs">${tab(true)}${tab(false)}${tab(false)}</div>`;
  }
  function mockHtml(mode) {
    const ws = (small) => `<div class="ao-mock-strip${small ? " small" : ""}" data-el="strip">${MOCK_DOTS}</div>`;
    if (mode === "single") {
      return `
      <div class="ao-mock-sidebar" data-el="sidebar">
        <div class="ao-mock-tbrow" data-el="toolbar">${MOCK_BTNS}</div>
        ${MOCK_URLBAR}${ws(false)}${mockTabs(false)}
      </div>${MOCK_CONTENT}`;
    }
    const collapsed = mode === "collapsed";
    return `
    <div class="ao-mock-topbar" data-el="toolbar">${MOCK_BTNS}${MOCK_URLBAR}</div>
    <div class="ao-mock-body">
      <div class="ao-mock-sidebar${collapsed ? " collapsed" : ""}" data-el="sidebar">${ws(collapsed)}${mockTabs(collapsed)}</div>
      ${MOCK_CONTENT}
    </div>`;
  }
  function paintMock(root) {
    for (const m of MOCK_VARS) root.style.setProperty(m.v, getPref(m.pref, m.def));
    if (getBoolPref("mod.aurora.gradient.enabled", false)) {
      const hexes = getPref("mod.aurora.gradient.colors", "#7c6af7").split(",").map((c) => c.trim()).filter(Boolean);
      const op = parseFloat(getPref("mod.aurora.gradient.opacity", "0.5")) || 0.5;
      const dark = getBoolPref("mod.aurora.gradient.dark", true);
      const z = generateZenTheme(hexes, op, dark);
      const base = dark ? "#131313" : "#e9e9e9";
      root.style.setProperty("--m-toolbar-bg", z.toolbar);
      root.style.setProperty("--m-sidebar-bg", z.toolbar);
      root.style.setProperty("--m-strip-bg", z.toolbar);
      root.style.setProperty("--m-browser-bg", `${z.background}, ${base}`);
    }
  }
  function buildColors(doc, el, st) {
    el.appendChild(note(doc, "Klikni na prvek v n\xE1hledu prohl\xED\u017Ee\u010De a uprav jeho barvy. Hrubou paletu nastav\xED\u0161 v sekci Rychl\xE9."));
    if (getBoolPref("mod.aurora.gradient.enabled", false))
      el.appendChild(note(doc, "Gradient je aktivn\xED \u2014 pozad\xED toolbaru, sidebaru a obsahu \u0159\xEDd\xED gradient (sekce Rychl\xE9), proto na n\u011B ploch\xE9 barvy nemaj\xED vliv."));
    const mock = doc.createElement("div");
    function renderMock() {
      const mode = getPref("mod.aurora.layout.toolbar_mode", "multi");
      mock.className = "ao-mock" + (mode === "single" ? " single" : " has-topbar");
      mock.innerHTML = mockHtml(mode);
      paintMock(mock);
    }
    buildSelect(doc, el, "Rozlo\u017Een\xED prohl\xED\u017Ee\u010De", "mod.aurora.layout.toolbar_mode", [
      { label: "Jeden panel", value: "single" },
      { label: "V\xEDce panel\u016F", value: "multi" },
      { label: "Sbalen\xFD", value: "collapsed" }
    ], "multi", () => {
      renderMock();
      invalidateSections?.();
    });
    buildSectionHeading(doc, el, "N\xE1hled prohl\xED\u017Ee\u010De");
    el.appendChild(mock);
    renderMock();
    const extra = doc.createElement("div");
    extra.className = "ao-mock-extra";
    el.appendChild(extra);
    let pop = null;
    let outside = null;
    function closePop() {
      pop?.remove();
      pop = null;
      if (outside) {
        doc.removeEventListener("mousedown", outside, true);
        outside = null;
      }
    }
    function openPop(defn, x, y) {
      closePop();
      const p = doc.createElement("div");
      p.className = "ao-mock-pop";
      const h = doc.createElement("div");
      h.className = "ao-mock-pop-h";
      h.appendChild(doc.createTextNode(tr(defn.label)));
      h.appendChild(badge(doc, defn.selector));
      p.appendChild(h);
      for (const pr of defn.props) {
        const row2 = doc.createElement("div");
        row2.className = "ao-mock-pop-row";
        const span = doc.createElement("span");
        span.textContent = tr(pr.label);
        const sw = doc.createElement("div");
        sw.className = "aoc-color-swatch";
        sw.style.background = getPref(pr.pref, pr.def);
        sw.addEventListener("click", (e) => {
          e.stopPropagation();
          openColorPicker(sw, getPref(pr.pref, pr.def), (v) => {
            setPref(pr.pref, v);
            sw.style.background = v;
            paintMock(mock);
            status(st, "\u2713", "ok");
          });
        });
        row2.appendChild(span);
        row2.appendChild(sw);
        p.appendChild(row2);
      }
      doc.body.appendChild(p);
      pop = p;
      const w = 234, ph = p.offsetHeight || 200;
      const px = Math.min(x + 8, doc.documentElement.clientWidth - w - 10);
      const py = Math.min(y + 8, doc.documentElement.clientHeight - ph - 10);
      p.style.left = `${Math.max(10, px)}px`;
      p.style.top = `${Math.max(10, py)}px`;
      outside = (e) => {
        const t = e.target;
        if (pop && (pop.contains(t) || t.closest?.("#aurora-cp-popup"))) return;
        closePop();
      };
      setTimeout(() => {
        if (outside) doc.addEventListener("mousedown", outside, true);
      }, 0);
    }
    mock.addEventListener("click", (e) => {
      const target = e.target.closest("[data-el]");
      if (!target) return;
      const defn = MOCK_ELS.find((m) => m.id === target.dataset.el);
      if (defn) openPop(defn, e.clientX, e.clientY);
    });
    const globalDef = MOCK_ELS.find((m) => m.id === "global");
    if (globalDef) {
      const chip = doc.createElement("button");
      chip.className = "ao-mock-chip";
      chip.textContent = tr("Glob\xE1ln\xED");
      chip.addEventListener("click", (e) => openPop(globalDef, e.clientX, e.clientY));
      extra.appendChild(chip);
    }
  }
  function buildSpaces(doc, el, st) {
    el.appendChild(note(doc, "P\u0159ep\xED\u0161e glob\xE1ln\xED barvy jen pro vybran\xFD Space. Pr\xE1zdn\xE9 pole = glob\xE1ln\xED hodnota."));
    const tabBar = doc.createElement("div");
    tabBar.className = "ao-space-tabs";
    el.appendChild(tabBar);
    const contents = [];
    for (let i = 0; i < SPACE_COUNT; i++) {
      const tab = doc.createElement("button");
      tab.className = "ao-space-tab" + (i === 0 ? " active" : "");
      tab.textContent = `Space ${i + 1}`;
      tabBar.appendChild(tab);
      const content = doc.createElement("div");
      content.className = "ao-space-content" + (i === 0 ? " active" : "");
      for (const sc of SPACE_COLORS)
        colorRow(doc, content, sc.label, spaceColorPref(i, sc.key), sc.default, st);
      const resetBtn = doc.createElement("button");
      resetBtn.className = "ao-nav-btn danger";
      resetBtn.style.cssText = "margin-top:12px;width:100%;";
      resetBtn.textContent = `\u27F3 Reset Space ${i + 1}`;
      const spaceIdx = i;
      resetBtn.addEventListener("click", () => {
        for (const sc of SPACE_COLORS)
          try {
            Services.prefs.clearUserPref(spaceColorPref(spaceIdx, sc.key));
          } catch {
          }
        invalidateSections?.();
        status(st, `Space ${spaceIdx + 1} \u2713`, "ok");
      });
      content.appendChild(resetBtn);
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
  function buildBackground(doc, el, _st) {
    el.appendChild(note(doc, "Obr\xE1zek se zobrazuje za #browser::before. Pr\u016Fhlednost a blur panel\u016F nastav v sekci Efekty."));
    buildSectionHeading(doc, el, "Obr\xE1zek pozad\xED (#browser::before)");
    const urlRow = doc.createElement("div");
    urlRow.className = "aoc-row";
    const urlLbl = doc.createElement("span");
    urlLbl.className = "aoc-label";
    urlLbl.textContent = "URL nebo cesta k souboru";
    const urlInp = doc.createElement("input");
    urlInp.type = "text";
    urlInp.className = "aoc-input";
    urlInp.value = getPref("mod.aurora.image.browser_bg", "");
    urlInp.placeholder = "https://... nebo file:///C:/...";
    const fileBtn = doc.createElement("button");
    fileBtn.className = "ao-nav-btn";
    fileBtn.textContent = "\u{1F4C2}";
    fileBtn.title = "Vybrat soubor";
    fileBtn.style.cssText = "flex-shrink:0;padding:5px 10px;";
    fileBtn.addEventListener("click", () => {
      const inp = doc.createElement("input");
      inp.type = "file";
      inp.accept = "image/*";
      inp.style.display = "none";
      inp.addEventListener("change", () => {
        const f = inp.files?.[0];
        if (!f) return;
        const path = f.mozFullPath ?? "";
        const url = path ? `file:///${path.replace(/\\/g, "/")}` : URL.createObjectURL(f);
        urlInp.value = url;
        setPref("mod.aurora.image.browser_bg", url);
      });
      doc.body.appendChild(inp);
      inp.click();
      setTimeout(() => inp.remove(), 3e4);
    });
    urlInp.addEventListener("change", () => setPref("mod.aurora.image.browser_bg", urlInp.value.trim()));
    urlRow.appendChild(urlLbl);
    urlRow.appendChild(urlInp);
    urlRow.appendChild(fileBtn);
    el.appendChild(urlRow);
    buildSelect(doc, el, "Velikost (background-size)", "mod.aurora.image.bg_size", [
      { label: "Cover \u2014 vypln\xED plochu", value: "cover" },
      { label: "Contain \u2014 cel\xFD viditeln\xFD", value: "contain" },
      { label: "Auto \u2014 p\u0159irozen\xE1 velikost", value: "auto" },
      { label: "100% \u0161\xED\u0159ka", value: "100% auto" }
    ], "cover");
    buildSelect(doc, el, "Pozice (background-position)", "mod.aurora.image.bg_position", [
      { label: "St\u0159ed", value: "center" },
      { label: "Naho\u0159e", value: "top" },
      { label: "Dole", value: "bottom" },
      { label: "Vlevo", value: "left" },
      { label: "Vpravo", value: "right" }
    ], "center");
    buildSlider(doc, el, "Rozmaz\xE1n\xED obr\xE1zku (filter: blur)", "mod.aurora.image.bg_blur", 0, 30, 1, "px", 0);
    buildSlider(doc, el, "Pr\u016Fhlednost obr\xE1zku (opacity)", "mod.aurora.image.bg_opacity", 0, 1, 0.05, "", 1);
    buildSectionHeading(doc, el, "Startovac\xED str\xE1nka");
    buildToggle(doc, el, "V\u017Edy otev\u0159\xEDt domovskou str\xE1nku na nov\xE9 z\xE1lo\u017Ece", "mod.aurora.newtab_homepage", false, (v) => {
      try {
        if (v) {
          Services.prefs.setIntPref("browser.newtabpage.enabled", 0);
          Services.prefs.setStringPref("browser.newtab.url", Services.prefs.getStringPref("browser.startup.homepage", "about:home"));
        } else {
          Services.prefs.setIntPref("browser.newtabpage.enabled", 1);
        }
      } catch {
      }
    });
  }
  function buildLayout(doc, el, _st) {
    buildSectionHeading(doc, el, "Zapnut\xED stylov\xE1n\xED prvk\u016F");
    el.appendChild(note(doc, "Pokud prvek vypne\u0161, Aurora ho nech\xE1 v Zen v\xFDchoz\xEDm stylu."));
    buildToggle(doc, el, "Z\xE1lo\u017Eky (.tabbrowser-tab)", "mod.aurora.style.tabs", true);
    buildToggle(doc, el, "URL li\u0161ta (#urlbar)", "mod.aurora.style.urlbar", true);
    buildToggle(doc, el, "Sidebar (#sidebar-box)", "mod.aurora.style.sidebar", true);
    buildToggle(doc, el, "Toolbar (#navigator-toolbox, #TabsToolbar\u2026)", "mod.aurora.style.toolbar", true);
    buildToggle(doc, el, "Workspace strip (#zen-appcontent-navbar)", "mod.aurora.style.workspace_strip", true);
    buildToggle(doc, el, "Popup menu (menupopup, menuitem)", "mod.aurora.style.menus", true);
    buildSectionHeading(doc, el, "Z\xE1lo\u017Eky (.tabbrowser-tab)");
    buildSlider(doc, el, "V\xFD\u0161ka z\xE1lo\u017Eky (min/max-height)", "mod.aurora.layout.tab_height", 20, 60, 1, "px", 36);
    buildSlider(doc, el, "Zaoblen\xED z\xE1lo\u017Eky (border-radius)", "mod.aurora.layout.tab_border_radius", 0, 20, 1, "px", 8);
    buildSectionHeading(doc, el, "Panely (#TabsToolbar \xB7 #nav-bar \xB7 #PersonalToolbar)");
    buildSlider(doc, el, "V\xFD\u0161ka panel\u016F (min-height)", "mod.aurora.layout.toolbar_height", 32, 64, 1, "px", 40);
    buildSectionHeading(doc, el, "Sidebar (#sidebar-box)");
    buildSlider(doc, el, "\u0160\xED\u0159ka sidebaru (min/max-width)", "mod.aurora.layout.sidebar_width", 120, 400, 4, "px", 200);
    buildSectionHeading(doc, el, "Workspace strip (#zen-appcontent-navbar)");
    buildSlider(doc, el, "\u0160\xED\u0159ka stripu (min/max-width)", "mod.aurora.layout.workspace_strip_width", 20, 80, 2, "px", 36);
    buildSectionHeading(doc, el, "Zaoblen\xED");
    buildSlider(doc, el, "Zaoblen\xED panel\u016F / URL (#urlbar, menupopup)", "mod.aurora.layout.panel_border_radius", 0, 24, 1, "px", 8);
    buildSlider(doc, el, "Zaoblen\xED tla\u010D\xEDtek / polo\u017Eek menu", "mod.aurora.layout.button_border_radius", 0, 20, 1, "px", 6);
    buildSectionHeading(doc, el, "Ohrani\u010Den\xED");
    buildSlider(doc, el, "Tlou\u0161\u0165ka (border-width \u2014 v\u0161e)", "mod.aurora.layout.border_width", 0, 4, 1, "px", 1);
    buildSectionHeading(doc, el, "Rozvr\u017Een\xED toolbaru");
    buildSelect(doc, el, "Re\u017Eim toolbaru", "mod.aurora.layout.toolbar_mode", [
      { label: "V\xEDce panel\u016F (v\xFDchoz\xED)", value: "multi" },
      { label: "Jeden panel (bez z\xE1lo\u017Ekov\xE9 li\u0161ty)", value: "single" },
      { label: "Sbalen\xFD (auto-hide)", value: "collapsed" }
    ], "multi", () => invalidateSections?.());
    buildSectionHeading(doc, el, "Hitbox horn\xED li\u0161ty (p\u0159i auto-hide)");
    el.appendChild(note(doc, "Zv\u011Bt\u0161\xED neviditelnou oblast naho\u0159e, kter\xE1 aktivuje vysunut\xED li\u0161ty."));
    buildSlider(doc, el, "V\xFD\u0161ka hitboxu", "mod.aurora.layout.hitbox_height", 4, 40, 2, "px", 4);
  }
  function buildEffects(doc, el, st) {
    buildSectionHeading(doc, el, "Pr\u016Fhlednost panel\u016F");
    el.appendChild(note(doc, "Ovliv\u0148uje #navigator-toolbox, #sidebar-box, #zen-appcontent-navbar, menupopup. Blur = frosted glass."));
    buildSlider(doc, el, "Pr\u016Fhlednost panel\u016F (rgba alpha)", "mod.aurora.effect.panel_opacity", 0, 1, 0.05, "", 1);
    buildSlider(doc, el, "Blur panel\u016F (backdrop-filter)", "mod.aurora.effect.panel_blur", 0, 30, 1, "px", 0);
    buildSectionHeading(doc, el, "No Gap Mod");
    el.appendChild(note(doc, "Odstran\xED mezery a zaoblen\xED okolo obsahu prohl\xED\u017Ee\u010De. Portov\xE1no z github.com/Comp-Tech-Guy/No-Gaps v2.5.2."));
    buildToggle(doc, el, "Zapnout No Gap Mod", "mod.aurora.layout.no_gap_mod", false);
    buildSelect(doc, el, "M\xF3d aplikace", "mod.aurora.layout.no_gap_mode", [
      { label: "Oba (compact + non-compact) \u2014 v\xFDchoz\xED", value: "all" },
      { label: "Pouze kompaktn\xED m\xF3d", value: "compact" }
    ], "all");
    buildToggle(doc, el, "Odstranit zv\xFDrazn\u011Bn\xED split z\xE1lo\u017Eek (outline: none)", "mod.aurora.layout.no_gap_remove_split_highlight", false);
    buildToggle(doc, el, "Odstranit box-shadow kontejneru obsahu", "mod.aurora.layout.no_gap_remove_box_shadow", false);
    colorRow(doc, el, "Barva pozad\xED tabpanels", "mod.aurora.layout.no_gap_bg", "#000000", st, "#tabbrowser-tabpanels");
    buildSectionHeading(doc, el, "St\xEDny a z\xE1\u0159e");
    buildToggle(doc, el, "St\xEDn aktivn\xED z\xE1lo\u017Eky (.tabbrowser-tab[selected])", "mod.aurora.effect.tab_shadow", false);
    buildToggle(doc, el, "Z\xE1\u0159e akcentu p\u0159i hoveru a aktivn\xED z\xE1lo\u017Ece (glow)", "mod.aurora.effect.accent_glow", false);
    buildSectionHeading(doc, el, "Styl ohrani\u010Den\xED (border-style \u2014 v\u0161e)");
    buildSelect(doc, el, "Styl", "mod.aurora.effect.panel_border_style", [
      { label: "Pln\xE9 (solid)", value: "solid" },
      { label: "Te\u010Dky (dotted)", value: "dotted" },
      { label: "P\u0159eru\u0161ovan\xE9 (dashed)", value: "dashed" },
      { label: "\u017D\xE1dn\xE9 (none)", value: "none" }
    ], "solid");
    buildSectionHeading(doc, el, "Animace (CSS transitions \u2014 v\u0161e)");
    buildSelect(doc, el, "Rychlost (transition-duration)", "mod.aurora.animation_speed", [
      { label: "Vypnut\xE9 \u2014 \u017E\xE1dn\xE9 (0s)", value: "none" },
      { label: "Pomal\xE9 (0.45s)", value: "slow" },
      { label: "Norm\xE1ln\xED (0.18s)", value: "normal" },
      { label: "Rychl\xE9 (0.08s)", value: "fast" }
    ], "normal");
    buildSelect(doc, el, "K\u0159ivka (transition-timing-function)", "mod.aurora.animation.easing", [
      { label: "Material ease (v\xFDchoz\xED)", value: "ease" },
      { label: "Linear", value: "linear" },
      { label: "Ease Out", value: "ease-out" },
      { label: "Spring (p\u0159ekmit)", value: "cubic-bezier(0.34,1.56,0.64,1)" }
    ], "ease");
  }
  function buildFontText(doc, el, st) {
    buildSectionHeading(doc, el, "P\xEDsmo (z\xE1lo\u017Eky, panely, URL li\u0161ta)");
    buildTextInput(doc, el, "Rodina (font-family)", "mod.aurora.font.family", "system-ui, sans-serif", "inherit");
    buildSlider(doc, el, "Velikost (font-size)", "mod.aurora.font.size", 10, 20, 1, "px", 13);
    buildSelect(doc, el, "Tu\u010Dnost (font-weight)", "mod.aurora.font.weight", [
      { label: "300 \u2014 tenk\xE9", value: "300" },
      { label: "400 \u2014 norm\xE1ln\xED", value: "400" },
      { label: "500 \u2014 st\u0159edn\xED", value: "500" },
      { label: "600 \u2014 semibold", value: "600" },
      { label: "700 \u2014 tu\u010Dn\xE9", value: "700" }
    ], "400");
    buildSectionHeading(doc, el, "Barvy textu");
    colorRow(doc, el, "Text panel\u016F (toolbar, sidebar, menu)", "mod.aurora.color.panel_text", "#e0e0ff", st, "#TabsToolbar toolbarbutton menuitem");
    colorRow(doc, el, "Text z\xE1lo\u017Eek (.tab-label)", "mod.aurora.color.tab_text", "#c0c0e0", st, ".tab-label .tab-text");
    colorRow(doc, el, "Text URL li\u0161ty (#urlbar-input)", "mod.aurora.color.urlbar_text", "#e0e0ff", st, "#urlbar-input");
    buildToggle(doc, el, "Individu\xE1ln\xED barvy textu (z\xE1lo\u017Eky a urlbar maj\xED vlastn\xED barvu, jinak se kop\xEDruje barva panel\u016F)", "mod.aurora.style.individual_text_colors", false);
  }
  function buildAccessibility(doc, el, _st) {
    buildSectionHeading(doc, el, "Barevn\xE9 sch\xE9ma obsahu (prefers-color-scheme)");
    el.appendChild(note(doc, "Nastav\xED jak webov\xE9 str\xE1nky vid\xED v\xE1\u0161 preferovan\xFD barevn\xFD motiv. Ovliv\u0148uje weby kter\xE9 reaguj\xED na dark/light mode."));
    buildSelect(doc, el, "Sch\xE9ma obsahu", "mod.aurora.accessibility.color_scheme", [
      { label: "Dle syst\xE9mu (auto)", value: "auto" },
      { label: "Tmav\xFD (dark)", value: "dark" },
      { label: "Sv\u011Btl\xFD (light)", value: "light" }
    ], "auto", (v) => {
      try {
        const map = { auto: 0, dark: 1, light: 2 };
        Services.prefs.setIntPref("browser.theme.content-preferred-color-scheme", map[v] ?? 0);
      } catch {
      }
    });
    buildSectionHeading(doc, el, "Vysok\xFD kontrast prohl\xED\u017Ee\u010De");
    buildSelect(doc, el, "Kontrast", "mod.aurora.accessibility.web_contrast", [
      { label: "Vypnuto", value: "off" },
      { label: "Vysok\xFD kontrast tmav\xFD", value: "high-dark" },
      { label: "Vysok\xFD kontrast sv\u011Btl\xFD", value: "high-light" }
    ], "off");
    buildSectionHeading(doc, el, "Simulace barvosleposti");
    el.appendChild(note(doc, "Aplikuje CSS filtr na cel\xFD prohl\xED\u017Ee\u010D. Pom\xE1h\xE1 p\u0159i n\xE1vrhu p\u0159\xEDstupn\xE9ho UI nebo pro u\u017Eivatele s vadou barvocitu."));
    buildSelect(doc, el, "Typ barvosleposti", "mod.aurora.accessibility.color_blind_mode", [
      { label: "Vypnuto", value: "off" },
      { label: "Protanopie (nedostatek \u010Derven\xE9)", value: "protanopia" },
      { label: "Deuteranopie (nedostatek zelen\xE9)", value: "deuteranopia" },
      { label: "Tritanopie (nedostatek modr\xE9)", value: "tritanopia" },
      { label: "Achromatopsie (bez barev)", value: "achromatopsia" }
    ], "off");
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
    "mod.aurora.layout.toolbar_mode",
    "mod.aurora.layout.hitbox_height",
    "mod.aurora.layout.no_gap_bg",
    "mod.aurora.layout.no_gap_mode",
    "mod.aurora.animation_speed",
    "mod.aurora.animation.easing",
    "mod.aurora.gradient.colors",
    "mod.aurora.gradient.opacity"
  ];
  var ALL_BOOL_PREFS = [
    "mod.aurora.effect.tab_shadow",
    "mod.aurora.effect.accent_glow",
    "mod.aurora.layout.no_gap_mod",
    "mod.aurora.layout.no_gap_remove_split_highlight",
    "mod.aurora.layout.no_gap_remove_box_shadow",
    "mod.aurora.style.tabs",
    "mod.aurora.style.urlbar",
    "mod.aurora.style.sidebar",
    "mod.aurora.style.toolbar",
    "mod.aurora.style.workspace_strip",
    "mod.aurora.style.menus",
    "mod.aurora.style.individual_text_colors",
    "mod.aurora.gradient.enabled",
    "mod.aurora.gradient.dark"
  ];
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
        Services.prefs.setStringPref(`mod.aurora.preset.${i}`, JSON.stringify({ name, ts: Date.now(), data: capturePreset() }));
        return i;
      }
    }
    return -1;
  }
  function updatePresetMeta(idx, name, data) {
    try {
      Services.prefs.setStringPref(`mod.aurora.preset.${idx}`, JSON.stringify({ name, ts: Date.now(), data }));
    } catch {
    }
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
      if (!presets.length) {
        const e = doc.createElement("div");
        e.style.cssText = "color:#5550aa;font-size:12px;padding:10px 0;";
        e.textContent = "\u017D\xE1dn\xE9 ulo\u017Een\xE9 profily.";
        listEl.appendChild(e);
        return;
      }
      for (const p of presets) {
        const item = doc.createElement("div");
        item.className = "ao-preset-item";
        const swRow = doc.createElement("div");
        swRow.className = "ao-preset-swatch-row";
        try {
          const data = JSON.parse(p.json);
          for (const key of ["mod.aurora.color.accent", "mod.aurora.color.panel_bg", "mod.aurora.color.tab_active_bg"]) {
            const sw = doc.createElement("div");
            sw.className = "ao-preset-swatch";
            sw.style.background = data[key] || "#333";
            swRow.appendChild(sw);
          }
        } catch {
        }
        const nameView = doc.createElement("span");
        nameView.className = "ao-preset-name-view";
        nameView.textContent = p.name;
        const nameEdit = doc.createElement("input");
        nameEdit.type = "text";
        nameEdit.className = "ao-preset-name-edit";
        nameEdit.value = p.name;
        nameEdit.style.display = "none";
        const time = doc.createElement("span");
        time.className = "ao-preset-time";
        time.textContent = new Date(p.ts).toLocaleDateString("cs-CZ");
        const loadBtn = doc.createElement("button");
        loadBtn.className = "ao-preset-btn load";
        loadBtn.textContent = "Na\u010D\xEDst";
        loadBtn.addEventListener("click", () => {
          applyPresetData(p.json);
          invalidateSections?.();
          status(st, "Profil na\u010Dten", "ok");
        });
        const renBtn = doc.createElement("button");
        renBtn.className = "ao-preset-btn";
        renBtn.textContent = "\u270E";
        renBtn.title = "P\u0159ejmenovat";
        let editing = false;
        renBtn.addEventListener("click", () => {
          editing = !editing;
          nameView.style.display = editing ? "none" : "";
          nameEdit.style.display = editing ? "" : "none";
          if (!editing) {
            const n = nameEdit.value.trim() || p.name;
            nameView.textContent = n;
            updatePresetMeta(p.idx, n, p.json);
            status(st, "P\u0159ejmenov\xE1no", "ok");
          } else {
            nameEdit.focus();
            nameEdit.select();
          }
          renBtn.textContent = editing ? "\u2713" : "\u270E";
        });
        nameEdit.addEventListener("keydown", (e) => {
          if (e.key === "Enter") renBtn.click();
          if (e.key === "Escape") {
            editing = true;
            renBtn.click();
          }
        });
        const overBtn = doc.createElement("button");
        overBtn.className = "ao-preset-btn save";
        overBtn.textContent = "\u2191 P\u0159epsat";
        overBtn.addEventListener("click", () => {
          updatePresetMeta(p.idx, p.name, capturePreset());
          status(st, "Profil p\u0159eps\xE1n", "ok");
        });
        const delBtn = doc.createElement("button");
        delBtn.className = "ao-preset-btn del";
        delBtn.textContent = "\u2715";
        delBtn.addEventListener("click", () => {
          deletePreset(p.idx);
          refresh();
        });
        item.appendChild(swRow);
        item.appendChild(nameView);
        item.appendChild(nameEdit);
        item.appendChild(time);
        item.appendChild(loadBtn);
        item.appendChild(renBtn);
        item.appendChild(overBtn);
        item.appendChild(delBtn);
        listEl.appendChild(item);
      }
      translateTree(listEl);
    }
    refresh();
    buildSectionHeading(doc, el, "Ulo\u017Eit aktu\xE1ln\xED nastaven\xED");
    const saveRow = doc.createElement("div");
    saveRow.className = "ao-preset-save-row";
    const nameIn = doc.createElement("input");
    nameIn.type = "text";
    nameIn.className = "ao-preset-name-in";
    nameIn.placeholder = "N\xE1zev profilu";
    const saveBtn = doc.createElement("button");
    saveBtn.className = "ao-preset-save-btn";
    saveBtn.textContent = "Ulo\u017Eit";
    saveBtn.addEventListener("click", () => {
      const n = nameIn.value.trim() || `Profil ${Date.now()}`;
      if (savePreset(n) < 0) {
        status(st, "Maximum 20 profil\u016F dosa\u017Eeno", "err");
        return;
      }
      nameIn.value = "";
      refresh();
      status(st, "Profil ulo\u017Een", "ok");
    });
    saveRow.appendChild(nameIn);
    saveRow.appendChild(saveBtn);
    el.appendChild(saveRow);
    buildSectionHeading(doc, el, "Export / Import (.txt)");
    const ioRow = doc.createElement("div");
    ioRow.style.cssText = "display:flex;gap:8px;";
    const expBtn = doc.createElement("button");
    expBtn.className = "ao-nav-btn";
    expBtn.textContent = "\u{1F4BE} Export";
    expBtn.addEventListener("click", () => exportTxt(doc, st));
    const impBtn = doc.createElement("button");
    impBtn.className = "ao-nav-btn";
    impBtn.textContent = "\u{1F4C2} Import";
    impBtn.addEventListener("click", () => importTxt(doc, st));
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
  function importTxt(doc, st) {
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
        status(st, bad ? `Na\u010Dteno ${ok}, p\u0159esko\u010Deno ${bad}` : `Na\u010Dteno ${ok} hodnot`, ok > 0 ? "ok" : "err");
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
    sub.textContent = "Kompletn\xED UI overhaul pro Zen Browser \xB7 v0.2.0 \xB7 Rockynio-dot";
    card.appendChild(t);
    card.appendChild(sub);
    el.appendChild(card);
    buildSectionHeading(doc, el, "Reset barev");
    const resetColorsBtn = doc.createElement("button");
    resetColorsBtn.className = "ao-nav-btn danger";
    resetColorsBtn.style.cssText = "width:100%;margin-bottom:8px;";
    resetColorsBtn.textContent = "\u27F3  Reset barev na Aurora v\xFDchoz\xED (fialov\xFD dark)";
    resetColorsBtn.addEventListener("click", () => {
      if (!confirm(tr("Opravdu resetovat v\u0161echny barvy na Aurora v\xFDchoz\xED?"))) return;
      for (const [pref, val] of Object.entries(AURORA_COLOR_DEFAULTS)) {
        try {
          Services.prefs.setStringPref(pref, val);
        } catch {
        }
      }
      for (let i = 0; i < SPACE_COUNT; i++)
        for (const sc of SPACE_COLORS)
          try {
            Services.prefs.clearUserPref(spaceColorPref(i, sc.key));
          } catch {
          }
      invalidateSections?.();
      status(st, "Barvy resetov\xE1ny", "ok");
    });
    el.appendChild(resetColorsBtn);
    buildSectionHeading(doc, el, "Reset ve\u0161ker\xFDch nastaven\xED");
    const resetAllBtn = doc.createElement("button");
    resetAllBtn.className = "ao-nav-btn danger";
    resetAllBtn.style.cssText = "width:100%;";
    resetAllBtn.textContent = "\u27F3  Reset VE\u0160KER\xDDCH nastaven\xED Aurora";
    resetAllBtn.addEventListener("click", () => {
      if (!confirm(tr("Opravdu resetovat ve\u0161ker\xE1 nastaven\xED Aurora?"))) return;
      for (const p of [...ALL_STRING_PREFS, ...ALL_BOOL_PREFS, ...Object.keys(AURORA_COLOR_DEFAULTS)]) {
        try {
          Services.prefs.clearUserPref(p);
        } catch {
        }
      }
      for (let i = 1; i <= 20; i++) {
        try {
          Services.prefs.clearUserPref(`mod.aurora.preset.${i}`);
        } catch {
        }
      }
      invalidateSections?.();
      status(st, "Ve\u0161ker\xE1 nastaven\xED resetov\xE1na", "ok");
    });
    el.appendChild(resetAllBtn);
  }
  var NAV_ITEMS = [
    { id: "quick", icon: "\u{1F31F}", label: "Rychl\xE9" },
    { id: "colors", icon: "\u{1F3A8}", label: "Barvy" },
    { id: "spaces", icon: "\u{1F30C}", label: "Spaces" },
    { id: "background", icon: "\u{1F5BC}\uFE0F", label: "Pozad\xED" },
    { id: "layout", icon: "\u{1F4D0}", label: "Rozm\u011Bry" },
    { id: "effects", icon: "\u2728", label: "Efekty" },
    { id: "fonttext", icon: "\u{1F524}", label: "P\xEDsmo & Text" },
    { id: "access", icon: "\u267F", label: "P\u0159\xEDstupnost" },
    { id: "presets", icon: "\u{1F4BE}", label: "Presety" },
    { id: "about", icon: "\u2139\uFE0F", label: "O m\xF3du" }
  ];
  var SECTION_BUILDERS = {
    quick: buildQuick,
    colors: buildColors,
    spaces: buildSpaces,
    background: buildBackground,
    layout: buildLayout,
    effects: buildEffects,
    fonttext: buildFontText,
    access: buildAccessibility,
    presets: buildPresets,
    about: buildAbout
  };
  function headSegment(doc, labelText, options, current, onChange) {
    const group = doc.createElement("div");
    group.className = "ao-head-group";
    const lbl = doc.createElement("span");
    lbl.className = "ao-head-group-lbl";
    lbl.textContent = labelText;
    const seg = doc.createElement("div");
    seg.className = "aoc-seg mini";
    const btns = [];
    for (const opt of options) {
      const b = doc.createElement("button");
      b.type = "button";
      b.className = "aoc-seg-btn" + (opt.value === current ? " active" : "");
      b.textContent = opt.label;
      b.addEventListener("click", () => {
        for (const o of btns) o.classList.toggle("active", o === b);
        onChange(opt.value);
      });
      seg.appendChild(b);
      btns.push(b);
    }
    group.appendChild(lbl);
    group.appendChild(seg);
    return group;
  }
  function isLightColor(hex) {
    const n = hex.replace("#", "");
    if (n.length < 6) return false;
    const r = parseInt(n.slice(0, 2), 16), g = parseInt(n.slice(2, 4), 16), b = parseInt(n.slice(4, 6), 16);
    return 0.299 * r + 0.587 * g + 0.114 * b > 150;
  }
  function deriveUiTheme(accent, dark) {
    const [h, s] = hexToHsl(accent);
    if (dark) {
      return {
        "--ao-bg": `linear-gradient(160deg, ${hslHex(h, Math.min(s, 40), 9)} 0%, ${hslHex(h, Math.min(s, 45), 5)} 55%, #000000 100%)`,
        "--ao-nav-bg": hslHex(h, Math.min(s, 35), 6),
        "--ao-header-bg": hslHex(h, Math.min(s, 38), 8),
        "--ao-panel": hslHex(h, Math.min(s, 35), 11),
        "--ao-panel-2": hslHex(h, Math.min(s, 40), 16),
        "--ao-border": hslHex(h, Math.min(s, 42), 30),
        "--ao-border-soft": hslHex(h, Math.min(s, 35), 18),
        "--ao-row-sep": hslHex(h, Math.min(s, 35), 14),
        "--ao-text": hslHex(h, Math.min(s, 25), 92),
        "--ao-text-dim": hslHex(h, Math.min(s, 22), 78),
        "--ao-text-muted": hslHex(h, Math.min(s, 30), 60),
        "--ao-text-faint": hslHex(h, Math.min(s, 30), 52),
        "--ao-heading": hslHex(h, Math.min(s, 30), 54),
        "--ao-accent": accent,
        "--ao-accent-2": hslHex(h, Math.min(s, 90), 70),
        "--ao-accent-soft": hslHex(h, Math.min(s, 75), 78),
        "--ao-on-accent": isLightColor(accent) ? "#15151f" : "#ffffff",
        "--ao-badge-bg": hslHex(h, Math.min(s, 35), 13),
        "--ao-badge-border": hslHex(h, Math.min(s, 35), 24)
      };
    }
    const acc = hslHex(h, Math.max(Math.min(s, 92), 45), 46);
    return {
      "--ao-bg": `linear-gradient(160deg, ${hslHex(h, Math.min(s, 40), 98)} 0%, ${hslHex(h, Math.min(s, 38), 94)} 60%, ${hslHex(h, Math.min(s, 35), 89)} 100%)`,
      "--ao-nav-bg": hslHex(h, Math.min(s, 35), 95),
      "--ao-header-bg": hslHex(h, Math.min(s, 35), 96),
      "--ao-panel": hslHex(h, Math.min(s, 30), 99),
      "--ao-panel-2": hslHex(h, Math.min(s, 32), 95),
      "--ao-border": hslHex(h, Math.min(s, 32), 80),
      "--ao-border-soft": hslHex(h, Math.min(s, 28), 90),
      "--ao-row-sep": hslHex(h, Math.min(s, 28), 92),
      "--ao-text": hslHex(h, Math.min(s, 30), 14),
      "--ao-text-dim": hslHex(h, Math.min(s, 25), 32),
      "--ao-text-muted": hslHex(h, Math.min(s, 25), 48),
      "--ao-text-faint": hslHex(h, Math.min(s, 25), 56),
      "--ao-heading": hslHex(h, Math.min(s, 25), 58),
      "--ao-accent": acc,
      "--ao-accent-2": hslHex(h, Math.max(Math.min(s, 92), 45), 38),
      "--ao-accent-soft": hslHex(h, Math.min(s, 80), 42),
      "--ao-on-accent": "#ffffff",
      "--ao-badge-bg": hslHex(h, Math.min(s, 30), 94),
      "--ao-badge-border": hslHex(h, Math.min(s, 28), 85)
    };
  }
  function applyUiTheme(doc) {
    const dark = getPref("mod.aurora.ui.theme", "dark") !== "light";
    doc.body.classList.toggle("ao-light", !dark);
    const vars = deriveUiTheme(getPref("mod.aurora.ui.accent", "#7c6af7"), dark);
    for (const [k, v] of Object.entries(vars)) doc.body.style.setProperty(k, v);
  }
  function buildUI(doc) {
    if (!doc.getElementById("ao-style")) {
      const style = doc.createElement("style");
      style.id = "ao-style";
      style.textContent = CSS;
      doc.head.appendChild(style);
    }
    applyUiTheme(doc);
    initColorPicker(doc);
    const nav = doc.createElement("div");
    nav.className = "ao-nav";
    const main = doc.createElement("div");
    main.className = "ao-main";
    const logo = doc.createElement("div");
    logo.className = "ao-nav-logo";
    logo.textContent = "\u2726 Aurora";
    nav.appendChild(logo);
    const header = doc.createElement("div");
    header.className = "ao-header";
    const hTitle = doc.createElement("div");
    hTitle.className = "ao-header-title";
    const hSub = doc.createElement("span");
    hSub.className = "ao-header-sub";
    hTitle.appendChild(doc.createTextNode("\u2726 Aurora"));
    hTitle.appendChild(hSub);
    const ctrls = doc.createElement("div");
    ctrls.className = "ao-head-ctrls";
    ctrls.appendChild(headSegment(
      doc,
      tr("Vzhled"),
      [{ label: "\u{1F319}", value: "dark" }, { label: "\u2600\uFE0F", value: "light" }],
      getPref("mod.aurora.ui.theme", "dark"),
      (v) => {
        setPref("mod.aurora.ui.theme", v);
        applyUiTheme(doc);
      }
    ));
    {
      const g = doc.createElement("div");
      g.className = "ao-head-group";
      const lbl = doc.createElement("span");
      lbl.className = "ao-head-group-lbl";
      lbl.textContent = tr("Barva");
      const sw = doc.createElement("div");
      sw.className = "ao-head-swatch";
      sw.style.background = getPref("mod.aurora.ui.accent", "#7c6af7");
      sw.title = tr("Barva");
      sw.addEventListener("click", (e) => {
        e.stopPropagation();
        openColorPicker(sw, getPref("mod.aurora.ui.accent", "#7c6af7"), (v) => {
          setPref("mod.aurora.ui.accent", v);
          sw.style.background = v;
          applyUiTheme(doc);
        });
      });
      g.appendChild(lbl);
      g.appendChild(sw);
      ctrls.appendChild(g);
    }
    ctrls.appendChild(headSegment(
      doc,
      tr("Jazyk"),
      [{ label: "CS", value: "cs" }, { label: "EN", value: "en" }],
      getLang(),
      (v) => {
        setLang(v);
        window.location.reload();
      }
    ));
    const closeBtn = doc.createElement("button");
    closeBtn.className = "ao-header-close";
    closeBtn.textContent = tr("\u2715 Zav\u0159\xEDt  (Esc)");
    closeBtn.addEventListener("click", () => window.close());
    ctrls.appendChild(closeBtn);
    header.appendChild(hTitle);
    header.appendChild(ctrls);
    const content = doc.createElement("div");
    content.className = "ao-content";
    const st = doc.createElement("div");
    st.className = "ao-status";
    st.style.marginBottom = "4px";
    content.appendChild(st);
    main.appendChild(header);
    main.appendChild(content);
    doc.body.appendChild(nav);
    doc.body.appendChild(main);
    const sections = {};
    const navEls = [];
    let activeId = "quick";
    function showSection(id) {
      sections[activeId]?.classList.remove("active");
      navEls.find((n) => n.dataset.id === activeId)?.classList.remove("active");
      if (!sections[id]) {
        const sec = doc.createElement("div");
        sec.className = "ao-section";
        sec.dataset.section = id;
        SECTION_BUILDERS[id](doc, sec, st);
        translateTree(sec);
        content.appendChild(sec);
        sections[id] = sec;
      }
      sections[id].classList.add("active");
      navEls.find((n) => n.dataset.id === id)?.classList.add("active");
      activeId = id;
      const item = NAV_ITEMS.find((n) => n.id === id);
      if (item) hSub.textContent = `\u2014 ${tr(item.label)}`;
      content.scrollTop = 0;
    }
    invalidateSections = () => {
      for (const k of Object.keys(sections)) {
        if (k === activeId) continue;
        sections[k]?.remove();
        delete sections[k];
      }
    };
    for (const item of NAV_ITEMS) {
      const ni = doc.createElement("div");
      ni.className = "ao-nav-item";
      ni.dataset.id = item.id;
      const ic = doc.createElement("span");
      ic.className = "ao-nav-icon";
      ic.textContent = item.icon;
      const lb = doc.createElement("span");
      lb.textContent = tr(item.label);
      ni.appendChild(ic);
      ni.appendChild(lb);
      ni.addEventListener("click", () => showSection(item.id));
      nav.appendChild(ni);
      navEls.push(ni);
    }
    showSection("quick");
    doc.addEventListener("keydown", (e) => {
      if (e.key === "Escape") window.close();
    });
  }
  window._auroraSettings = true;
  buildUI(document);
})();

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

  // src/ui/settingsPage.ts
  var CSS = `
*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0; padding: 0;
  display: flex; height: 100vh; overflow: hidden;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 13px; color: #e0e0ff;
  background: #10102a;
}

/* \u2500\u2500 Left nav \u2500\u2500 */
.ao-nav {
  width: 180px; flex-shrink: 0;
  background: #0b0b1f;
  border-right: 1px solid #1e1e44;
  display: flex; flex-direction: column;
  padding: 16px 0 8px;
  overflow-y: auto;
}
.ao-nav-logo {
  padding: 0 16px 16px;
  font-size: 16px; font-weight: 800; color: #a89bff; letter-spacing: 0.5px;
  border-bottom: 1px solid #1e1e44; margin-bottom: 8px;
}
.ao-nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 16px; cursor: pointer; color: #6660aa;
  border-left: 2px solid transparent;
  transition: color 0.1s, background 0.1s, border-color 0.1s;
  user-select: none; font-size: 12.5px;
}
.ao-nav-item:hover { color: #c0b4ff; background: #12123a; }
.ao-nav-item.active {
  color: #c0b4ff; background: #16163a;
  border-left-color: #7c6af7; font-weight: 600;
}
.ao-nav-icon { font-size: 15px; width: 18px; text-align: center; }
.ao-nav-sep { height: 1px; background: #1e1e44; margin: 8px 16px; }
.ao-nav-actions { margin-top: auto; padding: 8px; display: flex; flex-direction: column; gap: 6px; }
.ao-nav-btn {
  padding: 7px 10px; border: 1px solid #2d2d5c; border-radius: 8px;
  background: #0f0f28; color: #8880cc; font-size: 11px;
  cursor: pointer; text-align: left; font-family: inherit;
  transition: background 0.1s, color 0.1s, border-color 0.1s;
  display: flex; align-items: center; gap: 6px;
}
.ao-nav-btn:hover { background: #1a1a3a; color: #c0b4ff; border-color: #4a4a8a; }
.ao-nav-btn.danger { border-color: #4a1a1a; color: #c06060; }
.ao-nav-btn.danger:hover { background: #2a1010; border-color: #8a2a2a; color: #ff8080; }

/* \u2500\u2500 Main \u2500\u2500 */
.ao-main { flex: 1; background: #10102a; display: flex; flex-direction: column; overflow: hidden; }
.ao-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 24px; border-bottom: 1px solid #1e1e44;
  background: #0d0d22; flex-shrink: 0;
}
.ao-header-title { font-size: 15px; font-weight: 700; color: #c0b4ff; display: flex; align-items: center; gap: 8px; }
.ao-header-sub { font-size: 11px; color: #5550aa; font-weight: 400; margin-left: 4px; }
.ao-header-close {
  background: #1a1a38; border: 1px solid #2d2d5c; border-radius: 8px;
  color: #8880cc; font-size: 13px; cursor: pointer; padding: 5px 12px;
  font-family: inherit; transition: background 0.1s, color 0.1s;
}
.ao-header-close:hover { background: #2a2a4e; color: #e0e0ff; }

.ao-content { flex: 1; overflow-y: auto; padding: 24px; }
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
  padding: 8px 0; border-bottom: 1px solid #16163a; gap: 12px; min-height: 40px;
}
.aoc-row:last-child { border-bottom: none; }
.aoc-label { color: #b0b0d0; font-size: 12.5px; flex: 1; }

/* Color */
.aoc-color-swatch {
  width: 28px; height: 28px; border-radius: 7px;
  border: 2px solid #2d2d5c; cursor: pointer; flex-shrink: 0;
  transition: border-color 0.12s, transform 0.12s;
}
.aoc-color-swatch:hover { border-color: #7c6af7; transform: scale(1.08); }
.aoc-color-hex {
  width: 74px; background: #0d0d22; border: 1px solid #2d2d5c; border-radius: 6px;
  color: #c0b4ff; font-size: 11px; font-family: monospace;
  padding: 5px 6px; text-align: center; flex-shrink: 0;
}
.aoc-color-hex:focus { outline: 1px solid #7c6af7; border-color: #7c6af7; }

/* Toggle */
.aoc-toggle {
  width: 36px; height: 20px; border-radius: 10px; background: #2a2a4e;
  flex-shrink: 0; position: relative; cursor: pointer; transition: background 0.15s; outline: none;
}
.aoc-toggle:focus-visible { box-shadow: 0 0 0 2px #7c6af7; }
.aoc-toggle.on { background: #7c6af7; }
.aoc-thumb { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 8px; background: #fff; transition: left 0.15s; }
.aoc-toggle.on .aoc-thumb { left: 18px; }

/* Slider */
.aoc-row-slider { flex-direction: column; align-items: stretch; gap: 4px; }
.aoc-slider-header { display: flex; justify-content: space-between; align-items: center; }
.aoc-slider-val { color: #7c6af7; font-size: 12px; font-family: monospace; }
.aoc-slider {
  width: 100%; height: 4px; cursor: pointer;
  -webkit-appearance: none; appearance: none;
  background: #2d2d5c; border-radius: 2px;
}
.aoc-slider::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 16px; height: 16px; border-radius: 50%;
  background: #7c6af7; cursor: pointer; box-shadow: 0 0 0 2px #0d0d22;
}

/* Select */
.aoc-select {
  background: #0d0d22; border: 1px solid #2d2d5c; border-radius: 6px;
  color: #c0b4ff; font-size: 12px; font-family: inherit;
  padding: 5px 8px; cursor: pointer; flex-shrink: 0; min-width: 180px;
}
.aoc-select:focus { outline: 1px solid #7c6af7; border-color: #7c6af7; }

/* Text input */
.aoc-input {
  background: #0d0d22; border: 1px solid #2d2d5c; border-radius: 6px;
  color: #c0b4ff; font-size: 12px; font-family: inherit;
  padding: 5px 8px; flex: 1; min-width: 0;
}
.aoc-input:focus { outline: 1px solid #7c6af7; border-color: #7c6af7; }

/* Target badge \u2014 small CSS selector hint next to a label */
.ao-badge {
  display: inline-block; font-size: 9px; font-family: monospace;
  background: #141430; border: 1px solid #252550; border-radius: 3px;
  color: #5550aa; padding: 1px 4px; margin-left: 6px;
  vertical-align: middle; white-space: nowrap;
}

/* Space tabs */
.ao-space-tabs { display: flex; gap: 4px; margin-bottom: 16px; flex-wrap: wrap; }
.ao-space-tab {
  padding: 5px 12px; border-radius: 6px; border: 1px solid #2d2d5c;
  background: #0d0d22; color: #6660aa; font-size: 12px;
  cursor: pointer; font-family: inherit;
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

/* Info note */
.ao-note {
  font-size: 11.5px; color: #5550aa; line-height: 1.6;
  padding: 8px 12px; background: #0d0d22; border: 1px solid #1e1e44;
  border-radius: 6px; margin-bottom: 12px;
}

/* Presets */
.ao-preset-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.ao-preset-item {
  display: flex; align-items: center; gap: 8px; padding: 10px 14px;
  background: #0d0d22; border: 1px solid #1e1e44; border-radius: 8px;
  transition: border-color 0.1s;
}
.ao-preset-item:hover { border-color: #2d2d5c; }
.ao-preset-swatch-row { display: flex; gap: 3px; flex-shrink: 0; }
.ao-preset-swatch { width: 14px; height: 14px; border-radius: 3px; }
.ao-preset-name { flex: 1; color: #c0b4ff; font-size: 12.5px; }
.ao-preset-time { color: #5550aa; font-size: 11px; white-space: nowrap; }
.ao-preset-btn {
  padding: 4px 10px; border-radius: 5px; font-size: 11px;
  border: 1px solid #2d2d5c; background: #141432; color: #8880cc;
  cursor: pointer; font-family: inherit; transition: background 0.1s, color 0.1s;
}
.ao-preset-btn:hover { background: #1e1e44; color: #c0b4ff; }
.ao-preset-btn.load { border-color: #7c6af7; color: #a89bff; }
.ao-preset-btn.load:hover { background: #1e1e4a; }
.ao-preset-btn.del:hover { border-color: #8a2a2a; color: #ff8080; }
.ao-preset-save { display: flex; gap: 8px; align-items: center; margin-top: 4px; }
.ao-preset-name-in {
  flex: 1; background: #0d0d22; border: 1px solid #2d2d5c; border-radius: 6px;
  color: #c0b4ff; font-size: 12px; font-family: inherit; padding: 7px 10px;
}
.ao-preset-name-in:focus { outline: 1px solid #7c6af7; border-color: #7c6af7; }
.ao-preset-save-btn {
  padding: 7px 16px; background: #7c6af7; border: none; border-radius: 6px;
  color: #fff; font-size: 12px; cursor: pointer; font-family: inherit; transition: background 0.1s;
}
.ao-preset-save-btn:hover { background: #9080ff; }

/* About card */
.ao-about-card {
  padding: 16px; background: #0d0d22; border: 1px solid #1e1e44;
  border-radius: 10px; margin-bottom: 12px;
}
.ao-about-title { font-size: 18px; font-weight: 700; color: #a89bff; margin-bottom: 4px; }
.ao-about-sub { font-size: 12px; color: #5550aa; }

/* Coverage grid */
.ao-coverage-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin: 8px 0 16px;
}
.ao-coverage-item {
  padding: 5px 8px; background: #0a0a1e; border: 1px solid #1a1a38;
  border-radius: 5px; font-size: 10px; font-family: monospace; color: #5550aa;
}

/* Status bar */
.ao-status { font-size: 11px; height: 16px; color: #5550aa; padding: 2px 0; transition: color 0.2s; }
.ao-status.ok  { color: #60c060; }
.ao-status.err { color: #c06060; }
`;
  function status(el, msg, cls) {
    el.textContent = msg;
    el.className = `ao-status ${cls}`;
    if (cls) setTimeout(() => {
      el.textContent = "";
      el.className = "ao-status";
    }, 2400);
  }
  function badge(doc, text) {
    const b = doc.createElement("span");
    b.className = "ao-badge";
    b.textContent = text;
    return b;
  }
  function note(doc, text) {
    const n = doc.createElement("div");
    n.className = "ao-note";
    n.textContent = text;
    return n;
  }
  function buildColorRow(doc, container, label, pref, def, st, cssTarget) {
    const row2 = doc.createElement("div");
    row2.className = "aoc-row";
    const lbl = doc.createElement("span");
    lbl.className = "aoc-label";
    lbl.textContent = label;
    if (cssTarget) lbl.appendChild(badge(doc, cssTarget));
    const cur = getPref(pref, def);
    const swatch = doc.createElement("div");
    swatch.className = "aoc-color-swatch";
    swatch.style.background = cur || def || "#555";
    const hexIn = doc.createElement("input");
    hexIn.type = "text";
    hexIn.className = "aoc-color-hex";
    hexIn.value = cur || def;
    hexIn.maxLength = 9;
    hexIn.placeholder = def;
    const sync = (hex) => {
      swatch.style.background = hex;
      hexIn.value = hex;
      setPref(pref, hex);
      status(st, "\u2713", "ok");
    };
    swatch.addEventListener("click", (e) => {
      e.stopPropagation();
      openColorPicker(swatch, hexIn.value || def, sync);
    });
    hexIn.addEventListener("change", () => {
      const v = hexIn.value.trim();
      sync(v.startsWith("#") ? v : `#${v}`);
    });
    row2.appendChild(lbl);
    row2.appendChild(swatch);
    row2.appendChild(hexIn);
    container.appendChild(row2);
  }
  var TEXT_COLOR_PREFS = [
    ["mod.aurora.color.panel_text", "Text panel\u016F (toolbar, sidebar, menu)", "#TabsToolbar toolbarbutton menuitem"],
    ["mod.aurora.color.tab_text", "Text z\xE1lo\u017Eek", ".tab-label .tab-text"],
    ["mod.aurora.color.urlbar_text", "Text URL li\u0161ty", "#urlbar-input"]
  ];
  function buildColors(doc, el, st) {
    buildSectionHeading(doc, el, "Akcent & Ohrani\u010Den\xED");
    buildColorRow(doc, el, "Akcent", "mod.aurora.color.accent", "#7c6af7", st, "--zen-primary-color");
    buildColorRow(doc, el, "Ohrani\u010Den\xED", "mod.aurora.color.border", "#3a3a5c", st, "v\u0161echny border");
    buildSectionHeading(doc, el, "Toolbar");
    buildColorRow(doc, el, "Pozad\xED toolbaru", "mod.aurora.color.toolbar_bg", "#16162a", st, "#navigator-toolbox");
    buildSectionHeading(doc, el, "Panely (nav bar \xB7 z\xE1lo\u017Ekov\xFD panel \xB7 menu)");
    buildColorRow(doc, el, "Pozad\xED panel\u016F", "mod.aurora.color.panel_bg", "#1a1a2e", st, "#TabsToolbar #nav-bar menupopup");
    buildColorRow(doc, el, "Tla\u010D\xEDtka aktivn\xED/checked", "mod.aurora.color.button_bg", "#2a2a4e", st, "toolbarbutton[checked]");
    buildColorRow(doc, el, "Tla\u010D\xEDtka hover", "mod.aurora.color.button_hover", "#3a3a6e", st, "toolbarbutton:hover menuitem:hover");
    buildSectionHeading(doc, el, "Sidebar");
    buildColorRow(doc, el, "Pozad\xED sidebaru", "mod.aurora.color.sidebar_bg", "#12122a", st, "#sidebar-box #zen-sidebar-top-buttons");
    buildSectionHeading(doc, el, "Workspace strip (lev\xFD panel se spaces)");
    buildColorRow(doc, el, "Pozad\xED stripu", "mod.aurora.color.workspace_strip_bg", "#0d0d1e", st, "#zen-appcontent-navbar");
    buildColorRow(doc, el, "Dot neaktivn\xED", "mod.aurora.color.workspace_dot", "#3a3a6c", st, ".zen-workspace-dot");
    buildColorRow(doc, el, "Dot aktivn\xED", "mod.aurora.color.workspace_dot_active", "#7c6af7", st, ".zen-workspace-dot[selected]");
    buildSectionHeading(doc, el, "Z\xE1lo\u017Eky (.tabbrowser-tab)");
    buildColorRow(doc, el, "Aktivn\xED z\xE1lo\u017Eka", "mod.aurora.color.tab_active_bg", "#2a2a4e", st, "[selected] .tab-background");
    buildColorRow(doc, el, "Neaktivn\xED z\xE1lo\u017Eka", "mod.aurora.color.tab_inactive_bg", "#1a1a2e", st, ".tab-background");
    buildColorRow(doc, el, "Hover z\xE1lo\u017Eky", "mod.aurora.color.tab_hover_bg", "#252550", st, ":hover .tab-background");
    buildColorRow(doc, el, "\u2715 tla\u010D\xEDtko hover", "mod.aurora.color.tab_close_hover", "#ff6b6b", st, ".tab-close-button:hover");
    buildSectionHeading(doc, el, "URL li\u0161ta (#urlbar)");
    buildColorRow(doc, el, "Pozad\xED", "mod.aurora.color.urlbar_bg", "#1e1e3a", st, "#urlbar-background");
    buildColorRow(doc, el, "Ohrani\u010Den\xED idle", "mod.aurora.color.urlbar_border", "#3a3a6c", st, "#urlbar border");
    buildColorRow(doc, el, "Ohrani\u010Den\xED focus", "mod.aurora.color.urlbar_focus", "#7c6af7", st, "#urlbar:focus-within");
    buildSectionHeading(doc, el, "Obsah prohl\xED\u017Ee\u010De");
    buildColorRow(doc, el, "Pozad\xED obsahu (#browser)", "mod.aurora.color.browser_bg", "#0f0f1a", st, "#browser");
    buildColorRow(doc, el, "V\xFDb\u011Br textu (::selection)", "mod.aurora.color.selection_bg", "#7c6af740", st, "::selection");
    buildColorRow(doc, el, "Scrollbar (thumb)", "mod.aurora.color.scrollbar", "#3a3a6c", st, "thumb");
    buildSectionHeading(doc, el, "Barvy textu");
    const masterDef = "#e0e0ff";
    const masterRow = doc.createElement("div");
    masterRow.className = "aoc-row";
    const masterLbl = doc.createElement("span");
    masterLbl.className = "aoc-label";
    masterLbl.textContent = "Barva v\u0161ech text\u016F";
    masterLbl.appendChild(badge(doc, "panely + z\xE1lo\u017Eky + urlbar"));
    const masterSwatch = doc.createElement("div");
    masterSwatch.className = "aoc-color-swatch";
    masterSwatch.style.background = getPref("mod.aurora.color.panel_text", masterDef);
    const masterHex = doc.createElement("input");
    masterHex.type = "text";
    masterHex.className = "aoc-color-hex";
    masterHex.value = getPref("mod.aurora.color.panel_text", masterDef);
    masterHex.maxLength = 9;
    const setAllText = (hex) => {
      masterSwatch.style.background = hex;
      masterHex.value = hex;
      for (const [p] of TEXT_COLOR_PREFS) setPref(p, hex);
      status(st, "\u2713 V\u0161echny texty nastaveny", "ok");
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
    expandBtn.style.cssText = "margin:6px 0;width:100%;justify-content:center;font-size:11px;";
    expandBtn.textContent = "\u25BC Nastavit ka\u017Ed\xFD text zvl\xE1\u0161\u0165";
    const indContainer = doc.createElement("div");
    indContainer.style.display = "none";
    let indBuilt = false, expanded = false;
    expandBtn.addEventListener("click", () => {
      expanded = !expanded;
      if (expanded && !indBuilt) {
        indBuilt = true;
        for (const [p, lbl, tgt] of TEXT_COLOR_PREFS)
          buildColorRow(doc, indContainer, lbl, p, masterDef, st, tgt);
      }
      indContainer.style.display = expanded ? "block" : "none";
      expandBtn.textContent = expanded ? "\u25B2 Skr\xFDt" : "\u25BC Nastavit ka\u017Ed\xFD text zvl\xE1\u0161\u0165";
    });
    el.appendChild(expandBtn);
    el.appendChild(indContainer);
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
        buildColorRow(doc, content, sc.label, spaceColorPref(i, sc.key), sc.default, st);
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
    const mode = getPref("mod.aurora.dynamic_mode", "off");
    const modeLabels = {
      off: "Dynamick\xFD motiv: Vypnut\xFD",
      material: "Material You \u2014 aktivn\xED",
      daynight: "Denn\xED cyklus \u2014 aktivn\xED",
      tab_accent: "Akcent z favikony \u2014 aktivn\xED"
    };
    txt.textContent = modeLabels[mode] ?? mode;
    if (mode !== "off") dot.classList.add("on");
    statBar.appendChild(dot);
    statBar.appendChild(txt);
    el.appendChild(statBar);
    buildSectionHeading(doc, el, "Re\u017Eim");
    buildSelect(doc, el, "Aktivn\xED re\u017Eim", "mod.aurora.dynamic_mode", [
      { label: "Vypnuto", value: "off" },
      { label: "Material You", value: "material" },
      { label: "Denn\xED cyklus", value: "daynight" },
      { label: "Akcent z favikony", value: "tab_accent" }
    ], "off", (v) => {
      dot.classList.toggle("on", v !== "off");
      txt.textContent = modeLabels[v] ?? v;
    });
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
      { label: "90 min", value: "90" }
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
      { label: "Bez (1\xD7)", value: "1.0" },
      { label: "M\xEDrn\xE9 (1.2\xD7)", value: "1.2" },
      { label: "V\xFDrazn\xE9 (1.5\xD7)", value: "1.5" },
      { label: "Maximum (2\xD7)", value: "2.0" }
    ], "1.2");
  }
  function buildBackground(doc, el, _st) {
    el.appendChild(note(doc, "Obr\xE1zek pozad\xED se zobrazuje za #browser::before. Pr\u016Fhlednost a blur panel\u016F nastav\xED\u0161 v sekci Efekty."));
    buildSectionHeading(doc, el, "Obr\xE1zek pozad\xED (#browser::before)");
    buildTextInput(doc, el, "URL obr\xE1zku", "mod.aurora.image.browser_bg", "https://...", "");
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
  }
  function buildLayout(doc, el, _st) {
    buildSectionHeading(doc, el, "Z\xE1lo\u017Eky (.tabbrowser-tab)");
    buildSlider(doc, el, "V\xFD\u0161ka z\xE1lo\u017Eky (min/max-height)", "mod.aurora.layout.tab_height", 20, 60, 1, "px", 36);
    buildSlider(doc, el, "Zaoblen\xED z\xE1lo\u017Eky (border-radius)", "mod.aurora.layout.tab_border_radius", 0, 20, 1, "px", 8);
    buildSectionHeading(doc, el, "Panely (#TabsToolbar \xB7 #nav-bar \xB7 #PersonalToolbar)");
    buildSlider(doc, el, "V\xFD\u0161ka panel\u016F (min-height)", "mod.aurora.layout.toolbar_height", 32, 64, 1, "px", 40);
    buildSectionHeading(doc, el, "Sidebar (#sidebar-box)");
    buildSlider(doc, el, "\u0160\xED\u0159ka sidebaru (min/max-width)", "mod.aurora.layout.sidebar_width", 120, 400, 4, "px", 200);
    buildSectionHeading(doc, el, "Workspace strip (#zen-appcontent-navbar)");
    buildSlider(doc, el, "\u0160\xED\u0159ka stripu (min/max-width)", "mod.aurora.layout.workspace_strip_width", 20, 80, 2, "px", 36);
    buildSectionHeading(doc, el, "Zaoblen\xED prvk\u016F");
    buildSlider(doc, el, "Zaoblen\xED panel\u016F / URL (#urlbar, menupopup)", "mod.aurora.layout.panel_border_radius", 0, 24, 1, "px", 8);
    buildSlider(doc, el, "Zaoblen\xED tla\u010D\xEDtek / polo\u017Eek menu", "mod.aurora.layout.button_border_radius", 0, 20, 1, "px", 6);
    buildSectionHeading(doc, el, "Ohrani\u010Den\xED");
    buildSlider(doc, el, "Tlou\u0161\u0165ka ohrani\u010Den\xED (border-width \u2014 v\u0161e)", "mod.aurora.layout.border_width", 0, 4, 1, "px", 1);
  }
  function buildEffects(doc, el, _st) {
    buildSectionHeading(doc, el, "Pr\u016Fhlednost panel\u016F");
    el.appendChild(note(doc, "Ovliv\u0148uje #navigator-toolbox, #sidebar-box, #zen-appcontent-navbar a menupopup. Blur = frosted glass efekt."));
    buildSlider(doc, el, "Pr\u016Fhlednost panel\u016F (panel-bg rgba alpha)", "mod.aurora.effect.panel_opacity", 0, 1, 0.05, "", 1);
    buildSlider(doc, el, "Blur panel\u016F (backdrop-filter: blur)", "mod.aurora.effect.panel_blur", 0, 30, 1, "px", 0);
    buildSectionHeading(doc, el, "St\xEDny a z\xE1\u0159e");
    buildToggle(doc, el, "St\xEDn aktivn\xED z\xE1lo\u017Eky (.tabbrowser-tab[selected])", "mod.aurora.effect.tab_shadow", false);
    buildToggle(doc, el, "Z\xE1\u0159e akcentu p\u0159i hoveru a na aktivn\xED z\xE1lo\u017Ece (glow)", "mod.aurora.effect.accent_glow", false);
    buildSectionHeading(doc, el, "Styl ohrani\u010Den\xED (border-style \u2014 v\u0161e)");
    buildSelect(doc, el, "Styl", "mod.aurora.effect.panel_border_style", [
      { label: "Pln\xE9 (solid)", value: "solid" },
      { label: "Te\u010Dky (dotted)", value: "dotted" },
      { label: "P\u0159eru\u0161ovan\xE9 (dashed)", value: "dashed" },
      { label: "\u017D\xE1dn\xE9 (none)", value: "none" }
    ], "solid");
    buildSectionHeading(doc, el, "Animace (CSS transitions \u2014 v\u0161e)");
    buildSelect(doc, el, "Rychlost (transition-duration)", "mod.aurora.animation_speed", [
      { label: "Vypnut\xE9 \u2014 \u017E\xE1dn\xE9 animace (0s)", value: "none" },
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
  function buildFontSounds(doc, el, _st) {
    buildSectionHeading(doc, el, "P\xEDsmo (font \u2014 z\xE1lo\u017Eky, panely, URL li\u0161ta)");
    buildTextInput(doc, el, "Rodina (font-family)", "mod.aurora.font.family", "system-ui, sans-serif", "inherit");
    buildSlider(doc, el, "Velikost (font-size)", "mod.aurora.font.size", 10, 20, 1, "px", 13);
    buildSelect(doc, el, "Tu\u010Dnost (font-weight)", "mod.aurora.font.weight", [
      { label: "300 \u2014 tenk\xE9", value: "300" },
      { label: "400 \u2014 norm\xE1ln\xED", value: "400" },
      { label: "500 \u2014 st\u0159edn\xED", value: "500" },
      { label: "600 \u2014 semibold", value: "600" },
      { label: "700 \u2014 tu\u010Dn\xE9", value: "700" }
    ], "400");
    buildSectionHeading(doc, el, "Zvukov\xE9 efekty kl\xE1vesnice");
    el.appendChild(note(doc, "Jemn\xE9 klik\xE1n\xED p\u0159i psan\xED do URL li\u0161ty. Vy\u017Eaduje restart prohl\xED\u017Ee\u010De."));
    buildToggle(doc, el, "Zapnout zvukov\xE9 efekty", "mod.aurora.sounds_enabled", false);
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
          status(st, `Na\u010Dten "${p.name}"`, "ok");
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
    buildSectionHeading(doc, el, "Ulo\u017Eit aktu\xE1ln\xED nastaven\xED");
    const saveRow = doc.createElement("div");
    saveRow.className = "ao-preset-save";
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
      status(st, `Ulo\u017Een "${n}"`, "ok");
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
    sub.textContent = "Kompletn\xED UI overhaul pro Zen Browser \xB7 v0.1.0 \xB7 Rockynio-dot";
    card.appendChild(t);
    card.appendChild(sub);
    el.appendChild(card);
    buildSectionHeading(doc, el, "CSS pokryt\xED \u2014 ovlivn\u011Bn\xE9 prvky");
    const grid = doc.createElement("div");
    grid.className = "ao-coverage-grid";
    for (const sel of [
      "#navigator-toolbox",
      "#TabsToolbar",
      "#PersonalToolbar",
      "#nav-bar",
      "#sidebar-box",
      "#zen-sidebar-top-buttons",
      "#zen-sidebar-top-buttons-customization-target",
      ".zen-sidebar-action-button",
      "#zen-appcontent-navbar",
      ".zen-workspace-dot",
      ".zen-workspace-button",
      ".tabbrowser-tab .tab-background",
      ".tab-label .tab-text",
      ".tab-close-button:hover",
      "#urlbar",
      "#urlbar-background",
      "#urlbar:focus-within",
      "#urlbar-input",
      "#browser",
      "#browser::before",
      "toolbarbutton",
      "toolbarbutton:hover",
      "toolbarbutton[checked]",
      "menupopup .panel-arrowcontainer",
      "menuitem menu",
      "menuseparator",
      "::selection",
      "thumb (scrollbar)"
    ]) {
      const item = doc.createElement("div");
      item.className = "ao-coverage-item";
      item.textContent = sel;
      grid.appendChild(item);
    }
    el.appendChild(grid);
    buildSectionHeading(doc, el, "Resetovat nastaven\xED");
    const resetColorsBtn = doc.createElement("button");
    resetColorsBtn.className = "ao-nav-btn danger";
    resetColorsBtn.style.cssText = "width:100%;margin-bottom:8px;";
    resetColorsBtn.textContent = "\u27F3  Reset v\u0161ech barev na v\xFDchoz\xED";
    resetColorsBtn.addEventListener("click", () => {
      if (!confirm("Opravdu resetovat v\u0161echny barvy? Tuto akci nelze vr\xE1tit.")) return;
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
      status(st, "Barvy resetov\xE1ny na v\xFDchoz\xED", "ok");
    });
    el.appendChild(resetColorsBtn);
    const resetAllBtn = doc.createElement("button");
    resetAllBtn.className = "ao-nav-btn danger";
    resetAllBtn.style.cssText = "width:100%;";
    resetAllBtn.textContent = "\u27F3  Reset VE\u0160KER\xDDCH nastaven\xED Aurora";
    resetAllBtn.addEventListener("click", () => {
      if (!confirm("Opravdu resetovat ve\u0161ker\xE1 nastaven\xED Aurora? Tuto akci nelze vr\xE1tit.")) return;
      for (const p of [...ALL_STRING_PREFS, ...ALL_BOOL_PREFS]) {
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
      status(st, "Ve\u0161ker\xE1 nastaven\xED resetov\xE1na", "ok");
    });
    el.appendChild(resetAllBtn);
  }
  var NAV_ITEMS = [
    { id: "colors", icon: "\u{1F3A8}", label: "Barvy" },
    { id: "spaces", icon: "\u{1F30C}", label: "Spaces" },
    { id: "dynamic", icon: "\u{1F305}", label: "Dynamika" },
    { id: "background", icon: "\u{1F5BC}\uFE0F", label: "Pozad\xED" },
    { id: "layout", icon: "\u{1F4D0}", label: "Rozm\u011Bry" },
    { id: "effects", icon: "\u2728", label: "Efekty" },
    { id: "typography", icon: "\u{1F524}", label: "P\xEDsmo & Zvuky" },
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
    typography: buildFontSounds,
    presets: buildPresets,
    about: buildAbout
  };
  function buildUI(doc) {
    const style = doc.createElement("style");
    style.textContent = CSS;
    doc.head.appendChild(style);
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
    const headerTitle = doc.createElement("div");
    headerTitle.className = "ao-header-title";
    const headerSub = doc.createElement("span");
    headerSub.className = "ao-header-sub";
    headerTitle.appendChild(doc.createTextNode("\u2726 Aurora"));
    headerTitle.appendChild(headerSub);
    const closeBtn = doc.createElement("button");
    closeBtn.className = "ao-header-close";
    closeBtn.textContent = "\u2715 Zav\u0159\xEDt  (Esc)";
    closeBtn.addEventListener("click", () => window.close());
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
    doc.body.appendChild(nav);
    doc.body.appendChild(main);
    const sections = {};
    const navEls = [];
    let activeId = "colors";
    function showSection(id) {
      sections[activeId]?.classList.remove("active");
      navEls.find((n) => n.dataset.id === activeId)?.classList.remove("active");
      if (!sections[id]) {
        const sec = doc.createElement("div");
        sec.className = "ao-section";
        sec.dataset.section = id;
        SECTION_BUILDERS[id](doc, sec, st);
        content.appendChild(sec);
        sections[id] = sec;
      }
      sections[id].classList.add("active");
      navEls.find((n) => n.dataset.id === id)?.classList.add("active");
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
      const lbl = doc.createElement("span");
      lbl.textContent = item.label;
      navItem.appendChild(icon);
      navItem.appendChild(lbl);
      navItem.addEventListener("click", () => showSection(item.id));
      nav.appendChild(navItem);
      navEls.push(navItem);
    }
    showSection("colors");
    doc.addEventListener("keydown", (e) => {
      if (e.key === "Escape") window.close();
    });
  }
  window._auroraSettings = true;
  buildUI(document);
})();

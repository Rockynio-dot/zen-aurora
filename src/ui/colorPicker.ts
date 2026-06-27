// Aurora inline HSV color picker — single shared popup instance

const PICKER_ID = "aurora-cp-popup";

const PRESETS = [
  "#ffffff","#d4d4d4","#a0a0a0","#6e6e6e","#3c3c3c","#1a1a1a","#0a0a0a","#000000",
  "#7c6af7","#a78bfa","#4d96ff","#60c6f7","#6bcb77","#ffd93d","#ff9f40","#ff6b6b",
  "#f472b6","#e879f9","#0f0f1a","#1a1a2e","#12122a","#16162a","#1e1e3a","#2a2a4e",
];

const PICKER_CSS = `
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

// ── Math helpers ──────────────────────────────────────────────────────────────

function hsvToHex(h: number, s: number, v: number): string {
  const c  = v * s;
  const x  = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m  = v - c;
  let r = 0, g = 0, b = 0;
  if      (h <  60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else              { r = c; b = x; }
  return "#" + [r + m, g + m, b + m]
    .map((n) => Math.round(n * 255).toString(16).padStart(2, "0"))
    .join("");
}

function hexToHsv(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").slice(0, 6);
  if (clean.length < 6) return [0, 0, 0.5];
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d   = max - min;
  let h     = 0;
  if (d > 0) {
    if      (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else                h = (r - g) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  return [h, max > 0 ? d / max : 0, max];
}

function hueColor(h: number): string {
  return `hsl(${h}, 100%, 50%)`;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

// ── Picker state ──────────────────────────────────────────────────────────────

let pickerH  = 220;
let pickerS  = 0.7;
let pickerV  = 0.9;

let onChangeCb: ((hex: string) => void) | null = null;
let squareDragging  = false;
let hueDragging     = false;

let squareEl:   HTMLElement | null = null;
let cursorEl:   HTMLElement | null = null;
let hueWrapEl:  HTMLElement | null = null;
let hueThumbEl: HTMLElement | null = null;
let hexInputEl: HTMLInputElement | null = null;
let previewEl:  HTMLElement | null = null;
let popupEl:    HTMLElement | null = null;

// ── UI update ─────────────────────────────────────────────────────────────────

function updateUI(): void {
  if (!squareEl || !cursorEl || !hueThumbEl || !hexInputEl || !previewEl) return;

  const hex  = hsvToHex(pickerH, pickerS, pickerV);
  const hCol = hueColor(pickerH);

  squareEl.style.setProperty("--acp-hue-color", hCol);
  cursorEl.style.left = `${pickerS * 100}%`;
  cursorEl.style.top  = `${(1 - pickerV) * 100}%`;

  hueWrapEl!.style.setProperty("--acp-hue-color", hCol);
  hueThumbEl.style.left = `${(pickerH / 360) * 100}%`;
  hueThumbEl.style.setProperty("--acp-hue-color", hCol);

  hexInputEl.value    = hex;
  previewEl.style.background = hex;

  // Mark active preset
  popupEl?.querySelectorAll<HTMLElement>(".aurora-cp-swatch").forEach((sw) => {
    sw.classList.toggle("selected", sw.dataset.color === hex);
  });
}

function emit(): void {
  const hex = hsvToHex(pickerH, pickerS, pickerV);
  onChangeCb?.(hex);
}

// ── Square drag ───────────────────────────────────────────────────────────────

function onSquarePointerDown(e: PointerEvent): void {
  squareDragging = true;
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  updateFromSquare(e);
}

function onSquarePointerMove(e: PointerEvent): void {
  if (!squareDragging || !squareEl) return;
  updateFromSquare(e);
}

function onSquarePointerUp(): void { squareDragging = false; }

function updateFromSquare(e: PointerEvent): void {
  if (!squareEl) return;
  const rect = squareEl.getBoundingClientRect();
  pickerS = clamp((e.clientX - rect.left) / rect.width,  0, 1);
  pickerV = clamp(1 - (e.clientY - rect.top)  / rect.height, 0, 1);
  updateUI();
  emit();
}

// ── Hue drag ──────────────────────────────────────────────────────────────────

function onHuePointerDown(e: PointerEvent): void {
  hueDragging = true;
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  updateFromHue(e);
}

function onHuePointerMove(e: PointerEvent): void {
  if (!hueDragging || !hueWrapEl) return;
  updateFromHue(e);
}

function onHuePointerUp(): void { hueDragging = false; }

function updateFromHue(e: PointerEvent): void {
  if (!hueWrapEl) return;
  const rect = hueWrapEl.getBoundingClientRect();
  pickerH = Math.round(clamp((e.clientX - rect.left) / rect.width, 0, 1) * 360);
  updateUI();
  emit();
}

// ── Hex input ─────────────────────────────────────────────────────────────────

function onHexChange(): void {
  if (!hexInputEl) return;
  const raw = hexInputEl.value.trim().replace(/^#/, "");
  if (/^[0-9a-f]{6}$/i.test(raw)) {
    const [h, s, v] = hexToHsv(`#${raw}`);
    pickerH = h; pickerS = s; pickerV = v;
    updateUI();
    emit();
  }
}

// ── Build popup (once) ────────────────────────────────────────────────────────

export function initColorPicker(doc: Document): void {
  if (doc.getElementById(PICKER_ID)) return;

  // Inject CSS
  const styleId = "aurora-cp-styles";
  if (!doc.getElementById(styleId)) {
    const s = doc.createElement("style");
    s.id    = styleId;
    s.textContent = PICKER_CSS;
    (doc.head ?? doc.documentElement).appendChild(s);
  }

  popupEl = doc.createElement("div");
  popupEl.id = PICKER_ID;

  // HSV Square
  const square = doc.createElement("div");
  square.className = "aurora-cp-square";
  const sqColor = doc.createElement("div"); sqColor.className = "aurora-cp-sq-color";
  const sqDark  = doc.createElement("div"); sqDark.className  = "aurora-cp-sq-dark";
  const cursor  = doc.createElement("div"); cursor.className  = "aurora-cp-cursor";
  square.appendChild(sqColor); square.appendChild(sqDark); square.appendChild(cursor);
  squareEl = square; cursorEl = cursor;

  square.addEventListener("pointerdown", onSquarePointerDown as EventListener);
  square.addEventListener("pointermove", onSquarePointerMove as EventListener);
  square.addEventListener("pointerup",   onSquarePointerUp);

  // Hue slider
  const hueWrap  = doc.createElement("div"); hueWrap.className  = "aurora-cp-hue-wrap";
  const hueThumb = doc.createElement("div"); hueThumb.className = "aurora-cp-hue-thumb";
  hueWrap.appendChild(hueThumb);
  hueWrapEl = hueWrap; hueThumbEl = hueThumb;

  hueWrap.addEventListener("pointerdown", onHuePointerDown as EventListener);
  hueWrap.addEventListener("pointermove", onHuePointerMove as EventListener);
  hueWrap.addEventListener("pointerup",   onHuePointerUp);

  // Presets
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
      pickerH = h; pickerS = s; pickerV = v;
      updateUI(); emit();
    });
    presetsGrid.appendChild(sw);
  }

  // Hex row
  const hexRow = doc.createElement("div"); hexRow.className = "aurora-cp-hex-row";
  const preview = doc.createElement("div"); preview.className = "aurora-cp-preview";
  const hexIn   = doc.createElement("input") as HTMLInputElement;
  hexIn.type  = "text";
  hexIn.className = "aurora-cp-hex-input";
  hexIn.maxLength = 7;
  hexIn.placeholder = "#rrggbb";
  hexIn.addEventListener("change", onHexChange);
  hexIn.addEventListener("keydown", (e) => { if (e.key === "Enter") onHexChange(); });
  const okBtn = doc.createElement("button");
  okBtn.textContent = "OK";
  okBtn.className = "aurora-cp-ok";
  okBtn.addEventListener("click", () => closeColorPicker());
  hexRow.appendChild(preview); hexRow.appendChild(hexIn); hexRow.appendChild(okBtn);
  previewEl = preview; hexInputEl = hexIn;

  popupEl.appendChild(square);
  popupEl.appendChild(hueWrap);
  popupEl.appendChild(presetsGrid);
  popupEl.appendChild(hexRow);

  doc.documentElement.appendChild(popupEl);

  // Close on outside click
  doc.addEventListener("pointerdown", (e) => {
    if (!popupEl?.classList.contains("open")) return;
    if (!popupEl.contains(e.target as Node)) closeColorPicker();
  }, { capture: true });
}

// ── Open / Close ──────────────────────────────────────────────────────────────

export function openColorPicker(
  anchorEl: HTMLElement,
  currentHex: string,
  onChange: (hex: string) => void
): void {
  if (!popupEl) return;

  onChangeCb = onChange;
  const [h, s, v] = hexToHsv(currentHex || "#7c6af7");
  pickerH = h; pickerS = s; pickerV = v;
  updateUI();

  const rect = anchorEl.getBoundingClientRect();
  let top  = rect.bottom + 6;
  let left = rect.left;

  // Keep inside viewport
  if (left + 240 > window.innerWidth)  left  = window.innerWidth  - 244;
  if (top  + 320 > window.innerHeight) top   = rect.top - 324;
  if (left < 4) left = 4;
  if (top  < 4) top  = 4;

  popupEl.style.top  = `${top}px`;
  popupEl.style.left = `${left}px`;
  popupEl.classList.add("open");
}

export function closeColorPicker(): void {
  popupEl?.classList.remove("open");
}

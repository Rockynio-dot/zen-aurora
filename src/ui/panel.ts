import { GLOBAL_COLORS, SPACE_COLORS, SPACE_COUNT, spaceColorPref } from "./colorDefs.ts";
import { allColorPrefs } from "./colorDefs.ts";

// ── IDs ───────────────────────────────────────────────────────────────────────

const PANEL_ID   = "aurora-ui-panel";
const BTN_ID     = "aurora-ui-fab";
const STYLES_ID  = "aurora-ui-styles";

// ── Panel CSS ─────────────────────────────────────────────────────────────────

const PANEL_CSS = `
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

// ── Pref helpers ──────────────────────────────────────────────────────────────

function getPref(pref: string, def = ""): string {
  try { return Services.prefs.getStringPref(pref, def); } catch { return def; }
}

function setPref(pref: string, value: string): void {
  try { Services.prefs.setStringPref(pref, value); } catch { /* ignore */ }
}

// ── Hex normalisation ─────────────────────────────────────────────────────────

function toHex6(v: string): string {
  const s = v.trim().replace(/^#/, "");
  if (/^[0-9a-f]{6}$/i.test(s)) return `#${s.toLowerCase()}`;
  if (/^[0-9a-f]{3}$/i.test(s)) {
    const [a,b,c] = s.split(""); return `#${a}${a}${b}${b}${c}${c}`.toLowerCase();
  }
  return v;
}

// Input[type=color] only accepts #rrggbb; strip alpha if present
function toPickerHex(v: string): string {
  const cleaned = toHex6(v);
  if (/^#[0-9a-f]{6}$/i.test(cleaned)) return cleaned;
  return "#000000";
}

// ── Build color rows ──────────────────────────────────────────────────────────

function buildColorRow(
  label: string,
  pref: string,
  defaultVal: string,
  container: HTMLElement,
  status: HTMLElement
): void {
  const row = container.ownerDocument.createElement("div");
  row.className = "aurora-color-row";

  const lbl = container.ownerDocument.createElement("span");
  lbl.className = "aurora-color-label";
  lbl.textContent = label;

  const current = getPref(pref, defaultVal);

  const picker = container.ownerDocument.createElement("input") as HTMLInputElement;
  picker.type = "color";
  picker.className = "aurora-color-picker";
  picker.value = toPickerHex(current);

  const hex = container.ownerDocument.createElement("input") as HTMLInputElement;
  hex.type = "text";
  hex.className = "aurora-color-hex";
  hex.value = current || defaultVal;
  hex.maxLength = 9;
  hex.placeholder = defaultVal || "#000000";

  picker.addEventListener("input", () => {
    hex.value = picker.value;
    setPref(pref, picker.value);
    showStatus(status, "Uloženo", "ok");
  });

  hex.addEventListener("change", () => {
    const val = hex.value.trim();
    const norm = toHex6(val);
    hex.value = norm;
    picker.value = toPickerHex(norm);
    setPref(pref, norm);
    showStatus(status, "Uloženo", "ok");
  });

  row.appendChild(lbl);
  row.appendChild(picker);
  row.appendChild(hex);
  container.appendChild(row);
}

function showStatus(el: HTMLElement, msg: string, cls: "ok" | "err" | ""): void {
  el.textContent = msg;
  el.className = `aurora-status-bar ${cls}`;
  if (cls) {
    setTimeout(() => { el.textContent = ""; el.className = "aurora-status-bar"; }, 2000);
  }
}

// ── Build panel DOM ───────────────────────────────────────────────────────────

function buildPanel(doc: Document): HTMLElement {
  const panel = doc.createElement("div");
  panel.id = PANEL_ID;

  // Header
  const header = doc.createElement("div");
  header.className = "aurora-panel-header";
  const title = doc.createElement("span");
  title.className = "aurora-panel-title";
  title.textContent = "✦ Aurora — Nastavení barev";
  const closeBtn = doc.createElement("button");
  closeBtn.className = "aurora-panel-close";
  closeBtn.textContent = "✕";
  closeBtn.title = "Zavřít";
  closeBtn.addEventListener("click", () => togglePanel(doc));
  header.appendChild(title);
  header.appendChild(closeBtn);
  panel.appendChild(header);

  // Action buttons
  const actions = doc.createElement("div");
  actions.className = "aurora-panel-actions";

  const statusBar = doc.createElement("div");
  statusBar.className = "aurora-status-bar";

  const resetBtn = doc.createElement("button");
  resetBtn.className = "aurora-action-btn danger";
  resetBtn.textContent = "⟳  Reset na výchozí";
  resetBtn.addEventListener("click", () => resetColors(doc, statusBar));

  const importBtn = doc.createElement("button");
  importBtn.className = "aurora-action-btn";
  importBtn.textContent = "📂  Načíst .txt";
  importBtn.addEventListener("click", () => importFromTxt(doc, panel, statusBar));

  const exportBtn = doc.createElement("button");
  exportBtn.className = "aurora-action-btn";
  exportBtn.textContent = "💾  Uložit .txt";
  exportBtn.addEventListener("click", () => exportToTxt(doc, statusBar));

  actions.appendChild(resetBtn);
  actions.appendChild(importBtn);
  actions.appendChild(exportBtn);
  panel.appendChild(actions);

  // Tab bar
  const tabBar = doc.createElement("div");
  tabBar.className = "aurora-tab-bar";
  panel.appendChild(tabBar);

  // Content
  const content = doc.createElement("div");
  content.className = "aurora-panel-content";
  content.appendChild(statusBar);
  panel.appendChild(content);

  // Tab: Globální barvy
  const globalTab = makeTab(doc, tabBar, "Globální barvy", true);
  const globalContent = makeTabContent(doc, content, true);
  buildGlobalColors(doc, globalContent, statusBar);

  // Tabs: Space 1-6
  for (let i = 0; i < SPACE_COUNT; i++) {
    const spaceTab = makeTab(doc, tabBar, `Space ${i + 1}`, false);
    const spaceContent = makeTabContent(doc, content, false);
    buildSpaceColors(doc, spaceContent, i, statusBar);
  }

  // Tab click logic
  const tabs = tabBar.querySelectorAll<HTMLButtonElement>(".aurora-tab");
  const contents = content.querySelectorAll<HTMLDivElement>(".aurora-tab-content");
  tabBar.addEventListener("click", (e) => {
    const clicked = (e.target as HTMLElement).closest<HTMLButtonElement>(".aurora-tab");
    if (!clicked) return;
    const idx = Array.from(tabs).indexOf(clicked);
    tabs.forEach((t, ti) => t.classList.toggle("active", ti === idx));
    contents.forEach((c, ci) => c.classList.toggle("active", ci === idx));
  });

  return panel;
}

function makeTab(doc: Document, bar: HTMLElement, label: string, active: boolean): HTMLButtonElement {
  const btn = doc.createElement("button");
  btn.className = "aurora-tab" + (active ? " active" : "");
  btn.textContent = label;
  bar.appendChild(btn);
  return btn;
}

function makeTabContent(doc: Document, container: HTMLElement, active: boolean): HTMLDivElement {
  const div = doc.createElement("div");
  div.className = "aurora-tab-content" + (active ? " active" : "");
  container.appendChild(div);
  return div;
}

function buildGlobalColors(doc: Document, container: HTMLElement, status: HTMLElement): void {
  const sections: [string, string[]][] = [
    ["Panely & Sidebar", ["panel_bg","toolbar_bg","sidebar_bg","panel_text","border","accent"]],
    ["Záložky", ["tab_active_bg","tab_inactive_bg","tab_text","tab_close_hover","tab_hover_bg"]],
    ["URL lišta", ["urlbar_bg","urlbar_text","urlbar_border","urlbar_focus"]],
    ["Obsah & Ostatní", ["browser_bg","selection_bg","scrollbar","button_bg","button_hover"]],
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

function buildSpaceColors(doc: Document, container: HTMLElement, spaceIdx: number, status: HTMLElement): void {
  const note = doc.createElement("div");
  note.className = "aurora-space-note";
  note.textContent =
    `Barvy pro Space ${spaceIdx + 1}. Prázdné pole = použije se globální barva. ` +
    `Pořadí odpovídá pořadí spaces v sidebaru.`;
  container.appendChild(note);

  for (const sc of SPACE_COLORS) {
    const pref = spaceColorPref(spaceIdx, sc.key);
    buildColorRow(sc.label, pref, sc.default, container, status);
  }
}

// ── Reset ─────────────────────────────────────────────────────────────────────

function resetColors(doc: Document, status: HTMLElement): void {
  // Global colors → back to defaults
  for (const field of GLOBAL_COLORS) {
    try { Services.prefs.setStringPref(field.pref, field.default); } catch { /* */ }
  }
  // Space colors → clear (empty = use global)
  for (let i = 0; i < SPACE_COUNT; i++) {
    for (const sc of SPACE_COLORS) {
      try { Services.prefs.clearUserPref(spaceColorPref(i, sc.key)); } catch { /* */ }
    }
  }

  // Refresh all inputs in panel
  const panel = doc.getElementById(PANEL_ID);
  if (panel) {
    panel.querySelectorAll<HTMLInputElement>(".aurora-color-picker").forEach((picker) => {
      const row = picker.closest(".aurora-color-row");
      if (!row) return;
      const hexInput = row.querySelector<HTMLInputElement>(".aurora-color-hex");
      if (!hexInput) return;
      const label = row.querySelector(".aurora-color-label")?.textContent ?? "";
      const field = GLOBAL_COLORS.find((f) => f.label === label);
      const def = field?.default ?? "#000000";
      picker.value = toPickerHex(def);
      hexInput.value = def;
    });
  }

  showStatus(status, "Resetováno na výchozí hodnoty", "ok");
}

// ── Export to .txt ────────────────────────────────────────────────────────────

function exportToTxt(doc: Document, status: HTMLElement): void {
  const lines: string[] = [
    "# Aurora Theme Export",
    `# Vytvořeno: ${new Date().toLocaleString("cs-CZ")}`,
    "",
    "# == Globální barvy ==",
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
    const url  = URL.createObjectURL(blob);
    const a    = doc.createElement("a") as HTMLAnchorElement;
    a.href     = url;
    a.download = `aurora-theme-${Date.now()}.txt`;
    doc.body.appendChild(a);
    a.click();
    doc.body.removeChild(a);
    URL.revokeObjectURL(url);
    showStatus(status, "Soubor stažen", "ok");
  } catch (e) {
    showStatus(status, `Chyba exportu: ${e}`, "err");
  }
}

// ── Import from .txt ──────────────────────────────────────────────────────────

function importFromTxt(doc: Document, panel: HTMLElement, status: HTMLElement): void {
  const input = doc.createElement("input") as HTMLInputElement;
  input.type   = "file";
  input.accept = ".txt,text/plain";
  input.style.display = "none";

  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      let applied = 0;
      let errors  = 0;

      for (const rawLine of text.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith("#")) continue;

        const eq = line.indexOf("=");
        if (eq < 0) continue;

        const pref = line.slice(0, eq).trim();
        const val  = line.slice(eq + 1).trim();

        // Only accept our own prefs
        if (!pref.startsWith("mod.aurora.")) { errors++; continue; }

        try {
          Services.prefs.setStringPref(pref, val);
          applied++;
        } catch { errors++; }
      }

      // Refresh visible inputs
      panel.querySelectorAll<HTMLInputElement>(".aurora-color-hex").forEach((hexIn) => {
        const row = hexIn.closest(".aurora-color-row");
        if (!row) return;
        const picker = row.querySelector<HTMLInputElement>(".aurora-color-picker");
        const labelEl = row.querySelector(".aurora-color-label");
        if (!picker || !labelEl) return;

        const field = GLOBAL_COLORS.find((f) => f.label === labelEl.textContent);
        if (!field) return;
        const newVal = getPref(field.pref, field.default);
        hexIn.value  = newVal;
        picker.value = toPickerHex(newVal);
      });

      const msg = errors > 0
        ? `Načteno ${applied} hodnot, ${errors} přeskočeno`
        : `Načteno ${applied} hodnot`;
      showStatus(status, msg, applied > 0 ? "ok" : "err");
    };

    reader.readAsText(file);
  });

  doc.body.appendChild(input);
  input.click();
  // Clean up after dialog closes
  setTimeout(() => input.remove(), 30_000);
}

// ── Toggle ────────────────────────────────────────────────────────────────────

function togglePanel(doc: Document): void {
  const panel = doc.getElementById(PANEL_ID);
  if (!panel) return;
  panel.classList.toggle("aurora-open");
}

// ── Public init ───────────────────────────────────────────────────────────────

export function initPanel(doc: Document): () => void {
  // Inject styles
  let styleEl = doc.getElementById(STYLES_ID) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = doc.createElement("style") as HTMLStyleElement;
    styleEl.id = STYLES_ID;
    (doc.head ?? doc.documentElement).appendChild(styleEl);
  }
  styleEl.textContent = PANEL_CSS;

  // FAB button
  let fab = doc.getElementById(BTN_ID) as HTMLButtonElement | null;
  if (!fab) {
    fab = doc.createElement("button") as HTMLButtonElement;
    fab.id = BTN_ID;
    fab.title = "Aurora — nastavení barev";
    fab.textContent = "✦";
    fab.addEventListener("click", () => togglePanel(doc));
    doc.documentElement.appendChild(fab);
  }

  // Panel
  let panel = doc.getElementById(PANEL_ID);
  if (!panel) {
    panel = buildPanel(doc);
    doc.documentElement.appendChild(panel);
  }

  // Keyboard shortcut: Ctrl+Shift+A
  const onKey = (e: KeyboardEvent) => {
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

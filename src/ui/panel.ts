import { GLOBAL_COLORS, SPACE_COLORS, SPACE_COUNT, spaceColorPref } from "./colorDefs.ts";
import { initColorPicker, openColorPicker } from "./colorPicker.ts";

const PANEL_ID  = "aurora-ui-panel";
const BTN_ID    = "aurora-ui-fab";
const STYLES_ID = "aurora-ui-styles";

// ── Panel CSS ─────────────────────────────────────────────────────────────────

const PANEL_CSS = `
#aurora-ui-fab {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 2147483640;
  width: 40px; height: 40px;
  border-radius: 50%;
  background: #7c6af7;
  color: #fff;
  font-size: 18px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 16px #7c6af766;
  display: flex; align-items: center; justify-content: center;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
#aurora-ui-fab:hover { transform: scale(1.1); box-shadow: 0 6px 20px #7c6af799; }

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

// ── Pref helpers ──────────────────────────────────────────────────────────────

function getPref(pref: string, def = ""): string {
  try { return Services.prefs.getStringPref(pref, def); } catch { return def; }
}

function setPref(pref: string, value: string): void {
  try { Services.prefs.setStringPref(pref, value); } catch { /**/ }
}

function showStatus(el: HTMLElement, msg: string, cls: "ok" | "err" | ""): void {
  el.textContent = msg;
  el.className = `aurora-status ${cls}`;
  if (cls) setTimeout(() => { el.textContent = ""; el.className = "aurora-status"; }, 2200);
}

// ── Color row builder ─────────────────────────────────────────────────────────

function buildColorRow(
  label: string,
  pref: string,
  defaultVal: string,
  container: HTMLElement,
  status: HTMLElement
): void {
  const doc     = container.ownerDocument;
  const current = getPref(pref, defaultVal);

  const row = doc.createElement("div");
  row.className = "aurora-cr";

  const lbl = doc.createElement("span");
  lbl.className = "aurora-cr-label";
  lbl.textContent = label;

  // Color swatch (click to open picker)
  const swatch = doc.createElement("div") as HTMLElement;
  swatch.className = "aurora-cr-swatch";
  swatch.style.background = current || defaultVal || "#000";
  swatch.title = "Klikni pro výběr barvy";

  // Hex text input
  const hexIn = doc.createElement("input") as HTMLInputElement;
  hexIn.type = "text";
  hexIn.className = "aurora-cr-hex";
  hexIn.value = current || defaultVal;
  hexIn.maxLength = 9;
  hexIn.placeholder = defaultVal || "#000000";

  const syncFromHex = (val: string) => {
    swatch.style.background = val;
    setPref(pref, val);
    showStatus(status, "Uloženo", "ok");
  };

  // Open picker on swatch click
  swatch.addEventListener("click", (e) => {
    e.stopPropagation();
    openColorPicker(swatch, hexIn.value || defaultVal || "#7c6af7", (hex) => {
      hexIn.value = hex;
      syncFromHex(hex);
    });
  });

  // Manual hex input
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

// ── Section / Tab helpers ─────────────────────────────────────────────────────

function secLabel(doc: Document, container: HTMLElement, text: string): void {
  const el = doc.createElement("div");
  el.className = "aurora-sec-label";
  el.textContent = text;
  container.appendChild(el);
}

function buildGlobalColors(doc: Document, container: HTMLElement, status: HTMLElement): void {
  const sections: [string, string[]][] = [
    ["Panely & Sidebar", ["panel_bg","toolbar_bg","sidebar_bg","panel_text","border","accent"]],
    ["Záložky", ["tab_active_bg","tab_inactive_bg","tab_text","tab_close_hover","tab_hover_bg"]],
    ["URL lišta", ["urlbar_bg","urlbar_text","urlbar_border","urlbar_focus"]],
    ["Obsah & Ostatní", ["browser_bg","selection_bg","scrollbar","button_bg","button_hover"]],
  ];
  for (const [sec, keys] of sections) {
    secLabel(doc, container, sec);
    for (const key of keys) {
      const field = GLOBAL_COLORS.find((c) => c.pref.endsWith(`.${key}`));
      if (field) buildColorRow(field.label, field.pref, field.default, container, status);
    }
  }
}

function buildSpaceColors(
  doc: Document, container: HTMLElement, idx: number, status: HTMLElement
): void {
  const note = doc.createElement("div");
  note.className = "aurora-space-note";
  note.textContent = `Barvy pro Space ${idx + 1}. Prázdné = použije se globální barva.`;
  container.appendChild(note);

  for (const sc of SPACE_COLORS) {
    buildColorRow(sc.label, spaceColorPref(idx, sc.key), sc.default, container, status);
  }
}

// ── Reset ─────────────────────────────────────────────────────────────────────

function resetColors(doc: Document, panel: HTMLElement, status: HTMLElement): void {
  for (const f of GLOBAL_COLORS) {
    try { Services.prefs.setStringPref(f.pref, f.default); } catch { /**/ }
  }
  for (let i = 0; i < SPACE_COUNT; i++) {
    for (const sc of SPACE_COLORS) {
      try { Services.prefs.clearUserPref(spaceColorPref(i, sc.key)); } catch { /**/ }
    }
  }

  // Refresh swatches + hex inputs
  panel.querySelectorAll<HTMLElement>(".aurora-cr").forEach((row) => {
    const labelEl  = row.querySelector<HTMLElement>(".aurora-cr-label");
    const swatch   = row.querySelector<HTMLElement>(".aurora-cr-swatch");
    const hexInput = row.querySelector<HTMLInputElement>(".aurora-cr-hex");
    if (!labelEl || !swatch || !hexInput) return;
    const field = GLOBAL_COLORS.find((f) => f.label === labelEl.textContent);
    if (!field) return;
    swatch.style.background = field.default;
    hexInput.value = field.default;
  });

  showStatus(status, "Resetováno na výchozí hodnoty", "ok");
}

// ── Export / Import ───────────────────────────────────────────────────────────

function exportToTxt(doc: Document, status: HTMLElement): void {
  const lines = [`# Aurora Theme Export`, `# ${new Date().toLocaleString("cs-CZ")}`, ""];
  lines.push("# == Globální barvy ==");
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
    const url  = URL.createObjectURL(blob);
    const a    = doc.createElement("a") as HTMLAnchorElement;
    a.href = url; a.download = `aurora-theme-${Date.now()}.txt`;
    doc.body.appendChild(a); a.click(); doc.body.removeChild(a);
    URL.revokeObjectURL(url);
    showStatus(status, "Soubor stažen", "ok");
  } catch (e) { showStatus(status, `Chyba: ${e}`, "err"); }
}

function importFromTxt(
  doc: Document, panel: HTMLElement, status: HTMLElement
): void {
  const input = doc.createElement("input") as HTMLInputElement;
  input.type = "file"; input.accept = ".txt,text/plain";
  input.style.display = "none";
  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      let applied = 0, errors = 0;
      const text = e.target?.result as string;
      for (const rawLine of text.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith("#")) continue;
        const eq = line.indexOf("=");
        if (eq < 0) continue;
        const pref = line.slice(0, eq).trim();
        const val  = line.slice(eq + 1).trim();
        if (!pref.startsWith("mod.aurora.")) { errors++; continue; }
        try { Services.prefs.setStringPref(pref, val); applied++; } catch { errors++; }
      }
      // Refresh visible swatches
      panel.querySelectorAll<HTMLElement>(".aurora-cr").forEach((row) => {
        const labelEl  = row.querySelector<HTMLElement>(".aurora-cr-label");
        const swatch   = row.querySelector<HTMLElement>(".aurora-cr-swatch");
        const hexInput = row.querySelector<HTMLInputElement>(".aurora-cr-hex");
        if (!labelEl || !swatch || !hexInput) return;
        const field = GLOBAL_COLORS.find((f) => f.label === labelEl.textContent);
        if (!field) return;
        const newVal = getPref(field.pref, field.default);
        swatch.style.background = newVal; hexInput.value = newVal;
      });
      showStatus(status,
        errors > 0 ? `Načteno ${applied}, přeskočeno ${errors}` : `Načteno ${applied} hodnot`,
        applied > 0 ? "ok" : "err");
    };
    reader.readAsText(file);
  });
  doc.body.appendChild(input); input.click();
  setTimeout(() => input.remove(), 30_000);
}

// ── Build panel DOM ───────────────────────────────────────────────────────────

function buildPanel(doc: Document): HTMLElement {
  const panel = doc.createElement("div");
  panel.id = PANEL_ID;

  // Header
  const hdr = doc.createElement("div"); hdr.className = "aurora-ph";
  const title = doc.createElement("span"); title.className = "aurora-ph-title";
  title.textContent = "✦ Aurora — Barvy";
  const closeBtn = doc.createElement("button"); closeBtn.className = "aurora-ph-close";
  closeBtn.textContent = "✕"; closeBtn.title = "Zavřít";
  closeBtn.addEventListener("click", () => togglePanel(doc));
  hdr.appendChild(title); hdr.appendChild(closeBtn);
  panel.appendChild(hdr);

  // Status bar (shared, above actions)
  const status = doc.createElement("div"); status.className = "aurora-status";

  // Action buttons
  const acts = doc.createElement("div"); acts.className = "aurora-actions";
  const resetBtn = doc.createElement("button"); resetBtn.className = "aurora-abtn danger";
  resetBtn.textContent = "⟳  Reset";
  const importBtn = doc.createElement("button"); importBtn.className = "aurora-abtn";
  importBtn.textContent = "📂  Načíst .txt";
  const exportBtn = doc.createElement("button"); exportBtn.className = "aurora-abtn";
  exportBtn.textContent = "💾  Uložit .txt";
  acts.appendChild(resetBtn); acts.appendChild(importBtn); acts.appendChild(exportBtn);
  panel.appendChild(acts);
  panel.appendChild(status);

  // Tab bar
  const tabBar = doc.createElement("div"); tabBar.className = "aurora-tab-bar";
  panel.appendChild(tabBar);

  // Scrollable content area
  const pc = doc.createElement("div"); pc.className = "aurora-pc";
  panel.appendChild(pc);

  // Global colors tab
  makeTab(doc, tabBar, "Globální barvy", true);
  const globalContent = makeTabContent(doc, pc, true);
  buildGlobalColors(doc, globalContent, status);

  // Space tabs
  for (let i = 0; i < SPACE_COUNT; i++) {
    makeTab(doc, tabBar, `Space ${i + 1}`, false);
    const sc = makeTabContent(doc, pc, false);
    buildSpaceColors(doc, sc, i, status);
  }

  // Tab switching
  const tabs = tabBar.querySelectorAll<HTMLButtonElement>(".aurora-tab");
  const contents = pc.querySelectorAll<HTMLDivElement>(".aurora-tab-content");
  tabBar.addEventListener("click", (e) => {
    const t = (e.target as HTMLElement).closest<HTMLButtonElement>(".aurora-tab");
    if (!t) return;
    const idx = Array.from(tabs).indexOf(t);
    tabs.forEach((tb, ti) => tb.classList.toggle("active", ti === idx));
    contents.forEach((ct, ci) => ct.classList.toggle("active", ci === idx));
  });

  // Wire actions
  resetBtn.addEventListener("click", () => resetColors(doc, panel, status));
  importBtn.addEventListener("click", () => importFromTxt(doc, panel, status));
  exportBtn.addEventListener("click", () => exportToTxt(doc, status));

  return panel;
}

function makeTab(doc: Document, bar: HTMLElement, label: string, active: boolean): void {
  const btn = doc.createElement("button");
  btn.className = "aurora-tab" + (active ? " active" : "");
  btn.textContent = label;
  bar.appendChild(btn);
}

function makeTabContent(doc: Document, container: HTMLElement, active: boolean): HTMLDivElement {
  const div = doc.createElement("div");
  div.className = "aurora-tab-content" + (active ? " active" : "");
  container.appendChild(div);
  return div;
}

// ── Toggle ────────────────────────────────────────────────────────────────────

function togglePanel(doc: Document): void {
  doc.getElementById(PANEL_ID)?.classList.toggle("aurora-open");
}

// ── Public init ───────────────────────────────────────────────────────────────

export function initPanel(doc: Document): () => void {
  // Panel styles
  let styleEl = doc.getElementById(STYLES_ID) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = doc.createElement("style") as HTMLStyleElement;
    styleEl.id = STYLES_ID;
    (doc.head ?? doc.documentElement).appendChild(styleEl);
  }
  styleEl.textContent = PANEL_CSS;

  // Init the shared color picker widget
  initColorPicker(doc);

  // FAB
  let fab = doc.getElementById(BTN_ID) as HTMLButtonElement | null;
  if (!fab) {
    fab = doc.createElement("button") as HTMLButtonElement;
    fab.id = BTN_ID; fab.title = "Aurora — nastavení barev";
    fab.textContent = "✦";
    fab.addEventListener("click", () => togglePanel(doc));
    doc.documentElement.appendChild(fab);
  }

  // Panel
  if (!doc.getElementById(PANEL_ID)) {
    doc.documentElement.appendChild(buildPanel(doc));
  }

  // Ctrl+Shift+A shortcut
  const onKey = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.shiftKey && e.key === "A") { e.preventDefault(); togglePanel(doc); }
  };
  doc.addEventListener("keydown", onKey, { capture: true });

  return () => {
    doc.getElementById(PANEL_ID)?.remove();
    doc.getElementById(BTN_ID)?.remove();
    doc.getElementById(STYLES_ID)?.remove();
    doc.getElementById("aurora-cp-popup")?.remove();
    doc.getElementById("aurora-cp-styles")?.remove();
    doc.removeEventListener("keydown", onKey, true);
  };
}

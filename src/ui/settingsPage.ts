// Runs inside chrome://aurora/content/settings.html — full chrome privileges
import { GLOBAL_COLORS, SPACE_COLORS, SPACE_COUNT, spaceColorPref } from "./colorDefs.ts";
import { initColorPicker, openColorPicker } from "./colorPicker.ts";
import {
  getPref, getBoolPref, setPref, setBoolPref,
  buildToggle, buildSlider, buildSelect, buildTextInput, buildSectionHeading,
} from "./controls.ts";

// ── CSS ───────────────────────────────────────────────────────────────────────

const CSS = `
*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0; padding: 0;
  display: flex; height: 100vh; overflow: hidden;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 13px; color: #e0e0ff;
  background: #10102a;
}

/* ── Left nav ── */
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

/* ── Main ── */
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

/* ── Controls ── */
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

/* Status */
.ao-status { font-size: 11px; height: 16px; color: #5550aa; padding: 2px 0; transition: color 0.2s; }
.ao-status.ok { color: #60c060; }
.ao-status.err { color: #c06060; }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────

function status(el: HTMLElement, msg: string, cls: "ok" | "err" | ""): void {
  el.textContent = msg; el.className = `ao-status ${cls}`;
  if (cls) setTimeout(() => { el.textContent = ""; el.className = "ao-status"; }, 2200);
}

// ── Color row ─────────────────────────────────────────────────────────────────

function buildColorRow(
  doc: Document, container: HTMLElement,
  label: string, pref: string, def: string, st: HTMLElement
): void {
  const row = doc.createElement("div"); row.className = "aoc-row";
  const lbl = doc.createElement("span"); lbl.className = "aoc-label"; lbl.textContent = label;
  const cur = getPref(pref, def);
  const swatch = doc.createElement("div"); swatch.className = "aoc-color-swatch";
  swatch.style.background = cur || def || "#555";
  const hexIn = doc.createElement("input") as HTMLInputElement;
  hexIn.type = "text"; hexIn.className = "aoc-color-hex";
  hexIn.value = cur || def; hexIn.maxLength = 9; hexIn.placeholder = def;

  const sync = (hex: string) => {
    swatch.style.background = hex; hexIn.value = hex;
    setPref(pref, hex); status(st, "✓", "ok");
  };
  swatch.addEventListener("click", (e) => { e.stopPropagation(); openColorPicker(swatch, hexIn.value || def, sync); });
  hexIn.addEventListener("change", () => {
    const v = hexIn.value.trim(); sync(v.startsWith("#") ? v : `#${v}`);
  });
  row.appendChild(lbl); row.appendChild(swatch); row.appendChild(hexIn);
  container.appendChild(row);
}

// ── Text color prefs ──────────────────────────────────────────────────────────

const TEXT_COLOR_PREFS = [
  "mod.aurora.color.panel_text",
  "mod.aurora.color.tab_text",
  "mod.aurora.color.urlbar_text",
];

// ── Section builders ──────────────────────────────────────────────────────────

function buildColors(doc: Document, el: HTMLElement, st: HTMLElement): void {
  const groups: [string, string[]][] = [
    ["Panely & Sidebar", ["panel_bg","toolbar_bg","sidebar_bg","border","accent"]],
    ["Workspace strip",  ["workspace_strip_bg","workspace_dot","workspace_dot_active"]],
    ["Záložky",          ["tab_active_bg","tab_inactive_bg","tab_close_hover","tab_hover_bg"]],
    ["URL lišta",        ["urlbar_bg","urlbar_border","urlbar_focus"]],
    ["Obsah & Ostatní",  ["browser_bg","selection_bg","scrollbar","button_bg","button_hover"]],
  ];
  for (const [heading, keys] of groups) {
    buildSectionHeading(doc, el, heading);
    for (const key of keys) {
      const f = GLOBAL_COLORS.find(c => c.pref.endsWith(`.${key}`));
      if (f) buildColorRow(doc, el, f.label, f.pref, f.default, st);
    }
  }

  buildSectionHeading(doc, el, "Barvy textu");

  const masterDef = "#e0e0ff";
  const masterCur = getPref("mod.aurora.color.panel_text", masterDef);
  const masterRow = doc.createElement("div"); masterRow.className = "aoc-row";
  const masterLbl = doc.createElement("span"); masterLbl.className = "aoc-label"; masterLbl.textContent = "Barva všech textů";
  const masterSwatch = doc.createElement("div"); masterSwatch.className = "aoc-color-swatch";
  masterSwatch.style.background = masterCur;
  const masterHex = doc.createElement("input") as HTMLInputElement;
  masterHex.type = "text"; masterHex.className = "aoc-color-hex";
  masterHex.value = masterCur; masterHex.maxLength = 9;

  const setAllText = (hex: string) => {
    masterSwatch.style.background = hex; masterHex.value = hex;
    for (const p of TEXT_COLOR_PREFS) setPref(p, hex);
    status(st, "✓ Text nastaven", "ok");
  };
  masterSwatch.addEventListener("click", (e) => { e.stopPropagation(); openColorPicker(masterSwatch, masterHex.value || masterDef, setAllText); });
  masterHex.addEventListener("change", () => { const v = masterHex.value.trim(); setAllText(v.startsWith("#") ? v : `#${v}`); });

  masterRow.appendChild(masterLbl); masterRow.appendChild(masterSwatch); masterRow.appendChild(masterHex);
  el.appendChild(masterRow);

  const expandBtn = doc.createElement("button"); expandBtn.className = "ao-nav-btn";
  expandBtn.style.cssText = "margin:6px 0;width:100%;justify-content:center;font-size:11px;";
  expandBtn.textContent = "▼ Nastavit každý text zvlášť";
  const indContainer = doc.createElement("div"); indContainer.style.display = "none";
  let indBuilt = false, expanded = false;
  expandBtn.addEventListener("click", () => {
    expanded = !expanded;
    if (expanded && !indBuilt) {
      indBuilt = true;
      for (const p of TEXT_COLOR_PREFS) {
        const f = GLOBAL_COLORS.find(c => c.pref === p);
        if (f) buildColorRow(doc, indContainer, f.label, f.pref, f.default, st);
      }
    }
    indContainer.style.display = expanded ? "block" : "none";
    expandBtn.textContent = expanded ? "▲ Skrýt individuální nastavení" : "▼ Nastavit každý text zvlášť";
  });
  el.appendChild(expandBtn); el.appendChild(indContainer);
}

function buildSpaces(doc: Document, el: HTMLElement, st: HTMLElement): void {
  const tabBar = doc.createElement("div"); tabBar.className = "ao-space-tabs"; el.appendChild(tabBar);
  const contents: HTMLElement[] = [];
  for (let i = 0; i < SPACE_COUNT; i++) {
    const tab = doc.createElement("button"); tab.className = "ao-space-tab" + (i === 0 ? " active" : "");
    tab.textContent = `Space ${i + 1}`; tabBar.appendChild(tab);
    const content = doc.createElement("div"); content.className = "ao-space-content" + (i === 0 ? " active" : "");
    const note = doc.createElement("div"); note.style.cssText = "font-size:11px;color:#5550aa;margin-bottom:10px;";
    note.textContent = `Přepíše globální barvy jen pro Space ${i + 1}. Prázdné = globální hodnota.`;
    content.appendChild(note);
    for (const sc of SPACE_COLORS) buildColorRow(doc, content, sc.label, spaceColorPref(i, sc.key), sc.default, st);
    el.appendChild(content); contents.push(content);
  }
  const tabs = Array.from(tabBar.querySelectorAll<HTMLButtonElement>(".ao-space-tab"));
  tabBar.addEventListener("click", (e) => {
    const t = (e.target as HTMLElement).closest<HTMLButtonElement>(".ao-space-tab"); if (!t) return;
    const idx = tabs.indexOf(t);
    tabs.forEach((tb, ti) => tb.classList.toggle("active", ti === idx));
    contents.forEach((c, ci) => c.classList.toggle("active", ci === idx));
  });
}

function buildDynamic(doc: Document, el: HTMLElement, st: HTMLElement): void {
  const statBar = doc.createElement("div"); statBar.className = "ao-dynamic-status";
  const dot = doc.createElement("div"); dot.className = "ao-dynamic-dot";
  const txt = doc.createElement("span");
  const mode = getPref("mod.aurora.dynamic_mode", "off");
  const modeLabels: Record<string, string> = {
    off: "Dynamický motiv: Vypnutý", material: "Material You — aktivní",
    daynight: "Denní cyklus — aktivní", tab_accent: "Akcent z favikony — aktivní",
  };
  txt.textContent = modeLabels[mode] ?? mode;
  if (mode !== "off") dot.classList.add("on");
  statBar.appendChild(dot); statBar.appendChild(txt); el.appendChild(statBar);

  buildSectionHeading(doc, el, "Režim");
  buildSelect(doc, el, "Aktivní režim", "mod.aurora.dynamic_mode", [
    { label: "Vypnuto", value: "off" }, { label: "Material You", value: "material" },
    { label: "Denní cyklus", value: "daynight" }, { label: "Akcent z favikony", value: "tab_accent" },
  ], "off", (v) => { dot.classList.toggle("on", v !== "off"); txt.textContent = modeLabels[v] ?? v; });

  buildSectionHeading(doc, el, "Material You");
  buildSelect(doc, el, "Intenzita", "mod.aurora.dynamic.material_intensity", [
    { label: "Slabá (25%)", value: "0.25" }, { label: "Střední (50%)", value: "0.5" },
    { label: "Silná (75%)", value: "0.75" }, { label: "Plná (100%)", value: "1.0" },
  ], "0.75");

  buildSectionHeading(doc, el, "Denní cyklus");
  buildSelect(doc, el, "Začátek dne", "mod.aurora.dynamic.day_hour",
    [5,6,7,8].map(h => ({ label: `${h}:00`, value: String(h) })), "7");
  buildSelect(doc, el, "Začátek noci", "mod.aurora.dynamic.night_hour",
    [17,18,19,20,21,22].map(h => ({ label: `${h}:00`, value: String(h) })), "20");
  buildSelect(doc, el, "Délka přechodu", "mod.aurora.dynamic.transition_minutes", [
    { label: "Okamžitý", value: "0" }, { label: "30 min", value: "30" },
    { label: "60 min", value: "60" }, { label: "90 min", value: "90" },
  ], "60");
  buildColorRow(doc, el, "Akcent ve dne",  "mod.aurora.dynamic.day_accent",   "#4a90d9", st);
  buildColorRow(doc, el, "Pozadí ve dne",  "mod.aurora.dynamic.day_bg",       "#1a2035", st);
  buildColorRow(doc, el, "Text ve dne",    "mod.aurora.dynamic.day_text",     "#dde8ff", st);
  buildColorRow(doc, el, "Akcent v noci",  "mod.aurora.dynamic.night_accent", "#e07840", st);
  buildColorRow(doc, el, "Pozadí v noci",  "mod.aurora.dynamic.night_bg",     "#1f1510", st);
  buildColorRow(doc, el, "Text v noci",    "mod.aurora.dynamic.night_text",   "#ffe0cc", st);

  buildSectionHeading(doc, el, "Akcent z favikony");
  buildColorRow(doc, el, "Záložní barva", "mod.aurora.dynamic.favicon_fallback", "#7c6af7", st);
  buildSelect(doc, el, "Zesílení saturace", "mod.aurora.dynamic.favicon_saturation_boost", [
    { label: "Bez (1×)", value: "1.0" }, { label: "Mírné (1.2×)", value: "1.2" },
    { label: "Výrazné (1.5×)", value: "1.5" }, { label: "Maximum (2×)", value: "2.0" },
  ], "1.2");
}

function buildBackground(doc: Document, el: HTMLElement, st: HTMLElement): void {
  buildSectionHeading(doc, el, "Obrázek pozadí");
  buildTextInput(doc, el, "URL obrázku", "mod.aurora.image.browser_bg", "https://...", "");
  buildSelect(doc, el, "Velikost", "mod.aurora.image.bg_size", [
    { label: "Cover", value: "cover" }, { label: "Contain", value: "contain" },
    { label: "Auto", value: "auto" }, { label: "100% šířka", value: "100% auto" },
  ], "cover");
  buildSelect(doc, el, "Pozice", "mod.aurora.image.bg_position", [
    { label: "Střed", value: "center" }, { label: "Nahoře", value: "top" },
    { label: "Dole", value: "bottom" }, { label: "Vlevo", value: "left" },
  ], "center");
  buildSlider(doc, el, "Rozmazání pozadí",  "mod.aurora.image.bg_blur",         0, 30, 1,    "px", 0);
  buildSlider(doc, el, "Průhlednost pozadí","mod.aurora.image.bg_opacity",       0, 1,  0.05, "",   1);
  buildSlider(doc, el, "Průhlednost panelů","mod.aurora.effect.panel_opacity",   0, 1,  0.05, "",   1);
  buildSlider(doc, el, "Rozmazání panelů",  "mod.aurora.effect.panel_blur",      0, 30, 1,    "px", 0);
}

function buildLayout(doc: Document, el: HTMLElement, _st: HTMLElement): void {
  buildSectionHeading(doc, el, "Záložky");
  buildSlider(doc, el, "Výška záložky",        "mod.aurora.layout.tab_height",          20, 60,  1, "px", 36);
  buildSlider(doc, el, "Zaoblení záložky",      "mod.aurora.layout.tab_border_radius",    0, 20,  1, "px", 8);
  buildSectionHeading(doc, el, "Panely");
  buildSlider(doc, el, "Výška toolbaru",        "mod.aurora.layout.toolbar_height",      32, 64,  1, "px", 40);
  buildSlider(doc, el, "Šířka sidebaru",        "mod.aurora.layout.sidebar_width",      120, 400, 4, "px", 200);
  buildSlider(doc, el, "Šířka workspace stripu","mod.aurora.layout.workspace_strip_width", 20, 80, 2, "px", 36);
  buildSlider(doc, el, "Zaoblení panelů",       "mod.aurora.layout.panel_border_radius",  0, 24,  1, "px", 8);
  buildSectionHeading(doc, el, "Ostatní");
  buildSlider(doc, el, "Zaoblení tlačítek",     "mod.aurora.layout.button_border_radius", 0, 20,  1, "px", 6);
  buildSlider(doc, el, "Tloušťka ohraničení",   "mod.aurora.layout.border_width",         0,  4,  1, "px", 1);
  buildSelect(doc, el, "Styl ohraničení",        "mod.aurora.effect.panel_border_style", [
    { label: "Plné (solid)", value: "solid" }, { label: "Tečky (dotted)", value: "dotted" },
    { label: "Přerušované (dashed)", value: "dashed" }, { label: "Žádné", value: "none" },
  ], "solid");
}

function buildEffects(doc: Document, el: HTMLElement, _st: HTMLElement): void {
  buildSectionHeading(doc, el, "Stíny a záře");
  buildToggle(doc, el, "Stín aktivní záložky", "mod.aurora.effect.tab_shadow", false);
  buildToggle(doc, el, "Záře akcentu (glow)",  "mod.aurora.effect.accent_glow", false);
  buildSectionHeading(doc, el, "Animace");
  buildSelect(doc, el, "Rychlost animací", "mod.aurora.animation_speed", [
    { label: "Vypnuté", value: "none" }, { label: "Pomalé", value: "slow" },
    { label: "Normální", value: "normal" }, { label: "Rychlé", value: "fast" },
  ], "normal");
  buildSelect(doc, el, "Křivka animace", "mod.aurora.animation.easing", [
    { label: "Ease", value: "ease" }, { label: "Linear", value: "linear" },
    { label: "Ease Out", value: "ease-out" },
    { label: "Spring", value: "cubic-bezier(0.34,1.56,0.64,1)" },
  ], "ease");
}

function buildFont(doc: Document, el: HTMLElement, _st: HTMLElement): void {
  buildSectionHeading(doc, el, "Písmo");
  buildTextInput(doc, el, "Rodina písma", "mod.aurora.font.family", "system-ui, sans-serif", "inherit");
  buildSlider(doc, el, "Velikost", "mod.aurora.font.size", 10, 20, 1, "px", 13);
  buildSelect(doc, el, "Tučnost", "mod.aurora.font.weight", [
    { label: "300", value: "300" }, { label: "400 (normální)", value: "400" },
    { label: "500", value: "500" }, { label: "600", value: "600" }, { label: "700", value: "700" },
  ], "400");
}

function buildSounds(doc: Document, el: HTMLElement, _st: HTMLElement): void {
  buildSectionHeading(doc, el, "Zvukové efekty");
  const note = doc.createElement("div"); note.style.cssText = "font-size:11.5px;color:#5550aa;margin-bottom:12px;line-height:1.6;";
  note.textContent = "Jemný zvuk při psaní. Změna vyžaduje restart prohlížeče.";
  el.appendChild(note);
  buildToggle(doc, el, "Zapnout zvukové efekty klávesnice", "mod.aurora.sounds_enabled", false);
}

// ── Presets ───────────────────────────────────────────────────────────────────

const ALL_STRING_PREFS = [
  ...GLOBAL_COLORS.map(c => c.pref),
  "mod.aurora.image.browser_bg","mod.aurora.image.bg_size","mod.aurora.image.bg_position",
  "mod.aurora.image.bg_blur","mod.aurora.image.bg_opacity","mod.aurora.effect.panel_opacity",
  "mod.aurora.effect.panel_blur","mod.aurora.effect.panel_border_style",
  "mod.aurora.font.family","mod.aurora.font.size","mod.aurora.font.weight",
  "mod.aurora.layout.tab_height","mod.aurora.layout.tab_border_radius",
  "mod.aurora.layout.panel_border_radius","mod.aurora.layout.button_border_radius",
  "mod.aurora.layout.sidebar_width","mod.aurora.layout.workspace_strip_width",
  "mod.aurora.layout.toolbar_height","mod.aurora.layout.border_width",
  "mod.aurora.animation_speed","mod.aurora.animation.easing","mod.aurora.dynamic_mode",
];
const ALL_BOOL_PREFS = ["mod.aurora.effect.tab_shadow","mod.aurora.effect.accent_glow","mod.aurora.sounds_enabled"];

function capturePreset(): string {
  const data: Record<string, string | boolean> = {};
  for (const p of ALL_STRING_PREFS) { try { data[p] = Services.prefs.getStringPref(p, ""); } catch {} }
  for (const p of ALL_BOOL_PREFS)   { try { data[p] = Services.prefs.getBoolPref(p, false); } catch {} }
  return JSON.stringify(data);
}

function applyPresetData(json: string): void {
  const data = JSON.parse(json) as Record<string, string | boolean>;
  for (const [p, v] of Object.entries(data)) {
    if (!p.startsWith("mod.aurora.")) continue;
    if (typeof v === "boolean") { try { Services.prefs.setBoolPref(p, v); } catch {} }
    else { try { Services.prefs.setStringPref(p, v as string); } catch {} }
  }
}

function listPresets(): { idx: number; name: string; ts: number; json: string }[] {
  const result = [];
  for (let i = 1; i <= 20; i++) {
    try {
      const raw = Services.prefs.getStringPref(`mod.aurora.preset.${i}`, "");
      if (!raw) continue;
      const meta = JSON.parse(raw) as { name: string; ts: number; data: string };
      result.push({ idx: i, name: meta.name, ts: meta.ts, json: meta.data });
    } catch {}
  }
  return result;
}

function savePreset(name: string): number {
  for (let i = 1; i <= 20; i++) {
    const raw = Services.prefs.getStringPref(`mod.aurora.preset.${i}`, "");
    if (!raw) {
      Services.prefs.setStringPref(`mod.aurora.preset.${i}`, JSON.stringify({ name, ts: Date.now(), data: capturePreset() }));
      return i;
    }
  }
  return -1;
}

function deletePreset(idx: number): void { try { Services.prefs.clearUserPref(`mod.aurora.preset.${idx}`); } catch {} }

function buildPresets(doc: Document, el: HTMLElement, st: HTMLElement): void {
  buildSectionHeading(doc, el, "Uložené profily");
  const listEl = doc.createElement("div"); listEl.className = "ao-preset-list"; el.appendChild(listEl);

  function refresh(): void {
    listEl.innerHTML = "";
    const presets = listPresets();
    if (!presets.length) {
      const e = doc.createElement("div"); e.style.cssText = "color:#5550aa;font-size:12px;padding:10px 0;";
      e.textContent = "Žádné uložené profily."; listEl.appendChild(e); return;
    }
    for (const p of presets) {
      const item = doc.createElement("div"); item.className = "ao-preset-item";
      const swatches = doc.createElement("div"); swatches.className = "ao-preset-swatch-row";
      try {
        const data = JSON.parse(p.json) as Record<string, string>;
        for (const key of ["mod.aurora.color.accent","mod.aurora.color.panel_bg","mod.aurora.color.tab_active_bg"]) {
          const sw = doc.createElement("div"); sw.className = "ao-preset-swatch"; sw.style.background = data[key] || "#333"; swatches.appendChild(sw);
        }
      } catch {}
      const name = doc.createElement("span"); name.className = "ao-preset-name"; name.textContent = p.name;
      const time = doc.createElement("span"); time.className = "ao-preset-time"; time.textContent = new Date(p.ts).toLocaleDateString("cs-CZ");
      const loadBtn = doc.createElement("button"); loadBtn.className = "ao-preset-btn load"; loadBtn.textContent = "Načíst";
      loadBtn.addEventListener("click", () => { applyPresetData(p.json); status(st, `Načten "${p.name}"`, "ok"); });
      const delBtn = doc.createElement("button"); delBtn.className = "ao-preset-btn del"; delBtn.textContent = "Smazat";
      delBtn.addEventListener("click", () => { deletePreset(p.idx); refresh(); });
      item.appendChild(swatches); item.appendChild(name); item.appendChild(time); item.appendChild(loadBtn); item.appendChild(delBtn);
      listEl.appendChild(item);
    }
  }
  refresh();

  buildSectionHeading(doc, el, "Uložit aktuální nastavení");
  const saveRow = doc.createElement("div"); saveRow.className = "ao-preset-save";
  const nameIn = doc.createElement("input") as HTMLInputElement; nameIn.type = "text";
  nameIn.className = "ao-preset-name-in"; nameIn.placeholder = "Název profilu";
  const saveBtn = doc.createElement("button"); saveBtn.className = "ao-preset-save-btn"; saveBtn.textContent = "Uložit";
  saveBtn.addEventListener("click", () => {
    const n = nameIn.value.trim() || `Profil ${Date.now()}`;
    if (savePreset(n) < 0) { status(st, "Maximum 20 profilů dosaženo", "err"); return; }
    nameIn.value = ""; refresh(); status(st, `Uložen "${n}"`, "ok");
  });
  saveRow.appendChild(nameIn); saveRow.appendChild(saveBtn); el.appendChild(saveRow);

  buildSectionHeading(doc, el, "Export / Import (.txt)");
  const ioRow = doc.createElement("div"); ioRow.style.cssText = "display:flex;gap:8px;";
  const expBtn = doc.createElement("button"); expBtn.className = "ao-nav-btn"; expBtn.textContent = "💾 Export";
  expBtn.addEventListener("click", () => exportTxt(doc, st));
  const impBtn = doc.createElement("button"); impBtn.className = "ao-nav-btn"; impBtn.textContent = "📂 Import";
  impBtn.addEventListener("click", () => importTxt(doc, st));
  ioRow.appendChild(expBtn); ioRow.appendChild(impBtn); el.appendChild(ioRow);
}

function exportTxt(doc: Document, st: HTMLElement): void {
  const lines = ["# Aurora Theme Export", `# ${new Date().toLocaleString("cs-CZ")}`, ""];
  for (const p of ALL_STRING_PREFS) lines.push(`${p}=${getPref(p, "")}`);
  for (const p of ALL_BOOL_PREFS)   lines.push(`${p}=${getBoolPref(p, false)}`);
  try {
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = doc.createElement("a") as HTMLAnchorElement;
    a.href = url; a.download = `aurora-${Date.now()}.txt`;
    doc.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    status(st, "Soubor stažen", "ok");
  } catch (e) { status(st, `Chyba: ${e}`, "err"); }
}

function importTxt(doc: Document, st: HTMLElement): void {
  const inp = doc.createElement("input") as HTMLInputElement;
  inp.type = "file"; inp.accept = ".txt,text/plain"; inp.style.display = "none";
  inp.addEventListener("change", () => {
    const f = inp.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = (e) => {
      let ok = 0, bad = 0;
      for (const line of (e.target?.result as string).split(/\r?\n/)) {
        const l = line.trim(); if (!l || l.startsWith("#")) continue;
        const eq = l.indexOf("="); if (eq < 0) continue;
        const p = l.slice(0, eq).trim(), v = l.slice(eq + 1).trim();
        if (!p.startsWith("mod.aurora.")) { bad++; continue; }
        if (v === "true" || v === "false") { try { Services.prefs.setBoolPref(p, v === "true"); ok++; } catch { bad++; } }
        else { try { Services.prefs.setStringPref(p, v); ok++; } catch { bad++; } }
      }
      status(st, bad > 0 ? `Načteno ${ok}, přeskočeno ${bad}` : `Načteno ${ok} hodnot`, ok > 0 ? "ok" : "err");
    };
    r.readAsText(f);
  });
  doc.body.appendChild(inp); inp.click(); setTimeout(() => inp.remove(), 30_000);
}

function buildAbout(doc: Document, el: HTMLElement, st: HTMLElement): void {
  const card = doc.createElement("div"); card.className = "ao-about-card";
  const t = doc.createElement("div"); t.className = "ao-about-title"; t.textContent = "✦ Aurora";
  const sub = doc.createElement("div"); sub.className = "ao-about-sub";
  sub.textContent = "Kompletní UI overhaul pro Zen Browser · v0.1.0";
  card.appendChild(t); card.appendChild(sub); el.appendChild(card);

  buildSectionHeading(doc, el, "Resetovat nastavení");
  const resetBtn = doc.createElement("button"); resetBtn.className = "ao-nav-btn danger";
  resetBtn.style.cssText = "width:100%;margin-bottom:8px;";
  resetBtn.textContent = "⟳  Reset všech barev na výchozí hodnoty";
  resetBtn.addEventListener("click", () => {
    for (const f of GLOBAL_COLORS) { try { Services.prefs.setStringPref(f.pref, f.default); } catch {} }
    for (let i = 0; i < SPACE_COUNT; i++)
      for (const sc of SPACE_COLORS)
        try { Services.prefs.clearUserPref(spaceColorPref(i, sc.key)); } catch {}
    status(st, "Resetováno na výchozí hodnoty", "ok");
  });
  el.appendChild(resetBtn);
}

// ── Nav items ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "colors",     icon: "🎨", label: "Barvy"      },
  { id: "spaces",     icon: "🌌", label: "Spaces"     },
  { id: "dynamic",    icon: "🌅", label: "Dynamika"   },
  { id: "background", icon: "🖼️", label: "Pozadí"     },
  { id: "layout",     icon: "📐", label: "Rozměry"    },
  { id: "effects",    icon: "✨", label: "Efekty"     },
  { id: "font",       icon: "🔤", label: "Písmo"      },
  { id: "sounds",     icon: "🔊", label: "Zvuky"      },
  { id: "presets",    icon: "💾", label: "Presety"    },
  { id: "about",      icon: "ℹ️", label: "O módu"     },
] as const;

type NavId = typeof NAV_ITEMS[number]["id"];

const SECTION_BUILDERS: Record<NavId, (doc: Document, el: HTMLElement, st: HTMLElement) => void> = {
  colors: buildColors, spaces: buildSpaces, dynamic: buildDynamic,
  background: buildBackground, layout: buildLayout, effects: buildEffects,
  font: buildFont, sounds: buildSounds, presets: buildPresets, about: buildAbout,
};

// ── Main init ─────────────────────────────────────────────────────────────────

function buildUI(doc: Document): void {
  // Inject CSS
  const style = doc.createElement("style"); style.textContent = CSS;
  doc.head.appendChild(style);

  // Init color picker in this window's document
  initColorPicker(doc);

  // Shell
  const nav  = doc.createElement("div"); nav.className = "ao-nav";
  const main = doc.createElement("div"); main.className = "ao-main";

  // Logo
  const logo = doc.createElement("div"); logo.className = "ao-nav-logo"; logo.textContent = "✦ Aurora";
  nav.appendChild(logo);

  // Header
  const header     = doc.createElement("div"); header.className = "ao-header";
  const headerTitle= doc.createElement("div"); headerTitle.className = "ao-header-title";
  const headerSub  = doc.createElement("span"); headerSub.className = "ao-header-sub";
  headerTitle.appendChild(doc.createTextNode("✦ Aurora")); headerTitle.appendChild(headerSub);
  const closeBtn   = doc.createElement("button"); closeBtn.className = "ao-header-close";
  closeBtn.textContent = "✕ Zavřít  (Esc)";
  closeBtn.addEventListener("click", () => window.close());
  header.appendChild(headerTitle); header.appendChild(closeBtn);

  // Content
  const content = doc.createElement("div"); content.className = "ao-content";
  const st = doc.createElement("div"); st.className = "ao-status"; st.style.marginBottom = "4px";
  content.appendChild(st);

  main.appendChild(header); main.appendChild(content);
  doc.body.appendChild(nav); doc.body.appendChild(main);

  // Sections + nav
  const sections: Partial<Record<NavId, HTMLElement>> = {};
  const navEls: HTMLElement[] = [];
  let activeId: NavId = "colors";

  function showSection(id: NavId): void {
    sections[activeId]?.classList.remove("active");
    navEls.find(n => n.dataset.id === activeId)?.classList.remove("active");
    if (!sections[id]) {
      const sec = doc.createElement("div"); sec.className = "ao-section"; sec.dataset.section = id;
      SECTION_BUILDERS[id](doc, sec, st);
      content.appendChild(sec);
      sections[id] = sec;
    }
    sections[id]!.classList.add("active");
    navEls.find(n => n.dataset.id === id)?.classList.add("active");
    activeId = id;
    const item = NAV_ITEMS.find(n => n.id === id);
    if (item) headerSub.textContent = `— ${item.label}`;
    content.scrollTop = 0;
  }

  for (const item of NAV_ITEMS) {
    const navItem = doc.createElement("div"); navItem.className = "ao-nav-item"; navItem.dataset.id = item.id;
    const icon = doc.createElement("span"); icon.className = "ao-nav-icon"; icon.textContent = item.icon;
    const lbl  = doc.createElement("span"); lbl.textContent = item.label;
    navItem.appendChild(icon); navItem.appendChild(lbl);
    navItem.addEventListener("click", () => showSection(item.id as NavId));
    nav.appendChild(navItem); navEls.push(navItem);
  }

  showSection("colors");

  // Escape closes window
  doc.addEventListener("keydown", (e) => { if (e.key === "Escape") window.close(); });
}

// Mark this window so overlay.ts can detect it's already open
(window as Window & { _auroraSettings?: boolean })._auroraSettings = true;

// Run immediately (script is at end of body, DOM is ready)
buildUI(document);

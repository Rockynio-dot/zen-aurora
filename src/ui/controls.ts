// Reusable UI control builders for Aurora settings overlay

export function getPref(pref: string, def = ""): string {
  try { return Services.prefs.getStringPref(pref, def) || def; } catch { return def; }
}
export function getBoolPref(pref: string, def = false): boolean {
  try { return Services.prefs.getBoolPref(pref, def); } catch { return def; }
}
export function setPref(pref: string, v: string): void {
  try { Services.prefs.setStringPref(pref, v); } catch { /**/ }
}
export function setBoolPref(pref: string, v: boolean): void {
  try { Services.prefs.setBoolPref(pref, v); } catch { /**/ }
}

// ── Row wrapper ───────────────────────────────────────────────────────────────

export function row(doc: Document, label: string): [HTMLElement, HTMLElement] {
  const wrap = doc.createElement("div");
  wrap.className = "aoc-row";
  const lbl = doc.createElement("label");
  lbl.className = "aoc-label";
  lbl.textContent = label;
  wrap.appendChild(lbl);
  return [wrap, lbl];
}

// ── Toggle switch ─────────────────────────────────────────────────────────────

export function buildToggle(
  doc: Document,
  container: HTMLElement,
  label: string,
  pref: string,
  def = false,
  onChange?: (v: boolean) => void
): void {
  const [wrap] = row(doc, label);
  wrap.classList.add("aoc-row-toggle");

  const tog = doc.createElement("div") as HTMLElement;
  tog.className = "aoc-toggle" + (getBoolPref(pref, def) ? " on" : "");
  tog.tabIndex = 0;
  const thumb = doc.createElement("div"); thumb.className = "aoc-thumb";
  tog.appendChild(thumb);

  const update = (v: boolean) => {
    tog.classList.toggle("on", v);
    setBoolPref(pref, v);
    onChange?.(v);
  };

  tog.addEventListener("click", () => update(!tog.classList.contains("on")));
  tog.addEventListener("keydown", (e) => { if (e.key === " " || e.key === "Enter") update(!tog.classList.contains("on")); });

  wrap.appendChild(tog);
  container.appendChild(wrap);
}

// ── Slider ────────────────────────────────────────────────────────────────────

export function buildSlider(
  doc: Document,
  container: HTMLElement,
  label: string,
  pref: string,
  min: number,
  max: number,
  step: number,
  unit: string,
  def: number,
  onChange?: (v: string) => void
): void {
  const [wrap] = row(doc, "");
  wrap.classList.add("aoc-row-slider");

  const lbl = doc.createElement("span"); lbl.className = "aoc-label"; lbl.textContent = label;
  const valDisp = doc.createElement("span"); valDisp.className = "aoc-slider-val";
  const labelRow = doc.createElement("div"); labelRow.className = "aoc-slider-header";
  labelRow.appendChild(lbl); labelRow.appendChild(valDisp);

  const slider = doc.createElement("input") as HTMLInputElement;
  slider.type = "range"; slider.min = String(min); slider.max = String(max); slider.step = String(step);
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

// ── Select dropdown ───────────────────────────────────────────────────────────

// Rendered as a segmented control (clickable chips) rather than a native
// <select> — native dropdown popups are unreliable in a chrome:// window.
export function buildSelect(
  doc: Document,
  container: HTMLElement,
  label: string,
  pref: string,
  options: { label: string; value: string }[],
  def: string,
  onChange?: (v: string) => void
): void {
  const [wrap] = row(doc, label);
  wrap.classList.add("aoc-row-select");

  const seg = doc.createElement("div");
  seg.className = "aoc-seg";
  let cur = getPref(pref, def);

  const btns: HTMLButtonElement[] = [];
  for (const opt of options) {
    const b = doc.createElement("button") as HTMLButtonElement;
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

// ── Text input ────────────────────────────────────────────────────────────────

export function buildTextInput(
  doc: Document,
  container: HTMLElement,
  label: string,
  pref: string,
  placeholder: string,
  def = "",
  onChange?: (v: string) => void
): void {
  const [wrap] = row(doc, label);
  wrap.classList.add("aoc-row-text");

  const inp = doc.createElement("input") as HTMLInputElement;
  inp.type = "text"; inp.className = "aoc-input";
  inp.value = getPref(pref, def);
  inp.placeholder = placeholder;
  inp.addEventListener("change", () => { setPref(pref, inp.value); onChange?.(inp.value); });

  wrap.appendChild(inp);
  container.appendChild(wrap);
}

// ── Section heading ───────────────────────────────────────────────────────────

export function buildSectionHeading(doc: Document, container: HTMLElement, text: string): void {
  const h = doc.createElement("div");
  h.className = "aoc-section-heading";
  h.textContent = text;
  container.appendChild(h);
}

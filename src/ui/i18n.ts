// Lightweight i18n for the Aurora settings window.
// Czech is the source language (all building code stays in Czech); English is
// derived by translating the built DOM. Switching language re-renders the UI.

export type Lang = "cs" | "en";

export function getLang(): Lang {
  try { return (Services.prefs.getStringPref("mod.aurora.ui.lang", "cs") as Lang) || "cs"; }
  catch { return "cs"; }
}
export function setLang(lang: Lang): void {
  try { Services.prefs.setStringPref("mod.aurora.ui.lang", lang); } catch { /**/ }
}

// Czech → English. Only exact (trimmed) matches are translated; anything not
// listed (CSS selector badges, hex values, technical tokens) is left as-is.
const EN: Record<string, string> = {
  // ── Chrome / header ──
  "✕ Zavřít  (Esc)": "✕ Close  (Esc)",
  "Jazyk": "Language",
  "Vzhled": "Appearance",
  "Barva": "Colour",
  "Tmavý": "Dark",
  "Světlý": "Light",

  // ── Nav ──
  "Rychlé": "Quick",
  "Barvy": "Colours",
  "Spaces": "Spaces",
  "Pozadí": "Background",
  "Rozměry": "Sizing",
  "Efekty": "Effects",
  "Písmo & Text": "Font & Text",
  "Přístupnost": "Accessibility",
  "Presety": "Presets",
  "O módu": "About",

  // ── Quick ──
  "Vyberte 1–3 barvy a průhlednost — Aurora vygeneruje gradient na toolbar i pozadí a sladí akcent, text i celou plochou paletu. Stejný algoritmus jako \"Upravit motiv\" v Zenu.":
    "Pick 1–3 colours and an opacity — Aurora builds a gradient for the toolbar and background and matches the accent, text and the whole flat palette. Same algorithm as \"Edit theme\" in Zen.",
  "Barvy motivu (1–3)": "Theme colours (1–3)",
  "Upravit barvu": "Edit colour",
  "Odebrat barvu": "Remove colour",
  "Přidat barvu": "Add colour",
  "Průhlednost (sytost gradientu)": "Opacity (gradient strength)",
  "Režim": "Mode",
  "🌙 Tmavý": "🌙 Dark",
  "☀️ Světlý": "☀️ Light",
  "Náhled": "Preview",
  "Pozadí obsahu": "Content background",
  "Akcent": "Accent",
  "Schéma": "Scheme",
  "Použít": "Apply",
  "Použít motiv zapne gradient a zároveň vygeneruje sladěnou plochou paletu (záložky, urlbar, sidebar…). Jen plochá paleta vypne gradient a nastaví jen barvy.":
    "Apply theme turns the gradient on and also generates a matching flat palette (tabs, urlbar, sidebar…). Flat palette only turns the gradient off and sets just the colours.",
  "✦ Použít motiv (gradient + paleta)": "✦ Apply theme (gradient + palette)",
  "Jen plochá paleta (bez gradientu)": "Flat palette only (no gradient)",
  "✓ Motiv aplikován — gradient + paleta": "✓ Theme applied — gradient + palette",
  "✓ Plochá paleta aplikována, gradient vypnut": "✓ Flat palette applied, gradient off",

  // ── Colours ──
  "Akcent & Ohraničení": "Accent & Border",
  "Ohraničení": "Border",
  "všechny border": "all borders",
  "Pozadí toolbaru": "Toolbar background",
  "Panely (nav bar · záložkový · menu)": "Panels (nav bar · tabs · menu)",
  "Pozadí panelů": "Panel background",
  "Tlačítka aktivní": "Buttons active",
  "Tlačítka hover": "Buttons hover",
  "Pozadí sidebaru": "Sidebar background",
  "Workspace strip (levý panel se spaces)": "Workspace strip (left spaces panel)",
  "Pozadí stripu": "Strip background",
  "Dot neaktivní": "Dot inactive",
  "Dot aktivní": "Dot active",
  "Záložky (.tabbrowser-tab)": "Tabs (.tabbrowser-tab)",
  "Aktivní záložka": "Active tab",
  "Neaktivní záložka": "Inactive tab",
  "Hover záložky": "Tab hover",
  "✕ tlačítko hover": "✕ button hover",
  "URL lišta (#urlbar)": "URL bar (#urlbar)",
  "Ohraničení idle": "Border idle",
  "Ohraničení focus": "Border focus",
  "Obsah a ostatní": "Content & other",
  "Pozadí obsahu (#browser)": "Content background (#browser)",
  "Výběr textu (::selection)": "Text selection (::selection)",
  "Scrollbar (thumb)": "Scrollbar (thumb)",

  // ── Mockup (WYSIWYG colour editor) ──
  "Klikni na prvek v náhledu prohlížeče a uprav jeho barvy. Hrubou paletu nastavíš v sekci Rychlé.":
    "Click an element in the browser preview to edit its colours. Set the rough palette in the Quick section.",
  "Gradient je aktivní — pozadí toolbaru, sidebaru a obsahu řídí gradient (sekce Rychlé), proto na ně ploché barvy nemají vliv.":
    "Gradient is active — the toolbar, sidebar and content backgrounds are driven by the gradient (Quick section), so flat colours don't affect them.",
  "Náhled prohlížeče": "Browser preview",
  "Rozložení prohlížeče": "Browser layout",
  "Jeden panel": "Single bar",
  "Více panelů": "Multiple bars",
  "Sbalený": "Collapsed",
  "Záložky": "Tabs",
  "URL lišta": "URL bar",
  "Obsah": "Content",
  "Globální": "Global",
  "Text panelů": "Panel text",
  "Text záložek": "Tab text",
  "Výběr textu": "Text selection",
  "Text URL lišty": "URL bar text",
  "Záložka": "Tab",
  "Položka": "Item",

  // ── Spaces ──
  "Přepíše globální barvy jen pro vybraný Space. Prázdné pole = globální hodnota.":
    "Overrides global colours for the selected Space only. Empty field = global value.",

  // ── Background ──
  "Obrázek se zobrazuje za #browser::before. Průhlednost a blur panelů nastav v sekci Efekty.":
    "The image renders behind #browser::before. Set panel opacity and blur in the Effects section.",
  "Obrázek pozadí (#browser::before)": "Background image (#browser::before)",
  "URL nebo cesta k souboru": "URL or file path",
  "Vybrat soubor": "Choose file",
  "https://... nebo file:///C:/...": "https://... or file:///C:/...",
  "Velikost (background-size)": "Size (background-size)",
  "Cover — vyplní plochu": "Cover — fill area",
  "Contain — celý viditelný": "Contain — fully visible",
  "Auto — přirozená velikost": "Auto — natural size",
  "100% šířka": "100% width",
  "Pozice (background-position)": "Position (background-position)",
  "Střed": "Center",
  "Nahoře": "Top",
  "Dole": "Bottom",
  "Vlevo": "Left",
  "Vpravo": "Right",
  "Rozmazání obrázku (filter: blur)": "Image blur (filter: blur)",
  "Průhlednost obrázku (opacity)": "Image opacity (opacity)",
  "Startovací stránka": "Start page",
  "Vždy otevřít domovskou stránku na nové záložce": "Always open homepage on new tab",

  // ── Sizing ──
  "Zapnutí stylování prvků": "Enable element styling",
  "Pokud prvek vypneš, Aurora ho nechá v Zen výchozím stylu.":
    "If you turn an element off, Aurora leaves it in Zen's default style.",
  "Sidebar (#sidebar-box)": "Sidebar (#sidebar-box)",
  "Toolbar (#navigator-toolbox, #TabsToolbar…)": "Toolbar (#navigator-toolbox, #TabsToolbar…)",
  "Workspace strip (#zen-appcontent-navbar)": "Workspace strip (#zen-appcontent-navbar)",
  "Popup menu (menupopup, menuitem)": "Popup menu (menupopup, menuitem)",
  "Výška záložky (min/max-height)": "Tab height (min/max-height)",
  "Zaoblení záložky (border-radius)": "Tab radius (border-radius)",
  "Panely (#TabsToolbar · #nav-bar · #PersonalToolbar)": "Panels (#TabsToolbar · #nav-bar · #PersonalToolbar)",
  "Výška panelů (min-height)": "Panel height (min-height)",
  "Šířka sidebaru (min/max-width)": "Sidebar width (min/max-width)",
  "Šířka stripu (min/max-width)": "Strip width (min/max-width)",
  "Zaoblení": "Rounding",
  "Zaoblení panelů / URL (#urlbar, menupopup)": "Panel / URL rounding (#urlbar, menupopup)",
  "Zaoblení tlačítek / položek menu": "Button / menu item rounding",
  "Tloušťka (border-width — vše)": "Thickness (border-width — all)",
  "Rozvržení toolbaru": "Toolbar layout",
  "Režim toolbaru": "Toolbar mode",
  "Více panelů (výchozí)": "Multiple bars (default)",
  "Jeden panel (bez záložkové lišty)": "Single bar (no tab strip)",
  "Sbalený (auto-hide)": "Collapsed (auto-hide)",
  "Hitbox horní lišty (při auto-hide)": "Top bar hitbox (when auto-hidden)",
  "Zvětší neviditelnou oblast nahoře, která aktivuje vysunutí lišty.":
    "Enlarges the invisible zone at the top that triggers the bar to slide out.",
  "Výška hitboxu": "Hitbox height",

  // ── Effects ──
  "Průhlednost panelů": "Panel transparency",
  "Ovlivňuje #navigator-toolbox, #sidebar-box, #zen-appcontent-navbar, menupopup. Blur = frosted glass.":
    "Affects #navigator-toolbox, #sidebar-box, #zen-appcontent-navbar, menupopup. Blur = frosted glass.",
  "Průhlednost panelů (rgba alpha)": "Panel opacity (rgba alpha)",
  "Blur panelů (backdrop-filter)": "Panel blur (backdrop-filter)",
  "Odstraní mezery a zaoblení okolo obsahu prohlížeče. Portováno z github.com/Comp-Tech-Guy/No-Gaps v2.5.2.":
    "Removes gaps and rounding around the browser content. Ported from github.com/Comp-Tech-Guy/No-Gaps v2.5.2.",
  "Zapnout No Gap Mod": "Enable No Gap Mod",
  "Mód aplikace": "Apply mode",
  "Oba (compact + non-compact) — výchozí": "Both (compact + non-compact) — default",
  "Pouze kompaktní mód": "Compact mode only",
  "Odstranit zvýraznění split záložek (outline: none)": "Remove split tab highlight (outline: none)",
  "Odstranit box-shadow kontejneru obsahu": "Remove content container box-shadow",
  "Barva pozadí tabpanels": "Tabpanels background colour",
  "Stíny a záře": "Shadows & glow",
  "Stín aktivní záložky (.tabbrowser-tab[selected])": "Active tab shadow (.tabbrowser-tab[selected])",
  "Záře akcentu při hoveru a aktivní záložce (glow)": "Accent glow on hover & active tab",
  "Styl ohraničení (border-style — vše)": "Border style (border-style — all)",
  "Styl": "Style",
  "Plné (solid)": "Solid",
  "Tečky (dotted)": "Dotted",
  "Přerušované (dashed)": "Dashed",
  "Žádné (none)": "None",
  "Animace (CSS transitions — vše)": "Animation (CSS transitions — all)",
  "Rychlost (transition-duration)": "Speed (transition-duration)",
  "Vypnuté — žádné (0s)": "Off — none (0s)",
  "Pomalé (0.45s)": "Slow (0.45s)",
  "Normální (0.18s)": "Normal (0.18s)",
  "Rychlé (0.08s)": "Fast (0.08s)",
  "Křivka (transition-timing-function)": "Curve (transition-timing-function)",
  "Material ease (výchozí)": "Material ease (default)",
  "Spring (překmit)": "Spring (overshoot)",

  // ── Font & Text ──
  "Písmo (záložky, panely, URL lišta)": "Font (tabs, panels, URL bar)",
  "Rodina (font-family)": "Family (font-family)",
  "Velikost (font-size)": "Size (font-size)",
  "Tučnost (font-weight)": "Weight (font-weight)",
  "300 — tenké": "300 — thin",
  "400 — normální": "400 — normal",
  "500 — střední": "500 — medium",
  "600 — semibold": "600 — semibold",
  "700 — tučné": "700 — bold",
  "Barvy textu": "Text colours",
  "Text panelů (toolbar, sidebar, menu)": "Panel text (toolbar, sidebar, menu)",
  "Text záložek (.tab-label)": "Tab text (.tab-label)",
  "Text URL lišty (#urlbar-input)": "URL bar text (#urlbar-input)",
  "Individuální barvy textu (záložky a urlbar mají vlastní barvu, jinak se kopíruje barva panelů)":
    "Individual text colours (tabs and urlbar use their own colour, otherwise the panel colour is copied)",

  // ── Accessibility ──
  "Barevné schéma obsahu (prefers-color-scheme)": "Content colour scheme (prefers-color-scheme)",
  "Nastaví jak webové stránky vidí váš preferovaný barevný motiv. Ovlivňuje weby které reagují na dark/light mode.":
    "Sets the preferred colour theme web pages see. Affects sites that respond to dark/light mode.",
  "Schéma obsahu": "Content scheme",
  "Dle systému (auto)": "System (auto)",
  "Tmavý (dark)": "Dark",
  "Světlý (light)": "Light",
  "Vysoký kontrast prohlížeče": "Browser high contrast",
  "Kontrast": "Contrast",
  "Vypnuto": "Off",
  "Vysoký kontrast tmavý": "High contrast dark",
  "Vysoký kontrast světlý": "High contrast light",
  "Simulace barvosleposti": "Colour-blindness simulation",
  "Aplikuje CSS filtr na celý prohlížeč. Pomáhá při návrhu přístupného UI nebo pro uživatele s vadou barvocitu.":
    "Applies a CSS filter to the whole browser. Helps when designing accessible UI or for users with colour-vision deficiency.",
  "Typ barvosleposti": "Colour-blindness type",
  "Protanopie (nedostatek červené)": "Protanopia (red deficiency)",
  "Deuteranopie (nedostatek zelené)": "Deuteranopia (green deficiency)",
  "Tritanopie (nedostatek modré)": "Tritanopia (blue deficiency)",
  "Achromatopsie (bez barev)": "Achromatopsia (no colour)",

  // ── Presets ──
  "Uložené profily": "Saved profiles",
  "Žádné uložené profily.": "No saved profiles.",
  "Načíst": "Load",
  "Přejmenovat": "Rename",
  "↑ Přepsat": "↑ Overwrite",
  "Profil načten": "Profile loaded",
  "Přejmenováno": "Renamed",
  "Profil přepsán": "Profile overwritten",
  "Uložit aktuální nastavení": "Save current settings",
  "Název profilu": "Profile name",
  "Uložit": "Save",
  "Maximum 20 profilů dosaženo": "Maximum 20 profiles reached",
  "Profil uložen": "Profile saved",
  "Export / Import (.txt)": "Export / Import (.txt)",
  "💾 Export": "💾 Export",
  "📂 Import": "📂 Import",
  "Soubor stažen": "File downloaded",

  // ── About ──
  "Kompletní UI overhaul pro Zen Browser · v0.2.0 · Rockynio-dot":
    "Complete UI overhaul for Zen Browser · v0.2.0 · Rockynio-dot",
  "Reset barev": "Reset colours",
  "⟳  Reset barev na Aurora výchozí (fialový dark)": "⟳  Reset colours to Aurora default (purple dark)",
  "Opravdu resetovat všechny barvy na Aurora výchozí?": "Really reset all colours to Aurora default?",
  "Barvy resetovány": "Colours reset",
  "Reset veškerých nastavení": "Reset all settings",
  "⟳  Reset VEŠKERÝCH nastavení Aurora": "⟳  Reset ALL Aurora settings",
  "Opravdu resetovat veškerá nastavení Aurora?": "Really reset all Aurora settings?",
  "Veškerá nastavení resetována": "All settings reset",
};

// Translate a single string (for code that interpolates).
export function tr(s: string): string {
  if (getLang() === "cs") return s;
  return EN[s.trim()] ?? s;
}

// Translate a freshly-built DOM subtree in place (text nodes + placeholder/title).
export function translateTree(root: Node): void {
  if (getLang() === "cs") return;
  const doc = (root as HTMLElement).ownerDocument ?? document;
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const texts: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) texts.push(n as Text);
  for (const t of texts) {
    const key = (t.data ?? "").trim();
    if (!key) continue;
    const en = EN[key];
    if (en && en !== t.data) t.data = t.data.replace(key, en);
  }
  const els = (root as HTMLElement).querySelectorAll?.("[placeholder],[title]") ?? [];
  els.forEach((el) => {
    const ph = el.getAttribute("placeholder");
    if (ph && EN[ph.trim()]) el.setAttribute("placeholder", EN[ph.trim()]);
    const ti = el.getAttribute("title");
    if (ti && EN[ti.trim()]) el.setAttribute("title", EN[ti.trim()]);
  });
}

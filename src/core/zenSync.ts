// First-run colour capture from Zen + ongoing bidirectional sync

const INIT_PREF = "mod.aurora.initialized";

// ── Colour derivation from a single accent ────────────────────────────────────

function lighten(hex: string, amount: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, ((n >> 16) & 0xff) + amount);
  const g = Math.min(255, ((n >>  8) & 0xff) + amount);
  const b = Math.min(255, ( n        & 0xff) + amount);
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}

function darken(hex: string, amount: number): string {
  return lighten(hex, -amount);
}

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? ((g - b) / d + (g < b ? 6 : 0)) / 6
          : max === g ? ((b - r) / d + 2) / 6
                      : ((r - g) / d + 4) / 6;
  return [h * 360, s, l];
}

function isDarkAccent(hex: string): boolean {
  const [, , l] = hexToHsl(hex);
  return l < 0.5;
}

// Build a dark-theme palette from a single accent colour
function derivePaletteFromAccent(accent: string): Record<string, string> {
  const [h] = hexToHsl(accent);
  // Create neutral dark backgrounds tinted by hue
  const bg   = `hsl(${h}, 18%, 10%)`;
  const bgMd = `hsl(${h}, 16%, 12%)`;
  const bgLt = `hsl(${h}, 14%, 15%)`;
  const text = `hsl(${h}, 60%, 92%)`;
  const brd  = `hsl(${h}, 25%, 25%)`;

  return {
    "mod.aurora.color.panel_bg":       bgMd,
    "mod.aurora.color.toolbar_bg":     bg,
    "mod.aurora.color.sidebar_bg":     bg,
    "mod.aurora.color.panel_text":     text,
    "mod.aurora.color.border":         brd,
    "mod.aurora.color.accent":         accent,
    "mod.aurora.color.tab_active_bg":  bgLt,
    "mod.aurora.color.tab_inactive_bg":bgMd,
    "mod.aurora.color.tab_text":       text,
    "mod.aurora.color.tab_close_hover":"#ff6b6b",
    "mod.aurora.color.tab_hover_bg":   bgLt,
    "mod.aurora.color.urlbar_bg":      bgMd,
    "mod.aurora.color.urlbar_text":    text,
    "mod.aurora.color.urlbar_border":  brd,
    "mod.aurora.color.urlbar_focus":   accent,
    "mod.aurora.color.browser_bg":     bg,
    "mod.aurora.color.selection_bg":   accent + "44",
    "mod.aurora.color.scrollbar":      brd,
    "mod.aurora.color.button_bg":      bgLt,
    "mod.aurora.color.button_hover":   `hsl(${h}, 20%, 22%)`,
  };
}

// ── Read current Zen accent ───────────────────────────────────────────────────

function readZenAccent(doc: Document): string | null {
  try {
    // 1. Inline style on documentElement (set by Zen per-workspace)
    const inline = doc.documentElement.style.getPropertyValue("--zen-primary-color").trim();
    if (inline && inline.startsWith("#")) return inline;

    // 2. Computed style (CSS variable from Zen's stylesheet)
    const computed = getComputedStyle(doc.documentElement)
      .getPropertyValue("--zen-primary-color").trim();
    if (computed && computed.startsWith("#")) return computed;

    // 3. Global accent pref
    const pref = Services.prefs.getStringPref("zen.theme.accent-color", "");
    if (pref && pref.startsWith("#")) return pref;
  } catch { /**/ }
  return null;
}

// ── First run ─────────────────────────────────────────────────────────────────

export function captureZenColorsOnFirstRun(doc: Document): void {
  try {
    const alreadyInit = Services.prefs.getBoolPref(INIT_PREF, false);
    if (alreadyInit) return;

    // Only run if user hasn't set any Aurora colors yet
    const hasCustomAccent = Services.prefs.prefHasUserValue("mod.aurora.color.accent");
    if (hasCustomAccent) {
      Services.prefs.setBoolPref(INIT_PREF, true);
      return;
    }

    const zenAccent = readZenAccent(doc);
    if (zenAccent) {
      const palette = derivePaletteFromAccent(zenAccent);
      for (const [pref, val] of Object.entries(palette)) {
        try { Services.prefs.setStringPref(pref, val); } catch { /**/ }
      }
      dump(`[Aurora] First run: captured Zen accent ${zenAccent}\n`);
    }

    Services.prefs.setBoolPref(INIT_PREF, true);
  } catch (e) {
    dump(`[Aurora] First-run capture error: ${e}\n`);
  }
}

// ── Ongoing sync: Zen → Aurora ────────────────────────────────────────────────

let lastKnownZenAccent = "";

function applyZenAccentToAurora(accent: string): void {
  if (accent === lastKnownZenAccent) return;
  lastKnownZenAccent = accent;

  const syncEnabled = Services.prefs.getBoolPref("mod.aurora.zen.inherit_accent", false);
  if (!syncEnabled) return;

  try {
    Services.prefs.setStringPref("mod.aurora.color.accent", accent);
    Services.prefs.setStringPref("mod.aurora.color.urlbar_focus", accent);
  } catch { /**/ }
}

// Observe zen.theme.accent-color pref changes
const zenPrefObserver = {
  observe(_s: unknown, topic: string, data: string): void {
    if (topic !== "nsPref:changed") return;
    if (data === "zen.theme.accent-color") {
      try {
        const accent = Services.prefs.getStringPref("zen.theme.accent-color", "");
        if (accent) applyZenAccentToAurora(accent);
      } catch { /**/ }
    }
  },
};

// MutationObserver for inline style changes (per-workspace accent)
let styleObserver: MutationObserver | null = null;

export function initZenSync(doc: Document): () => void {
  // Watch global accent pref
  Services.prefs.addObserver("zen.theme.accent-color", zenPrefObserver);

  // Watch inline style on documentElement (workspace switches)
  styleObserver = new MutationObserver(() => {
    const accent = doc.documentElement.style
      .getPropertyValue("--zen-primary-color").trim();
    if (accent) applyZenAccentToAurora(accent);
  });
  styleObserver.observe(doc.documentElement, {
    attributes: true,
    attributeFilter: ["style"],
  });

  return () => {
    Services.prefs.removeObserver("zen.theme.accent-color", zenPrefObserver);
    styleObserver?.disconnect();
    styleObserver = null;
    lastKnownZenAccent = "";
  };
}

import { loadTheme } from "./core/state.ts";
import { applyTheme } from "./core/cssEngine.ts";
import { initEvents } from "./core/events.ts";
import { initSpaces, refreshSpaces } from "./features/spaces.ts";
import { initOverlay } from "./ui/overlay.ts";
import { captureZenColorsOnFirstRun, initZenSync } from "./core/zenSync.ts";

let stopSpaces:  (() => void) | null = null;
let stopOverlay: (() => void) | null = null;
let stopZenSync: (() => void) | null = null;

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleApply(doc: Document): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    applyAll(doc);
  }, 80);
}

function applyAll(doc: Document): void {
  const theme = loadTheme();
  applyTheme(theme, doc);
  refreshSpaces(doc);
}

async function init(): Promise<void> {
  try {
    if (!Services.prefs.getBoolPref("mod.aurora.enabled", true)) {
      dump("[Aurora] Disabled.\n"); return;
    }
    const doc = document;

    captureZenColorsOnFirstRun(doc);
    await applyAll(doc);
    initEvents(doc);

    stopSpaces  = initSpaces(doc);
    stopOverlay = initOverlay(doc);
    stopZenSync = initZenSync(doc);

    const observer = {
      observe(_s: unknown, topic: string, data: string): void {
        if (topic !== "nsPref:changed") return;
        const key = data as string;
        if (!key.startsWith("mod.aurora.")) return;
        if (key === "mod.aurora.ui.open_panel") return;
        scheduleApply(doc);
      },
    };
    Services.prefs.addObserver("mod.aurora.", observer);

    doc.defaultView?.addEventListener("beforeunload", () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      Services.prefs.removeObserver("mod.aurora.", observer);
      stopSpaces?.(); stopOverlay?.(); stopZenSync?.();
    }, { once: true });

    dump("[Aurora] Ready.\n");
  } catch (e) {
    dump(`[Aurora] Init error: ${e}\n`);
    console.error("[Aurora] Init error:", e);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => { init(); }, { once: true });
} else {
  init();
}

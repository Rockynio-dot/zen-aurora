import { loadTheme } from "./core/state.ts";
import { applyTheme } from "./core/cssEngine.ts";
import { initEvents } from "./core/events.ts";
import { initSounds, stopSounds } from "./features/sounds.ts";
import { initDynamicTheme, stopDynamicTheme } from "./features/dynamicTheme.ts";
import { initSpaces, refreshSpaces } from "./features/spaces.ts";
import { initOverlay } from "./ui/overlay.ts";
import { captureZenColorsOnFirstRun, initZenSync } from "./core/zenSync.ts";

let soundsRunning  = false;
let dynamicRunning = false;
let stopSpaces:  (() => void) | null = null;
let stopOverlay: (() => void) | null = null;
let stopZenSync: (() => void) | null = null;

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleApply(doc: Document): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    applyAll(doc).catch((e) => dump(`[Aurora] ${e}\n`));
  }, 80);
}

async function applyAll(doc: Document): Promise<void> {
  const theme = loadTheme();
  applyTheme(theme, doc);
  refreshSpaces(doc);

  if (theme.sounds.enabled && !soundsRunning) {
    soundsRunning = true; await initSounds(theme);
  } else if (!theme.sounds.enabled && soundsRunning) {
    stopSounds(); soundsRunning = false;
  }

  if (theme.dynamicMode !== "off" && !dynamicRunning) {
    dynamicRunning = true; initDynamicTheme(doc);
  } else if (theme.dynamicMode === "off" && dynamicRunning) {
    stopDynamicTheme(); dynamicRunning = false;
  }
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
      stopSounds(); stopDynamicTheme();
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

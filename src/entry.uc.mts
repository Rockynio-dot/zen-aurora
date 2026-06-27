import { loadTheme } from "./core/state.ts";
import { applyTheme } from "./core/cssEngine.ts";
import { initEvents } from "./core/events.ts";
import { initSounds, stopSounds } from "./features/sounds.ts";
import { initDynamicTheme, stopDynamicTheme } from "./features/dynamicTheme.ts";
import { initSpaces, refreshSpaces } from "./features/spaces.ts";
import { initPanel } from "./ui/panel.ts";
import { captureZenColorsOnFirstRun, initZenSync } from "./core/zenSync.ts";

let soundsRunning  = false;
let dynamicRunning = false;
let stopSpaces:   (() => void) | null = null;
let stopPanel:    (() => void) | null = null;
let stopZenSync:  (() => void) | null = null;

// Debounce: collapse rapid pref-change bursts into one apply
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleApply(doc: Document): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    applyAll(doc).catch((e) => dump(`[Aurora] debounce apply error: ${e}\n`));
  }, 80);
}

async function applyAll(doc: Document): Promise<void> {
  const theme = loadTheme();

  // Inject base CSS
  applyTheme(theme, doc);

  // Per-space colour overrides + Zen primary-color sync
  refreshSpaces(doc);

  // Sounds
  if (theme.sounds.enabled && !soundsRunning) {
    soundsRunning = true;
    await initSounds(theme);
  } else if (!theme.sounds.enabled && soundsRunning) {
    stopSounds();
    soundsRunning = false;
  }

  // Dynamic theme
  if (theme.dynamicMode !== "off" && !dynamicRunning) {
    dynamicRunning = true;
    initDynamicTheme(doc);
  } else if (theme.dynamicMode === "off" && dynamicRunning) {
    stopDynamicTheme();
    dynamicRunning = false;
  }
}

async function init(): Promise<void> {
  try {
    const enabled = Services.prefs.getBoolPref("mod.aurora.enabled", true);
    if (!enabled) { dump("[Aurora] Disabled.\n"); return; }

    const doc = document;

    // First-run: capture Zen's current colour scheme
    captureZenColorsOnFirstRun(doc);

    await applyAll(doc);
    initEvents(doc);

    // Space watcher
    stopSpaces  = initSpaces(doc);

    // Colour panel (sidebar button + floating panel)
    stopPanel   = initPanel(doc);

    // Zen theme sync (ongoing)
    stopZenSync = initZenSync(doc);

    // Pref observer — debounced, ignores the panel-open trigger
    const observer = {
      observe(_s: unknown, topic: string, data: string): void {
        if (topic !== "nsPref:changed") return;
        const key = data as string;
        if (!key.startsWith("mod.aurora.")) return;
        if (key === "mod.aurora.ui.open_panel") return; // handled by panel itself
        scheduleApply(doc);
      },
    };
    Services.prefs.addObserver("mod.aurora.", observer);

    doc.defaultView?.addEventListener("beforeunload", () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      Services.prefs.removeObserver("mod.aurora.", observer);
      stopSounds();
      stopDynamicTheme();
      stopSpaces?.();
      stopPanel?.();
      stopZenSync?.();
    }, { once: true });

    dump("[Aurora] Loaded.\n");
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

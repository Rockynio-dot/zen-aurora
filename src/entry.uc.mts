import { loadTheme } from "./core/state.ts";
import { applyTheme } from "./core/cssEngine.ts";
import { initEvents } from "./core/events.ts";
import { initSounds, stopSounds } from "./features/sounds.ts";
import { initDynamicTheme, stopDynamicTheme } from "./features/dynamicTheme.ts";

let soundsRunning = false;
let dynamicRunning = false;

async function applyAll(doc: Document): Promise<void> {
  const theme = loadTheme();
  applyTheme(theme, doc);

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
    if (!enabled) {
      dump("[Aurora] Disabled via preferences.\n");
      return;
    }

    const doc = document;

    await applyAll(doc);
    initEvents(doc);

    // Live preference observer — fires when any mod.aurora.* pref changes
    const observer = {
      observe(_subject: unknown, topic: string, data: string): void {
        if (topic === "nsPref:changed" && (data as string).startsWith("mod.aurora.")) {
          applyAll(doc).catch((e) => dump(`[Aurora] Observer error: ${e}\n`));
        }
      },
    };
    Services.prefs.addObserver("mod.aurora.", observer);

    // Clean up observer when window closes
    doc.defaultView?.addEventListener("beforeunload", () => {
      Services.prefs.removeObserver("mod.aurora.", observer);
      stopSounds();
      stopDynamicTheme();
    }, { once: true });

    dump("[Aurora] Loaded successfully.\n");
  } catch (e) {
    dump(`[Aurora] Error during init: ${e}\n`);
    console.error("[Aurora] Error during init:", e);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => { init(); }, { once: true });
} else {
  init();
}

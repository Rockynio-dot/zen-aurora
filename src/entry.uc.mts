import { loadTheme } from "./core/state.ts";
import { applyTheme } from "./core/cssEngine.ts";
import { initEvents } from "./core/events.ts";
import { initSounds, stopSounds } from "./features/sounds.ts";
import { initDynamicTheme, stopDynamicTheme } from "./features/dynamicTheme.ts";
import { initSpaces, refreshSpaces } from "./features/spaces.ts";
import { initPanel } from "./ui/panel.ts";

let soundsRunning  = false;
let dynamicRunning = false;
let stopSpaces:  (() => void) | null = null;
let stopPanel:   (() => void) | null = null;

async function applyAll(doc: Document): Promise<void> {
  const theme = loadTheme();
  applyTheme(theme, doc);
  refreshSpaces(doc);

  if (theme.sounds.enabled && !soundsRunning) {
    soundsRunning = true;
    await initSounds(theme);
  } else if (!theme.sounds.enabled && soundsRunning) {
    stopSounds();
    soundsRunning = false;
  }

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
      dump("[Aurora] Disabled.\n");
      return;
    }

    const doc = document;

    await applyAll(doc);
    initEvents(doc);
    stopSpaces = initSpaces(doc);
    stopPanel  = initPanel(doc);

    const observer = {
      observe(_subject: unknown, topic: string, data: string): void {
        if (topic === "nsPref:changed" && (data as string).startsWith("mod.aurora.")) {
          applyAll(doc).catch((e) => dump(`[Aurora] Observer error: ${e}\n`));
        }
      },
    };
    Services.prefs.addObserver("mod.aurora.", observer);

    doc.defaultView?.addEventListener("beforeunload", () => {
      Services.prefs.removeObserver("mod.aurora.", observer);
      stopSounds();
      stopDynamicTheme();
      stopSpaces?.();
      stopPanel?.();
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

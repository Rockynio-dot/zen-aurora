// Aurora — entry point loaded by Sine in chrome context

import { loadTheme } from "./core/state.ts";
import { applyTheme } from "./core/cssEngine.ts";
import { initEvents } from "./core/events.ts";
import { initSounds } from "./features/sounds.ts";
import { initDynamicTheme } from "./features/dynamicTheme.ts";

async function init(): Promise<void> {
  try {
    const enabled = Services.prefs.getBoolPref("mod.aurora.enabled", true);
    if (!enabled) {
      dump("[Aurora] Disabled via preferences.\n");
      return;
    }

    const theme = loadTheme();

    applyTheme(theme, document);
    initEvents(document);

    if (theme.sounds.enabled) {
      await initSounds(theme);
    }

    if (theme.dynamicMode !== "off") {
      initDynamicTheme(document);
    }

    dump("[Aurora] Loaded successfully.\n");
  } catch (e) {
    dump(`[Aurora] Error during init: ${e}\n`);
    console.error("[Aurora] Error during init:", e);
  }
}

// Try immediately, and also on DOMContentLoaded as fallback
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => { init(); }, { once: true });
} else {
  init();
}

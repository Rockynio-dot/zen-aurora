// Aurora — entry point loaded by Sine/fx-autoconfig in chrome context

import { loadTheme } from "./core/state.ts";
import { applyTheme } from "./core/cssEngine.ts";
import { initEvents } from "./core/events.ts";
import { initSounds } from "./features/sounds.ts";
import { initDynamicTheme } from "./features/dynamicTheme.ts";

async function init(): Promise<void> {
  const enabled = Services.prefs.getBoolPref("mod.aurora.enabled", true);
  if (!enabled) {
    dump("[Aurora] Disabled via preferences.\n");
    return;
  }

  const theme = loadTheme();
  const doc = document;

  // Apply static styles immediately
  applyTheme(theme, doc);

  // Wire up global browser events (keyboard, tabs, panels)
  initEvents(doc);

  // Start sound engine if enabled
  if (theme.sounds.enabled) {
    await initSounds(theme);
  }

  // Start dynamic theme engine (Material You / day-night)
  if (theme.dynamicMode !== "off") {
    initDynamicTheme(doc);
  }

  dump("[Aurora] Loaded successfully.\n");
}

// Wait for browser window to be fully ready
UC_API.Runtime.startupFinished().then(() => init()).catch((e: unknown) => {
  dump(`[Aurora] Startup error: ${e}\n`);
});

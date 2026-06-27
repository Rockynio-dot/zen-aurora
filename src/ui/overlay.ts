// Opens the Aurora settings window (chrome://aurora/content/settings.html).
// The window has full chrome privileges via Sine's chromeManifest registration.

export function openSettingsWindow(): void {
  // Focus existing window if already open
  try {
    const wins = Services.wm.getEnumerator(null);
    while (wins.hasMoreElements()) {
      const win = wins.getNext() as Window & { _auroraSettings?: boolean };
      if (win._auroraSettings) { win.focus(); return; }
    }
  } catch {}

  Services.ww.openWindow(
    null,
    "chrome://aurora/content/settings.html",
    "_blank",
    "chrome,dialog=no,resizable,width=1024,height=720,centerscreen",
    null
  );
}

// Called from entry.uc.mts — sets up the pref observer that Sine's checkbox triggers.
export function initOverlay(_doc: Document): () => void {
  const prefObs = {
    observe(_s: unknown, topic: string, data: string): void {
      if (topic !== "nsPref:changed" || data !== "mod.aurora.ui.open_panel") return;
      try {
        if (Services.prefs.getBoolPref("mod.aurora.ui.open_panel", false)) {
          openSettingsWindow();
          Services.prefs.setBoolPref("mod.aurora.ui.open_panel", false);
        }
      } catch {}
    },
  };
  Services.prefs.addObserver("mod.aurora.ui.open_panel", prefObs);
  return () => Services.prefs.removeObserver("mod.aurora.ui.open_panel", prefObs);
}

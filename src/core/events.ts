type AuroraEventType =
  | "keydown"
  | "tab-open"
  | "tab-close"
  | "tab-click"
  | "panel-show"
  | "panel-hide";

type AuroraEventListener = (type: AuroraEventType) => void;

const listeners = new Set<AuroraEventListener>();

export function onAuroraEvent(fn: AuroraEventListener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit(type: AuroraEventType): void {
  for (const fn of listeners) fn(type);
}

export function initEvents(chromeDoc: Document): void {
  // Keyboard events (capture phase catches URL bar, search, etc.)
  chromeDoc.addEventListener(
    "keydown",
    () => emit("keydown"),
    { capture: true, passive: true }
  );

  // Tab events via browser window
  const browser = (chromeDoc.defaultView as Window & { gBrowser?: { tabContainer?: EventTarget } })
    ?.gBrowser;

  if (browser?.tabContainer) {
    browser.tabContainer.addEventListener("TabOpen", () => emit("tab-open"));
    browser.tabContainer.addEventListener("TabClose", () => emit("tab-close"));
    browser.tabContainer.addEventListener("TabSelect", () => emit("tab-click"));
  }

  // Popup/panel events
  chromeDoc.addEventListener("popupshowing", () => emit("panel-show"), { capture: true, passive: true });
  chromeDoc.addEventListener("popuphiding", () => emit("panel-hide"), { capture: true, passive: true });
}

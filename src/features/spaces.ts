import { loadTheme } from "../core/state.ts";
import { applyTheme, generateCSS, injectStyles } from "../core/cssEngine.ts";
import type { AuroraTheme } from "../core/state.ts";

// ── Helpers ──────────────────────────────────────────────────────────────────

function getZenSpaces(): { uuid: string; name: string }[] {
  try {
    const gZen = (window as Record<string, unknown>).gZenWorkspaces as {
      _workspaceCache?: { uuid: string; name: string }[];
    } | undefined;
    return gZen?._workspaceCache ?? [];
  } catch {
    return [];
  }
}

function getActiveSpaceIndex(): number {
  try {
    const gZen = (window as Record<string, unknown>).gZenWorkspaces as {
      _workspaceCache?: { uuid: string }[];
      activeWorkspace?: string;
    } | undefined;
    const uuid = gZen?.activeWorkspace;
    if (!uuid) return -1;
    return (gZen?._workspaceCache ?? []).findIndex((s) => s.uuid === uuid);
  } catch {
    return -1;
  }
}

function spaceColor(idx: number, suffix: string, fallback: string): string {
  try {
    const val = Services.prefs.getStringPref(
      `mod.aurora.space.${idx + 1}.${suffix}`,
      ""
    );
    return val || fallback;
  } catch {
    return fallback;
  }
}

// ── CSS generation per active space ──────────────────────────────────────────

function buildSpaceCSS(spaceIdx: number, base: AuroraTheme): string {
  if (spaceIdx < 0) return "";

  const accent   = spaceColor(spaceIdx, "accent",   base.colors.accent);
  const panelBg  = spaceColor(spaceIdx, "panel_bg", base.colors.panelBg);
  const toolbarBg= spaceColor(spaceIdx, "toolbar_bg",base.colors.toolbarBg);
  const sidebarBg= spaceColor(spaceIdx, "sidebar_bg",base.colors.sidebarBg);
  const tabActive= spaceColor(spaceIdx, "tab_active_bg", base.colors.tabActiveBg);
  const urlFocus = spaceColor(spaceIdx, "urlbar_focus",  accent);

  // Only inject if at least one override is set
  const hasOverrides = [accent, panelBg, toolbarBg, sidebarBg, tabActive]
    .some((v, i) => {
      const defaults = [
        base.colors.accent, base.colors.panelBg,
        base.colors.toolbarBg, base.colors.sidebarBg,
        base.colors.tabActiveBg,
      ];
      return v !== defaults[i];
    });

  if (!hasOverrides) return "";

  return `
/* Aurora — Space ${spaceIdx + 1} overrides */
:root {
  --aurora-accent:       ${accent} !important;
  --aurora-panel-bg:     ${panelBg} !important;
  --aurora-toolbar-bg:   ${toolbarBg} !important;
  --aurora-sidebar-bg:   ${sidebarBg} !important;
  --aurora-tab-active-bg:${tabActive} !important;
  --aurora-urlbar-focus: ${urlFocus} !important;
}`.trim();
}

// ── Zen native variable sync ──────────────────────────────────────────────────

function syncZenPrimaryColor(accent: string): void {
  try {
    const syncEnabled = Services.prefs.getBoolPref(
      "mod.aurora.zen.sync_primary_color",
      true
    );
    if (!syncEnabled) return;
    // Override Zen's inline --zen-primary-color with our accent
    // We use the style element approach since inline > stylesheet,
    // but our injected style uses !important which wins over normal inline
    document.documentElement.style.setProperty("--zen-primary-color", accent);
  } catch {
    // Not a Zen window or pref missing
  }
}

// ── Main apply ───────────────────────────────────────────────────────────────

const SPACE_STYLE_ID = "aurora-space-styles";

function applySpaceStyles(doc: Document): void {
  const theme = loadTheme();
  const idx   = getActiveSpaceIndex();
  const spaceCSS = buildSpaceCSS(idx, theme);

  let el = doc.getElementById(SPACE_STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = doc.createElement("style") as HTMLStyleElement;
    el.id = SPACE_STYLE_ID;
    (doc.head ?? doc.documentElement).appendChild(el);
  }
  el.textContent = spaceCSS;

  // Sync --zen-primary-color: use per-space accent or global accent
  const activeAccent = idx >= 0
    ? (spaceColor(idx, "accent", theme.colors.accent))
    : theme.colors.accent;
  syncZenPrimaryColor(activeAccent);
}

// ── Workspace change detection ────────────────────────────────────────────────

let lastSpaceIdx = -2;

function onPossibleSpaceChange(doc: Document): void {
  const idx = getActiveSpaceIndex();
  if (idx !== lastSpaceIdx) {
    lastSpaceIdx = idx;
    applySpaceStyles(doc);
  }
}

export function initSpaces(doc: Document): () => void {
  // Initial apply
  applySpaceStyles(doc);

  // Watch documentElement inline style changes — Zen sets --zen-primary-color
  // inline when workspace changes, so this catches every switch
  const styleObserver = new MutationObserver(() => {
    onPossibleSpaceChange(doc);
  });
  styleObserver.observe(doc.documentElement, {
    attributes: true,
    attributeFilter: ["style"],
  });

  // Also listen to TabSelect (fires on workspace switch)
  const onTabSelect = () => onPossibleSpaceChange(doc);
  doc.addEventListener("TabSelect", onTabSelect, { capture: true });

  return () => {
    styleObserver.disconnect();
    doc.removeEventListener("TabSelect", onTabSelect, true);
    doc.getElementById(SPACE_STYLE_ID)?.remove();
  };
}

export function refreshSpaces(doc: Document): void {
  lastSpaceIdx = -2; // force re-apply
  applySpaceStyles(doc);
}

export function getSpaceList(): { index: number; uuid: string; name: string }[] {
  return getZenSpaces().map((s, i) => ({ index: i, uuid: s.uuid, name: s.name }));
}

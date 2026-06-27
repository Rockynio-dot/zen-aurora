import type { AuroraTheme } from "./state.ts";

const STYLE_ID = "aurora-dynamic-styles";

const ANIMATION_DURATIONS: Record<string, string> = {
  none: "0s",
  slow: "0.5s",
  normal: "0.2s",
  fast: "0.08s",
};

export function generateCSS(theme: AuroraTheme): string {
  const animDuration = ANIMATION_DURATIONS[theme.animations.speed] ?? "0.2s";

  const bgImage = theme.images.browserBg
    ? `url("${theme.images.browserBg}")`
    : "none";

  return `
    :root {
      --aurora-panel-bg: ${theme.colors.panelBg};
      --aurora-panel-text: ${theme.colors.panelText};
      --aurora-border: ${theme.colors.border};
      --aurora-browser-bg: ${theme.colors.browserBg};
      --aurora-accent: ${theme.colors.accent};
      --aurora-anim: ${animDuration};
      --aurora-bg-image: ${bgImage};
    }

    #navigator-toolbox,
    #sidebar-box,
    #TabsToolbar {
      background-color: var(--aurora-panel-bg) !important;
      color: var(--aurora-panel-text) !important;
      border-color: var(--aurora-border) !important;
    }

    #browser {
      background: var(--aurora-browser-bg) var(--aurora-bg-image) center/cover no-repeat !important;
    }

    .tab-background,
    .tabbrowser-tab[selected] .tab-background {
      transition: background-color var(--aurora-anim) ease,
                  opacity var(--aurora-anim) ease !important;
    }

    toolbarbutton,
    .tab-close-button {
      transition: opacity var(--aurora-anim) ease !important;
    }

    ${theme.animations.speed === "none" ? "* { transition: none !important; animation: none !important; }" : ""}
  `.trim();
}

export function injectStyles(css: string, targetDoc: Document = document): void {
  let el = targetDoc.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = targetDoc.createElement("style") as HTMLStyleElement;
    el.id = STYLE_ID;
    (targetDoc.head ?? targetDoc.documentElement).appendChild(el);
  }
  el.textContent = css;
}

export function removeStyles(targetDoc: Document = document): void {
  targetDoc.getElementById(STYLE_ID)?.remove();
}

export function applyTheme(theme: AuroraTheme, targetDoc: Document = document): void {
  const css = generateCSS(theme);
  injectStyles(css, targetDoc);
}

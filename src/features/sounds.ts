import { onAuroraEvent } from "../core/events.ts";
import type { AuroraTheme } from "../core/state.ts";

interface SoundPack {
  keydown: string[];
  tabOpen: string[];
  tabClose: string[];
  tabClick: string[];
  panelShow: string[];
  panelHide: string[];
}

let audioCtx: AudioContext | null = null;
let buffers: Map<string, AudioBuffer[]> = new Map();
let roundRobinIdx: Map<string, number> = new Map();
let cleanup: (() => void) | null = null;

const DEFAULT_PACK: SoundPack = {
  keydown: [],
  tabOpen: [],
  tabClose: [],
  tabClick: [],
  panelShow: [],
  panelHide: [],
};

async function loadBuffer(ctx: AudioContext, base64: string): Promise<AudioBuffer> {
  const binary = atob(base64.replace(/^data:[^;]+;base64,/, ""));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return ctx.decodeAudioData(bytes.buffer);
}

async function loadPack(pack: SoundPack): Promise<void> {
  if (!audioCtx) audioCtx = new AudioContext();
  buffers.clear();
  roundRobinIdx.clear();

  const entries = Object.entries(pack) as [keyof SoundPack, string[]][];
  await Promise.all(
    entries.map(async ([key, srcs]) => {
      if (!srcs.length) return;
      const loaded = await Promise.all(srcs.map((s) => loadBuffer(audioCtx!, s)));
      buffers.set(key, loaded);
      roundRobinIdx.set(key, 0);
    })
  );
}

function play(key: string): void {
  if (!audioCtx || !buffers.has(key)) return;
  const bufs = buffers.get(key)!;
  if (!bufs.length) return;

  const idx = roundRobinIdx.get(key) ?? 0;
  roundRobinIdx.set(key, (idx + 1) % bufs.length);

  const source = audioCtx.createBufferSource();
  source.buffer = bufs[idx];
  source.connect(audioCtx.destination);
  source.start();
}

// Throttle keydown to avoid audio graph flooding
let lastKeyTime = 0;
const KEY_THROTTLE_MS = 30;

export async function initSounds(theme: AuroraTheme): Promise<void> {
  stopSounds();
  if (!theme.sounds.enabled) return;

  const pack: SoundPack = theme.sounds.customPack
    ? (theme.sounds.customPack as unknown as SoundPack)
    : DEFAULT_PACK;

  await loadPack(pack);

  const unsub = onAuroraEvent((type) => {
    switch (type) {
      case "keydown": {
        const now = Date.now();
        if (now - lastKeyTime < KEY_THROTTLE_MS) return;
        lastKeyTime = now;
        play("keydown");
        break;
      }
      case "tab-open": play("tabOpen"); break;
      case "tab-close": play("tabClose"); break;
      case "tab-click": play("tabClick"); break;
      case "panel-show": play("panelShow"); break;
      case "panel-hide": play("panelHide"); break;
    }
  });

  cleanup = unsub;
}

export function stopSounds(): void {
  cleanup?.();
  cleanup = null;
  audioCtx?.close();
  audioCtx = null;
  buffers.clear();
}

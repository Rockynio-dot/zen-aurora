// Type definitions for fx-autoconfig UC_API
// https://github.com/MrOtherGuy/fx-autoconfig

declare const UC_API: {
  FileSystem: {
    getEntry(path: string): UCFileEntry | null;
    readFile(path: string): string | null;
    writeFile(path: string, content: string): boolean;
    deleteFile(path: string): boolean;
    profileDir: string;
  };
  Hotkey: {
    define(opts: {
      id: string;
      key: string;
      modifiers?: string;
      command: () => void;
    }): void;
  };
  Runtime: {
    startupFinished(): Promise<void>;
    windows: Window[];
  };
  Stylesheet: {
    load(opts: { uri: string; type?: "agent" | "author" | "user" }): void;
    unload(uri: string): void;
  };
};

interface UCFileEntry {
  path: string;
  exists: boolean;
  read(): string | null;
  write(content: string): boolean;
}

declare const Services: {
  prefs: {
    getBoolPref(pref: string, defaultValue?: boolean): boolean;
    getStringPref(pref: string, defaultValue?: string): string;
    getIntPref(pref: string, defaultValue?: number): number;
    getCharPref(pref: string, defaultValue?: string): string;
    setStringPref(pref: string, value: string): void;
    setBoolPref(pref: string, value: boolean): void;
    setIntPref(pref: string, value: number): void;
    setCharPref(pref: string, value: string): void;
    clearUserPref(pref: string): void;
    prefHasUserValue(pref: string): boolean;
    addObserver(domain: string, observer: NsIObserver | (() => void), holdWeak?: boolean): void;
    removeObserver(domain: string, observer: NsIObserver | (() => void)): void;
  };
  wm: {
    getMostRecentWindow(type: string): Window | null;
    getEnumerator(type: string | null): { hasMoreElements(): boolean; getNext(): Window };
  };
  ww: {
    openWindow(
      parent: Window | null,
      url: string,
      name: string,
      features: string,
      args: unknown,
    ): Window | null;
  };
  io: {
    newURI(spec: string): { spec: string };
  };
  obs: {
    notifyObservers(subject: unknown, topic: string, data?: string): void;
    addObserver(observer: NsIObserver, topic: string, ownsWeak?: boolean): void;
    removeObserver(observer: NsIObserver, topic: string): void;
  };
};

interface NsIObserver {
  observe(subject: unknown, topic: string, data: string): void;
}

declare const ChromeUtils: {
  import(uri: string): unknown;
  defineESModuleGetters(target: object, modules: Record<string, string>): void;
};

declare function dump(msg: string): void;

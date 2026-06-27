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
    setStringPref(pref: string, value: string): void;
    setBoolPref(pref: string, value: boolean): void;
  };
  wm: {
    getMostRecentWindow(type: string): Window | null;
    getEnumerator(type: string): { hasMoreElements(): boolean; getNext(): Window };
  };
  io: {
    newURI(spec: string): { spec: string };
  };
};

declare const ChromeUtils: {
  import(uri: string): unknown;
  defineESModuleGetters(target: object, modules: Record<string, string>): void;
};

declare function dump(msg: string): void;

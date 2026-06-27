import * as esbuild from "esbuild";
import { argv } from "process";

const watch = argv.includes("--watch");

/** @type {import('esbuild').Plugin} */
const externalGeckoPlugin = {
  name: "external-gecko",
  setup(build) {
    build.onResolve({ filter: /^(chrome|resource):\/\// }, (args) => ({
      path: args.path,
      external: true,
    }));
  },
};

const baseConfig = {
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "firefox128",
  outExtension: { ".js": ".mjs" },
  plugins: [externalGeckoPlugin],
  external: ["@material/material-color-utilities"],
};

const configs = [
  {
    ...baseConfig,
    entryPoints: ["src/entry.uc.mts"],
    outdir: "dist",
    banner: {
      js: [
        "// ==UserScript==",
        "// @name           Aurora",
        "// @description    Complete UI overhaul for Zen Browser",
        "// @author         Rockynio-dot",
        "// @version        0.1.0",
        "// @include        main",
        "// ==/UserScript==",
      ].join("\n"),
    },
  },
];

if (watch) {
  const contexts = await Promise.all(configs.map((c) => esbuild.context(c)));
  await Promise.all(contexts.map((ctx) => ctx.watch()));
  console.log("[Aurora] Watching for changes...");
} else {
  await Promise.all(configs.map((c) => esbuild.build(c)));
  console.log("[Aurora] Build complete.");
}

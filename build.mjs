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
  format: "iife",
  platform: "browser",
  target: "firefox128",
  plugins: [externalGeckoPlugin],
};

const configs = [
  {
    ...baseConfig,
    entryPoints: ["src/entry.uc.mts"],
    outdir: "dist",
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

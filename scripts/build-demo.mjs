import { build } from "esbuild";
import { mkdir, readFile, writeFile, cp, rm } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const output = path.join(root, "dist-demo");
const temporary = path.join(root, ".sites-runtime/demo");
const prefix = process.env.DEMO_BASE_PATH || "";
if (!/^\/[a-zA-Z0-9-]+$|^$/.test(prefix))
  throw new Error("DEMO_BASE_PATH must be empty or one URL path segment.");

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await mkdir(temporary, { recursive: true });
await cp(path.join(root, "public/assets"), path.join(output, "assets"), {
  recursive: true,
});
await cp(
  path.join(root, "public/favicon.svg"),
  path.join(output, "favicon.svg"),
);

const renderer = path.join(temporary, "render.mjs");
await build({
  entryPoints: ["scripts/render-demo.tsx"],
  outfile: renderer,
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  jsx: "automatic",
});
const { renderDemo } = await import(pathToFileURL(renderer).href);
const markup = renderDemo(prefix);
const css = (await readFile("app/globals.css", "utf8")).replace(
  /\@import url\(["']\/assets\/fonts\.css["']\);/,
  "@import url('./fonts.css');",
);
await writeFile(path.join(output, "assets/site.css"), css);
await build({
  entryPoints: ["scripts/demo-client.tsx"],
  outfile: path.join(output, "assets/demo.js"),
  bundle: true,
  minify: true,
  platform: "browser",
  format: "iife",
  target: "es2022",
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  legalComments: "linked",
});
await writeFile(
  path.join(output, "index.html"),
  `<!doctype html><html lang="en" data-asset-prefix="${prefix}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Country Road Cabins — Homepage Concept</title><meta name="description" content="An independent homepage concept for Country Road Cabins, Hico, West Virginia."><link rel="icon" href="${prefix}/favicon.svg"><link rel="stylesheet" href="${prefix}/assets/site.css"></head><body><div id="root">${markup}</div><script defer src="${prefix}/assets/demo.js"></script></body></html>`,
);
await writeFile(path.join(output, ".nojekyll"), "");
console.log(
  `Shareable demo built at ${output}; asset prefix: ${prefix || "/"}`,
);

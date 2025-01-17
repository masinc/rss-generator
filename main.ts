import { chromium } from "playwright";
import * as log from "@std/log";
import { generators } from "./src/sites/mod.ts";

function getBrowserPath() {
  const paths = [
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ];

  for (const path of paths) {
    try {
      Deno.statSync(path);
      return path;
    } catch (_err) {
      continue;
    }
  }
}

async function main() {
  const browser = await chromium.launch({
    executablePath: getBrowserPath(),
  });
  try {
    const ctx = await browser.newContext();

    for await (const { name, generate } of generators) {
      log.info(`Generating ${name}`);
      await generate({ ctx, destDir: "./dist" });
    }
  } finally {
    await browser.close();
  }
}
// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  main().catch((err) => {
    console.error(err);
    Deno.exit(1);
  });
}

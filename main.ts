import { chromium } from "playwright";
import * as log from "@std/log";
import { generators } from "./src/sites/mod.ts";

function getBrowserPath() {
  if (Deno.env.get("BROWSER")) {
    return Deno.env.get("BROWSER");
  }
}

async function main() {
  const browser = await chromium.launch({
    executablePath: getBrowserPath(),
    args: ["--disable-dev-shm-usage"],
  });

  const browserType = browser.browserType();
  log.info(`Browser name: ${browserType.name()}`);
  log.info(`Browser version: ${await browser.version()}`);
  log.info(`Browser path: ${browser.browserType().executablePath()}`);

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

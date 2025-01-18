import { chromium } from "playwright";
import * as log from "@std/log";
import { generators } from "./src/sites/mod.ts";

function getBrowserPath() {
  if (Deno.env.get("BROWSER")) {
    return Deno.env.get("BROWSER");
  }
}

async function main() {
  const executablePath = getBrowserPath();
  if (executablePath) {
    log.info(`Using browser at ${executablePath}`);
  }

  const browser = await chromium.launch({
    executablePath,
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

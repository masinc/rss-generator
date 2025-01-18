import { chromium } from "playwright";
import * as log from "@std/log";
import { generators } from "./src/sites/mod";

async function main() {
  const browser = await chromium.launch({
    args: ["--disable-dev-shm-usage", "--disable-gpu", "--single-process"],
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

await main();

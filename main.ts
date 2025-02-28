import * as fs from "node:fs/promises";
import * as log from "@std/log";
import { chromium } from "playwright";
import { generateHtml, generators } from "./src/sites";

async function main() {
  const browser = await chromium.launch({
    args: ["--disable-dev-shm-usage", "--disable-gpu", "--single-process"],
  });

  const browserType = browser.browserType();
  log.info(`Browser name: ${browserType.name()}`);
  log.info(`Browser version: ${await browser.version()}`);
  log.info(`Browser path: ${browser.browserType().executablePath()}`);

  const services = [];

  try {
    const ctx = await browser.newContext();

    for await (const { id: name, generate } of generators) {
      log.info(`Generating ${name}`);
      services.push(await generate({ ctx, destDir: "./dist" }));
    }
  } finally {
    await browser.close();
  }

  log.info("Generating index.html");
  const html = await generateHtml(services);
  await fs.writeFile("./dist/index.html", html);
}

await main();

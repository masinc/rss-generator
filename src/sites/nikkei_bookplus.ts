import * as fs from "node:fs/promises";
import * as log from "@std/log";
import type { BrowserContext, Page } from "playwright";
import { type GenerateResult, getRssUrl } from ".";
import { mkdirp } from "../mkdirp";
import { type RssData, type RssItem, generateRss } from "../rss";

export const serviceId = "nikkei-bookplus";
export const serviceTitle = "日経BOOKプラス";

async function fetch({
  url,
  page,
}: {
  url: string;
  page: Page;
}): Promise<RssData> {
  log.info(`Fetching ${url}`);
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  const title = await page.title();

  log.info(`Title: ${title}`);

  const itemsElm = await page.$$(
    "section.listSection .articleList .articleListItems > .articleListItem"
  );

  log.info(`Found ${itemsElm.length} items`);

  const item: RssItem[] = [];

  for await (const itemElm of itemsElm) {
    const linkElm = await itemElm.$("a");
    const link = await linkElm?.getAttribute("href");
    log.debug({ linkElm: !!linkElm, link });

    const descElm = await linkElm?.$(".-text-wrap > .-titles-wrap");
    log.debug({ descElm: !!descElm });

    const titleElm = await descElm?.$("._title");
    const title = await titleElm?.innerText();
    log.debug({ titleElm: !!titleElm, title });

    const timeElm = await descElm?.$("._date > time");
    const time = await timeElm?.getAttribute("datetime");
    log.debug({ timeElm: !!timeElm, time });

    if (link && title && time) {
      const resolvedLink = new URL(link, url).href;
      item.push({
        title,
        link: resolvedLink,
        pubDate: new Date(time),
      });
    }
  }

  return {
    title,
    link: url,
    items: item,
  };
}

export async function generate({
  ctx,
  destDir,
}: {
  ctx: BrowserContext;
  destDir: string;
}): Promise<GenerateResult> {
  const outputDir = `${destDir}/${serviceId}`;
  await mkdirp(outputDir);

  const pages = [
    {
      filename: "business.xml",
      url: "https://bookplus.nikkei.com/business/",
    },
    {
      filename: "technology.xml",
      url: "https://bookplus.nikkei.com/technology/",
    },
    {
      filename: "life.xml",
      url: "https://bookplus.nikkei.com/life/",
    },
  ];

  const filePrmises = [];
  const generateItems = [];

  const page = await ctx.newPage();

  try {
    for await (const { filename, url } of pages) {
      const destPath = `${outputDir}/${filename}`;

      const rssData = await fetch({ url, page });
      const rss = generateRss(rssData);

      log.info(`Writing ${destPath}`);
      filePrmises.push(fs.writeFile(destPath, rss));

      generateItems.push({
        title: rssData.title,
        link: rssData.link,
        rss: getRssUrl(filename),
      });
    }
  } finally {
    await page.close();
  }

  await Promise.all(filePrmises);

  return {
    title: serviceTitle,
    items: generateItems,
  };
}

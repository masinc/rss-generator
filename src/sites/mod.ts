import type { BrowserContext } from "playwright";
import * as nikkeiBookplus from "./nikkei_bookplus";
import * as marked from "marked";

export async function generateHtml(items: GenerateItem[]) {
  const md = items
    .map((item) => {
      return `## [${item.title}](${item.link})
[${item.rss}](${item.rss})`;
    })
    .join("\n");

  return await marked.parse(md);
}

export function getRssUrl(filePath: string) {
  return `https://masinc.github.io/rss-generator/nikkei-bookplus/${filePath}`;
}

export const generators = [
  {
    name: nikkeiBookplus.serviceName,
    generate: nikkeiBookplus.generate,
  },
];

export interface GenerateItem {
  title: string;
  link: string;
  rss: string;
}

export type GenerateFunction = (args: {
  ctx: BrowserContext;
  destDir: string;
}) => Promise<GenerateItem[]>;

import * as marked from "marked";
import type { BrowserContext } from "playwright";
import * as nikkeiBookplus from "./nikkei_bookplus";

export async function generateHtml(services: GenerateResult[]) {
  const md = services
    .map(
      (svc) => `# ${svc.title}

${svc.items
  .map(
    (item) => `## [${item.title}](${item.link})

[${item.rss}](${item.rss})`
  )
  .join("\n")}`
    )
    .join("\n");

  return await marked.parse(md);
}

export function getRssUrl(filePath: string) {
  return `https://masinc.github.io/rss-generator/nikkei-bookplus/${filePath}`;
}

export const generators = [
  {
    id: nikkeiBookplus.serviceId,
    generate: nikkeiBookplus.generate,
  },
];

export interface GenerateItem {
  title: string;
  link: string;
  rss: string;
}

export interface GenerateResult {
  title: string;
  items: GenerateItem[];
}

export type GenerateFunction = (args: {
  ctx: BrowserContext;
  destDir: string;
}) => Promise<GenerateResult>;

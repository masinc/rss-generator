import { stringify } from "@libs/xml";

export interface RssData {
  title: string;
  description?: string;
  link: string;
  items: RssItem[];
}

export interface RssItem {
  title: string;
  description?: string;
  link: string;
  pubDate: Date;
}

export function generateRss(data: RssData): string {
  const items = data.items.map((item) => ({
    title: item.title,
    ...(item.description && { description: item.description }),
    link: item.link,
    pubDate: item.pubDate.toUTCString(),
  }));

  const rss = {
    "@version": "1.0",
    "@encoding": "UTF-8",
    rss: {
      "@version": "2.0",
      "@encoding": "UTF-8",
      channel: {
        title: data.title,
        ...(data.description && { description: data.description }),
        link: data.link,
        item: items,
      },
    },
  };

  return stringify(rss);
}

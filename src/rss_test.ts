import { expect, test } from "bun:test";

import { type RssData, generateRss } from "./rss";

test("generateRss", () => {
  const data: RssData = {
    title: "Example Feed",
    description: "An example RSS feed",
    link: "https://example.com/feed",
    items: [
      {
        title: "Item 1",
        description: "The first item",
        link: "https://example.com/feed/item/1",
        pubDate: new Date("2020-01-01T00:00:00Z"),
      },
      {
        title: "Item 2",
        link: "https://example.com/feed/item/2",
        pubDate: new Date("2020-01-02T00:00:00Z"),
      },
    ],
  };

  const actual = generateRss(data);

  expect(actual).toBe(
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" encoding="UTF-8">
  <channel>
    <title>Example Feed</title>
    <description>An example RSS feed</description>
    <link>https://example.com/feed</link>
    <item>
      <title>Item 1</title>
      <description>The first item</description>
      <link>https://example.com/feed/item/1</link>
      <pubDate>Wed, 01 Jan 2020 00:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Item 2</title>
      <link>https://example.com/feed/item/2</link>
      <pubDate>Thu, 02 Jan 2020 00:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`
  );
});

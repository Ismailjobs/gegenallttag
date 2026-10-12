import { prisma } from "./prisma";
import { resolveCover } from "./cover";
import { PUBLISHER, SITE } from "./site";

export const FEED_PATH = "/feed.xml";

function origin() {
  return SITE.url.replace(/\/$/, "");
}

export function feedUrl() {
  return `${origin()}${FEED_PATH}`;
}

function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cdata(value: string) {
  return `<![CDATA[${value.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

function rfc822(value?: Date | string | null) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toUTCString();
  return date.toUTCString();
}

function absoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${origin()}${path.startsWith("/") ? path : `/${path}`}`;
}

function absolutizeHtml(html: string) {
  return html
    .replace(/href="\/(?!\/)/g, `href="${origin()}/`)
    .replace(/src="\/(?!\/)/g, `src="${origin()}/`);
}

function mimeFromPath(path: string) {
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  if (path.endsWith(".avif")) return "image/avif";
  return "image/webp";
}

export async function buildRssXml() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    include: { category: true },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    take: 200,
  });

  const latest = posts[0]?.publishedAt || posts[0]?.updatedAt || new Date();
  const self = feedUrl();

  const items = posts
    .map((post) => {
      const link = `${origin()}/${post.category.slug}/${post.slug}`;
      const cover = absoluteUrl(resolveCover(post.coverImage, post.category.slug));
      const published = post.publishedAt || post.createdAt;
      const body = absolutizeHtml(post.content || "");
      const summary = post.metaDesc || post.subtitle || post.title;

      return `    <item>
      <title>${xmlEscape(post.title)}</title>
      <link>${xmlEscape(link)}</link>
      <guid isPermaLink="true">${xmlEscape(link)}</guid>
      <pubDate>${rfc822(published)}</pubDate>
      <category>${xmlEscape(post.category.name)}</category>
      <dc:creator>${xmlEscape(SITE.name)}</dc:creator>
      <description>${cdata(summary)}</description>
      <content:encoded>${cdata(body)}</content:encoded>
      <enclosure url="${xmlEscape(cover)}" type="${mimeFromPath(cover)}" />
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${xmlEscape(`${SITE.name} – ${SITE.claim}`)}</title>
    <link>${xmlEscape(origin())}</link>
    <description>${xmlEscape(
      "Unabhängiger Ratgeber für Entrümpelung, Räumung und Umzug in ganz Österreich.",
    )}</description>
    <language>de-at</language>
    <copyright>${xmlEscape(`${new Date().getFullYear()} ${SITE.name}`)}</copyright>
    <managingEditor>${xmlEscape(`${PUBLISHER.email} (${PUBLISHER.name})`)}</managingEditor>
    <webMaster>${xmlEscape(`${PUBLISHER.email} (${PUBLISHER.name})`)}</webMaster>
    <lastBuildDate>${rfc822(latest)}</lastBuildDate>
    <ttl>60</ttl>
    <atom:link href="${xmlEscape(self)}" rel="self" type="application/rss+xml" />
    <image>
      <url>${xmlEscape(`${origin()}/images/logo.png`)}</url>
      <title>${xmlEscape(SITE.name)}</title>
      <link>${xmlEscape(origin())}</link>
    </image>
${items}
  </channel>
</rss>
`;
}

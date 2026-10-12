import { buildRssXml } from "@/lib/rss";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const xml = await buildRssXml();
  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex, follow",
    },
  });
}

import { prisma } from "@/lib/prisma";
import { SITE } from "@/lib/site";
import { bootstrapDatabase } from "@/lib/bootstrap";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  await bootstrapDatabase();
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    include: { category: true },
  });

  const statics = [
    "",
    "/entruempelung",
    "/raeumung",
    "/umzug",
    "/ratgeber",
    "/ueber-uns",
    "/kontakt",
    "/impressum",
    "/datenschutz",
  ].map((path) => ({
    url: `${SITE.url}${path || "/"}`,
    lastModified: new Date(),
  }));

  const articles = posts.map((post) => ({
    url: `${SITE.url}/${post.category.slug}/${post.slug}`,
    lastModified: post.updatedAt,
  }));

  return [...statics, ...articles];
}

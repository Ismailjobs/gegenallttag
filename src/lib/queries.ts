import { prisma } from "./prisma";

export async function getPublishedPosts(limit = 12, categorySlug?: string) {
  return prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getPostBySlug(slug: string, categorySlug?: string) {
  return prisma.post.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    include: { category: true },
  });
}

export async function getRelatedPosts(
  categoryId: string,
  excludeId: string,
  limit = 3,
) {
  return prisma.post.findMany({
    where: {
      categoryId,
      status: "PUBLISHED",
      NOT: { id: excludeId },
    },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function searchPosts(query: string) {
  const q = query.trim();
  if (!q) return [];
  return prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { title: { contains: q } },
        { subtitle: { contains: q } },
        { metaDesc: { contains: q } },
        { content: { contains: q } },
      ],
    },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
    take: 20,
  });
}

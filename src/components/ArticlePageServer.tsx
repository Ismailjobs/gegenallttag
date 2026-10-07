import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleView from "@/components/ArticleView";
import { getPostBySlug, getRelatedPosts } from "@/lib/queries";
import { getCategory, SITE, type CategorySlug } from "@/lib/site";
import { bootstrapDatabase } from "@/lib/bootstrap";

export const dynamic = "force-dynamic";

export async function articleMetadata(
  categorySlug: CategorySlug,
  slug: string,
): Promise<Metadata> {
  const post = await getPostBySlug(slug, categorySlug);
  if (!post) return { title: "Beitrag nicht gefunden" };
  return {
    title: { absolute: post.metaTitle },
    description: post.metaDesc,
    alternates: { canonical: `${SITE.url}/${categorySlug}/${post.slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDesc,
      type: "article",
    },
  };
}

export default async function ArticlePageServer({
  categorySlug,
  slug,
}: {
  categorySlug: CategorySlug;
  slug: string;
}) {
  await bootstrapDatabase();
  if (!getCategory(categorySlug)) notFound();
  const post = await getPostBySlug(slug, categorySlug);
  if (!post) notFound();
  const related = await getRelatedPosts(post.categoryId, post.id, 3);
  return <ArticleView post={post} related={related} />;
}

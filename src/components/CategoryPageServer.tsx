import CategoryView from "@/components/CategoryView";
import { getPublishedPosts } from "@/lib/queries";
import { bootstrapDatabase } from "@/lib/bootstrap";
import type { CategorySlug } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ slug }: { slug: CategorySlug }) {
  await bootstrapDatabase();
  const posts = await getPublishedPosts(24, slug);
  return <CategoryView slug={slug} posts={posts} />;
}

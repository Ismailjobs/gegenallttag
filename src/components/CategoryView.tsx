import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ArticleCard, { type ArticleCardPost } from "./ArticleCard";
import JsonLd from "./JsonLd";
import { collectionPageSchema } from "@/lib/jsonld";
import { getCategory, SITE, type CategorySlug } from "@/lib/site";

export default function CategoryView({
  slug,
  posts,
}: {
  slug: CategorySlug;
  posts: ArticleCardPost[];
}) {
  const category = getCategory(slug);
  if (!category) return null;

  return (
    <div>
      <JsonLd
        data={collectionPageSchema({
          name: category.name,
          description: category.description,
          url: `${SITE.url.replace(/\/$/, "")}/${category.slug}`,
        })}
      />
      <section className="bg-navy-50/70 border-b border-navy-100">
        <div className="mx-auto max-w-site px-4 sm:px-6 py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Ratgeber
          </p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl text-ink">{category.name}</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">{category.description}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {category.subtopics.map((topic) => (
              <span
                key={topic.slug}
                className="rounded-full border border-navy-200 bg-white px-4 py-2 text-sm text-navy-800"
              >
                {topic.name}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-site px-4 sm:px-6 py-14">
        <div className="flex items-end justify-between gap-4 mb-8">
          <h2 className="font-serif text-3xl text-ink">Beiträge aus der Praxis</h2>
          <Link href="/ratgeber" className="text-sm text-accent inline-flex items-center gap-1">
            Alle Artikel ansehen <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {posts.length === 0 ? (
          <p className="text-slate-600">Noch keine veröffentlichten Beiträge in dieser Kategorie.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

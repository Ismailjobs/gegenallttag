import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import ArticleCard from "@/components/ArticleCard";
import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/queries";
import { bootstrapDatabase } from "@/lib/bootstrap";
import { canonicalPath } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: canonicalPath("/") },
};

export default async function HomePage() {
  await bootstrapDatabase();
  const posts = await getPublishedPosts(8);

  return (
    <>
      <Hero />
      <section className="bg-white pt-8 pb-16">
        <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy-400">
                Beliebte Ratgeber
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-ink">
                Wissenswertes aus der Praxis
              </h2>
            </div>
            <Link
              href="/ratgeber"
              className="hidden sm:inline-flex items-center gap-1 text-sm text-accent hover:text-navy-800"
            >
              Alle Artikel ansehen <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {posts.slice(0, 4).map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Link
              href="/ratgeber"
              className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-7 py-3.5 text-sm font-semibold text-white hover:bg-ink"
            >
              Alle Ratgeber ansehen <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

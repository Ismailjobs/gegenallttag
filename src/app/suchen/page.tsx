import type { Metadata } from "next";
import ArticleCard from "@/components/ArticleCard";
import { searchPosts } from "@/lib/queries";
import { bootstrapDatabase } from "@/lib/bootstrap";
import { canonicalPath } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Suche",
  robots: { index: false, follow: true },
  alternates: { canonical: canonicalPath("/suchen") },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  await bootstrapDatabase();
  const q = searchParams.q || "";
  const posts = q ? await searchPosts(q) : [];

  return (
    <section className="mx-auto max-w-site px-4 sm:px-6 lg:px-8 xl:px-10 py-14">
      <h1 className="font-serif text-4xl text-ink">Suche</h1>
      <form className="mt-6 flex gap-3" action="/suchen">
        <input
          name="q"
          defaultValue={q}
          placeholder="Begriff, Bezirk, Behörde …"
          className="flex-1 rounded-full border border-navy-100 px-5 py-3"
        />
        <button className="rounded-full bg-navy-900 px-6 text-white font-semibold">
          Suchen
        </button>
      </form>
      {q && (
        <p className="mt-6 text-slate-600">
          {posts.length} Treffer für „{q}“.
        </p>
      )}
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

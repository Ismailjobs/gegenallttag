import type { Metadata } from "next";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import JsonLd from "@/components/JsonLd";
import { collectionPageSchema } from "@/lib/jsonld";
import { getPublishedPosts } from "@/lib/queries";
import { bootstrapDatabase } from "@/lib/bootstrap";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Alle Ratgeber",
  description: "Alle Beiträge zu Entrümpelung, Räumung und Umzug in ganz Österreich.",
};

export default async function RatgeberPage() {
  await bootstrapDatabase();
  const posts = await getPublishedPosts(60);
  return (
    <section className="mx-auto max-w-site px-4 sm:px-6 lg:px-8 xl:px-10 py-14">
      <JsonLd
        data={collectionPageSchema({
          name: "Alle Ratgeber",
          description: metadata.description || "",
          url: `${SITE.url.replace(/\/$/, "")}/ratgeber`,
        })}
      />
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy-400">
        Archiv
      </p>
      <h1 className="mt-2 font-serif text-4xl sm:text-5xl text-ink">Alle Ratgeber</h1>
      <p className="mt-4 max-w-2xl text-slate-600">
        Operative Texte zu Raum, Ordnung und Neuanfang – siloartig nach Entrümpelung, Räumung und Umzug.
      </p>
      <div className="mt-6 flex gap-3 text-sm">
        <Link href="/entruempelung" className="text-accent hover:underline">
          Entrümpelung
        </Link>
        <Link href="/raeumung" className="text-accent hover:underline">
          Räumung
        </Link>
        <Link href="/umzug" className="text-accent hover:underline">
          Umzug
        </Link>
      </div>
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

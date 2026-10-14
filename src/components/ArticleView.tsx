import { CalendarDays, Clock } from "lucide-react";
import Link from "next/link";
import { formatDate, parseJson, readingLabel, stripHtml, type ChecklistItem, type CostRow, type FaqItem } from "@/lib/utils";
import { CostTable, Checklist, FaqAccordion } from "./ArticleExtras";
import ArticleCard from "./ArticleCard";
import JsonLd from "./JsonLd";
import { blogPostingSchema, faqPageSchema } from "@/lib/jsonld";
import { SITE } from "@/lib/site";
import { coverAltFor, resolveCover } from "@/lib/cover";
import CoverImage from "./CoverImage";
import type { Post, Category } from "@prisma/client";

type PostWithCategory = Post & { category: Category };

export default function ArticleView({
  post,
  related,
}: {
  post: PostWithCategory;
  related: PostWithCategory[];
}) {
  const faqs = normalizeFaqs(parseJson<FaqItem[]>(post.faqJson, []));
  const table = normalizeTable(parseJson<CostRow[]>(post.tableJson, []));
  const checklist = normalizeChecklist(parseJson<ChecklistItem[]>(post.checklistJson, []));
  const extras = parseJson<{
    keywords?: string[];
    about?: string;
    articleSection?: string;
  }>(post.schemaJson, {});
  const url = `${SITE.url.replace(/\/$/, "")}/${post.category.slug}/${post.slug}`;

  return (
    <article className="bg-white">
      <JsonLd
        data={blogPostingSchema({
          title: post.title,
          description: post.metaDesc,
          url,
          image: post.coverImage,
          datePublished: post.publishedAt || post.createdAt,
          dateModified: post.updatedAt,
          articleSection: extras.articleSection || post.category.name,
          keywords: extras.keywords?.length ? extras.keywords : [post.category.name, post.title],
          about: extras.about || post.subtitle || post.title,
          wordCount: stripHtml(post.content).split(/\s+/).filter(Boolean).length,
        })}
      />
      {faqs.length > 0 ? <JsonLd data={faqPageSchema(faqs)} /> : null}
      <header className="border-b border-navy-100 bg-navy-50/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <nav className="text-sm text-slate-500">
            <Link href="/" className="hover:text-ink">
              Startseite
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/${post.category.slug}`} className="hover:text-ink">
              {post.category.name}
            </Link>
          </nav>
          <p className="mt-5 inline-block rounded-md bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-navy-700">
            {post.category.name}
          </p>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl leading-tight text-ink">
            {post.title}
          </h1>
          {post.subtitle && (
            <p className="mt-4 text-lg text-slate-600 leading-8">{post.subtitle}</p>
          )}
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {readingLabel(post.readingTime)}
            </span>
          </div>
        </div>
      </header>
      {post.coverImage && (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 mt-8">
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-navy-50 shadow-lg shadow-navy-900/10">
            <CoverImage
              src={resolveCover(post.coverImage, post.category.slug)}
              alt={coverAltFor({
                coverAlt: post.coverAlt,
                title: post.title,
                categorySlug: post.category.slug,
              })}
              priority
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        </div>
      )}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <div
          className="prose-article"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <CostTable rows={table} />
        <Checklist items={checklist} />
        <FaqAccordion items={faqs} />
      </div>
      {related.length > 0 && (
        <section className="border-t border-navy-100 bg-navy-50/40">
          <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8 xl:px-10 py-14">
            <h2 className="font-serif text-3xl text-ink mb-8">Weiterlesen in {post.category.name}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((item) => (
                <ArticleCard key={item.id} post={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

function normalizeFaqs(items: FaqItem[]) {
  return items.map((item) => ({
    question: item.question || (item as { q?: string }).q || "",
    answer: item.answer || (item as { a?: string }).a || "",
  })).filter((i) => i.question);
}

function normalizeTable(rows: CostRow[]) {
  return rows.map((row) => ({
    item: row.item || (row as { leistung?: string }).leistung || "",
    range: row.range || (row as { spanne?: string }).spanne || "",
    note: row.note || (row as { hinweis?: string }).hinweis || "",
  }));
}

function normalizeChecklist(items: ChecklistItem[]) {
  return items.map((item) => ({
    title: item.title || (item as { punkt?: string }).punkt || "",
    detail: item.detail || "",
  }));
}

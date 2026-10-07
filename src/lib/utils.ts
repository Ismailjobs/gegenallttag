export type FaqItem = { question: string; answer: string };
export type CostRow = { item: string; range: string; note?: string };
export type ChecklistItem = { title: string; detail: string };

export type GeneratedArticle = {
  title: string;
  subtitle: string;
  meta_desc: string;
  reading_time: number;
  intro: string;
  sections: { heading: string; body: string }[];
  cost_table: { leistung: string; spanne: string; hinweis: string }[];
  checklist: { punkt: string; detail: string }[];
  faqs: { q: string; a: string }[];
  cover_prompt?: string;
  cluster_keyword?: string;
  schema?: {
    keywords?: string[];
    about?: string;
    articleSection?: string;
  };
};

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatDate(date: Date | string | null | undefined, locale = "de-AT") {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function readingLabel(minutes: number) {
  return `${minutes} Min. Lesezeit`;
}

export function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function uniqueSlug(base: string, existing: Set<string>) {
  let slug = slugify(base);
  let i = 2;
  while (existing.has(slug)) {
    slug = `${slugify(base)}-${i}`;
    i += 1;
  }
  return slug;
}

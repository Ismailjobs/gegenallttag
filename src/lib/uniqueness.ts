import { prisma } from "./prisma";
import type { FaqItem } from "./utils";
import { parseJson, stripHtml } from "./utils";

export async function uniquenessHints(categorySlug: string) {
  const [sameCat, recent] = await Promise.all([
    prisma.post.findMany({
      where: {
        status: { in: ["PUBLISHED", "SCHEDULED"] },
        category: { slug: categorySlug },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        title: true,
        content: true,
        faqJson: true,
        schemaJson: true,
        metaDesc: true,
      },
    }),
    prisma.post.findMany({
      where: { status: { in: ["PUBLISHED", "SCHEDULED"] } },
      orderBy: { createdAt: "desc" },
      take: 18,
      select: { title: true, schemaJson: true },
    }),
  ]);

  if (!sameCat.length) {
    return "Noch keine Vergleichstexte in dieser Kategorie.";
  }

  const titles = sameCat.map((p) => `- ${p.title}`);
  const openings = sameCat
    .map((p) => {
      const first = stripHtml(p.content || "").slice(0, 220);
      return first ? `- ${p.title}: „${first}“` : "";
    })
    .filter(Boolean);

  const faqQuestions: string[] = [];
  for (const post of sameCat) {
    const faqs = parseJson<FaqItem[]>(post.faqJson, []);
    for (const faq of faqs.slice(0, 2)) {
      const q = faq.question || (faq as { q?: string }).q;
      if (q) faqQuestions.push(`- ${q}`);
    }
  }

  const keywordCounts = new Map<string, number>();
  for (const post of recent) {
    const extras = parseJson<{ keywords?: string[] }>(post.schemaJson, {});
    const fromTitle = post.title
      .toLowerCase()
      .split(/[^a-zäöüß0-9]+/i)
      .filter((w) => w.length > 4);
    for (const kw of extras.keywords || []) {
      bump(keywordCounts, kw);
    }
    for (const w of fromTitle.slice(0, 6)) bump(keywordCounts, w);
  }

  const occupied = [...keywordCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 16)
    .map(([k, n]) => `- ${k} (${n}×)`)
    .join("\n");

  return `Bestehende Texte – nicht klonen. Wähle eine Nische, die unten NICHT als Titel vorkommt (Bezirk, Objekttyp, Behörde, Randfall). Keine Head-Terms als Titel.
Titel derselben Kategorie:
${titles.join("\n")}

Einstiege:
${openings.join("\n")}

FAQ-Fragen nicht wiederholen:
${faqQuestions.slice(0, 16).join("\n") || "- (keine)"}

Bereits belegte Keywords (nicht als Hauptcluster, nicht im Titel stapeln):
${occupied || "- (keine)"}`;
}

function bump(map: Map<string, number>, raw: string) {
  const key = raw.trim().toLowerCase();
  if (key.length < 4) return;
  map.set(key, (map.get(key) || 0) + 1);
}

export function openingsTooSimilar(introHtml: string, uniquenessBlock: string) {
  const intro = stripHtml(introHtml).slice(0, 180).toLowerCase();
  const quoted = [...uniquenessBlock.matchAll(/„([^“]{40,180})/g)].map((m) =>
    m[1].toLowerCase(),
  );
  return quoted.some((existing) => wordOverlap(intro, existing) > 0.52);
}

function wordOverlap(a: string, b: string) {
  const wordsA = new Set(a.split(/\s+/).filter((w) => w.length > 4));
  const wordsB = new Set(b.split(/\s+/).filter((w) => w.length > 4));
  if (!wordsA.size) return 0;
  let hit = 0;
  for (const word of wordsA) {
    if (wordsB.has(word)) hit += 1;
  }
  return hit / wordsA.size;
}

import { prisma } from "./prisma";
import type { FaqItem } from "./utils";
import { parseJson, stripHtml } from "./utils";

export async function uniquenessHints(categorySlug: string) {
  const posts = await prisma.post.findMany({
    where: {
      status: { in: ["PUBLISHED", "SCHEDULED"] },
      category: { slug: categorySlug },
    },
    orderBy: { createdAt: "desc" },
    take: 14,
    select: { title: true, subtitle: true, content: true, faqJson: true },
  });

  const openings: string[] = [];
  const faqQuestions: string[] = [];
  const titles: string[] = [];

  for (const post of posts) {
    titles.push(`- ${post.title}`);
    const text = stripHtml(post.content || "");
    const first = text.slice(0, 420);
    if (first) openings.push(`- ${post.title}: „${first}“`);
    const faqs = parseJson<FaqItem[]>(post.faqJson, []);
    for (const faq of faqs.slice(0, 4)) {
      const q = faq.question || (faq as { q?: string }).q;
      if (q) faqQuestions.push(`- ${q}`);
    }
  }

  if (!openings.length) {
    return "Noch keine Vergleichstexte in dieser Kategorie.";
  }

  return `Bestehende Texte derselben Kategorie – Formulierungen, Satzbau, Einstiege und FAQ-Fragen nicht nachahmen. Keine Satzschablonen, keine umgestellten Klone.
Titel:
${titles.join("\n")}

Einstiege:
${openings.join("\n")}

Bereits verwendete FAQ-Fragen:
${faqQuestions.slice(0, 24).join("\n") || "- (keine)"}`;
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

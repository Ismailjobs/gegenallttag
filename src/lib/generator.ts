import OpenAI from "openai";
import { prisma } from "./prisma";
import { buildLinkPlan } from "./linking";
import { getCategory, type CategorySlug } from "./site";
import { slugify, uniqueSlug, type GeneratedArticle } from "./utils";
import { generateCoverWebp } from "./images";
import { coverBriefFromArticle } from "./cover-prompt";
import { researchTopic } from "./research";
import { openingsTooSimilar, uniquenessHints } from "./uniqueness";
import { stripHtml } from "./utils";

const MODEL = "gpt-4o-mini";

function client() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY eksik.");
  return new OpenAI({ apiKey: key });
}

export async function generateArticleFromTopic(topicId: string) {
  const topic = await prisma.targetTopic.findUnique({ where: { id: topicId } });
  if (!topic) throw new Error("Konu bulunamadı.");
  if (topic.status === "PROCESSING") return null;

  const category = getCategory(topic.categorySlug);
  if (!category) throw new Error(`Bilinmeyen kategori: ${topic.categorySlug}`);

  await prisma.targetTopic.update({
    where: { id: topic.id },
    data: { status: "PROCESSING" },
  });

  try {
    const plan = await buildLinkPlan({
      categorySlug: topic.categorySlug as CategorySlug,
      targetLinkUrl: topic.targetLinkUrl,
      targetAnchor: topic.targetAnchor,
    });

    const article = await requestArticle({
      title: topic.title,
      clusterKeyword: topic.clusterKeyword,
      categorySlug: topic.categorySlug as CategorySlug,
      categoryName: category.name,
      editorPrompt: topic.editorPrompt,
      webResearch: topic.webResearch !== false,
      plan,
    });

    const existing = new Set(
      (
        await prisma.post.findMany({
          select: { slug: true },
        })
      ).map((p) => p.slug),
    );
    const slug = uniqueSlug(article.title, existing);
    const html = renderArticleHtml(article, plan);
    const cat = await prisma.category.findUnique({
      where: { slug: topic.categorySlug },
    });
    if (!cat) throw new Error("Kategori veritabanında yok.");

    const scheduledFor = nextSlot();
    let coverImage = coverFor(topic.categorySlug as CategorySlug);
    let coverAlt = "";
    try {
      const brief = await coverBriefFromArticle({
        title: article.title,
        subtitle: article.subtitle,
        html,
        headings: article.sections.map((s) => s.heading),
        categorySlug: topic.categorySlug as CategorySlug,
      });
      coverAlt = brief.alt;
      const generatedCover = await generateCoverWebp({
        title: article.title,
        subtitle: article.subtitle,
        categorySlug: topic.categorySlug as CategorySlug,
        slug,
        coverPrompt: brief.prompt,
      });
      if (generatedCover) coverImage = generatedCover;
    } catch (error) {
      console.error("[cover] Fallback-Bild, Generierung fehlgeschlagen:", error);
    }

    const faqs = (article.faqs || []).map((f) => ({
      question: f.q,
      answer: f.a,
    }));
    const cluster = article.cluster_keyword || topic.clusterKeyword || category.name;

    const post = await prisma.post.create({
      data: {
        slug,
        title: article.title,
        subtitle: article.subtitle,
        metaTitle: `${article.title} | Gegen Alltag`,
        metaDesc: article.meta_desc.slice(0, 160),
        readingTime: readingMinutes(html),
        categoryId: cat.id,
        content: html,
        tableJson: JSON.stringify(article.cost_table || []),
        checklistJson: JSON.stringify(article.checklist || []),
        faqJson: JSON.stringify(faqs),
        schemaJson: JSON.stringify({
          keywords: article.schema?.keywords || [cluster, category.name],
          about: article.schema?.about || article.subtitle || article.title,
          articleSection: article.schema?.articleSection || category.name,
        }),
        coverImage,
        coverAlt,
        status: "SCHEDULED",
        scheduledFor,
      },
    });

    await prisma.targetTopic.update({
      where: { id: topic.id },
      data: {
        status: "PUBLISHED",
        title: article.title,
        clusterKeyword: cluster,
      },
    });

    return post;
  } catch (error) {
    await prisma.targetTopic.update({
      where: { id: topic.id },
      data: { status: "PENDING" },
    });
    throw error;
  }
}

async function requestArticle(params: {
  title: string;
  clusterKeyword: string;
  categorySlug: CategorySlug;
  categoryName: string;
  editorPrompt?: string | null;
  webResearch: boolean;
  plan: Awaited<ReturnType<typeof buildLinkPlan>>;
}): Promise<GeneratedArticle> {
  const uniqueness = await uniquenessHints(params.categorySlug);
  const research = params.webResearch
    ? await researchTopic({
        title: params.title,
        clusterKeyword: params.clusterKeyword,
        categorySlug: params.categorySlug,
        editorPrompt: params.editorPrompt,
      })
    : "Keine Webrecherche für dieses Thema angefordert.";

  let article = await callModel({ ...params, uniqueness, research, rewrite: false });
  if (openingsTooSimilar(article.intro, uniqueness)) {
    article = await callModel({ ...params, uniqueness, research, rewrite: true });
  }
  return article;
}

async function callModel(params: {
  title: string;
  clusterKeyword: string;
  categorySlug: CategorySlug;
  categoryName: string;
  editorPrompt?: string | null;
  plan: Awaited<ReturnType<typeof buildLinkPlan>>;
  uniqueness: string;
  research: string;
  rewrite: boolean;
}): Promise<GeneratedArticle> {
  const relatedBlock =
    params.plan.related.length > 0
      ? params.plan.related
          .map((r) => `- Anker „${r.anchor}“ → ${r.href} (${r.title})`)
          .join("\n")
      : "- Keine bestehenden Texte; interne Links weglassen.";

  const serviceBlock = params.plan.includeServiceLink
    ? `Füge in EINEM Abschnitt genau einen dofollow-Link ein: <a href="${params.plan.serviceUrl}">${params.plan.serviceAnchor}</a>. Kein zweiter Dienstleister-Link.`
    : `Keine Links zu privaten Dienstleistern. ${params.plan.officialHint}`;

  const briefing = params.editorPrompt?.trim();
  const rawTitle = params.title?.trim();
  const titleHint =
    rawTitle && briefing && (rawTitle === briefing || briefing.startsWith(rawTitle))
      ? ""
      : rawTitle;
  const keywordHint = params.clusterKeyword?.trim();

  const extra = briefing
    ? `\nRedaktionsbriefing (kann Türkisch, Englisch oder Deutsch sein – verbindlich, soweit Recht und Quellenregeln nicht gebrochen werden):\n${briefing}\n`
    : "";

  const rewriteBlock = params.rewrite
    ? `\nDer erste Entwurf ähnelte bestehenden Texten zu stark. Schreibe Titel, Einstieg, H2-Reihenfolge, Beispiele und FAQ komplett neu. Andere Satzlängen, anderer Einstieg (Szene, Behörde, Fehler, Frist) – keine Umstellung vorhandener Sätze.\n`
    : "";

  const prompt = `Du schreibst für Gegen Alltag (GegenAlltag.at), einen unabhängigen Ratgeber für ganz Österreich.

Kategorie: ${params.categoryName} (/${params.categorySlug}/)
${titleHint ? `Titel-Hinweis (nur Idee, du darfst und sollst einen besseren österreichischen Titel erfinden): ${titleHint}` : "Kein Titel vorgegeben – du erfindest Titel und Untertitel."}
${keywordHint ? `Keyword-Hinweis: ${keywordHint}` : "Kein Keyword vorgegeben – du wählst ein natürliches Cluster-Keyword auf Deutsch."}
${extra}${rewriteBlock}

Sprache: amtliches österreichisches Deutsch (de-AT), Sie-Form. Kein Binnendeutsch, kein Dialekt-Kauderwelsch, aber durchgehend österreichische Lexik, wo sie sachlich passt: Jänner (nicht Januar), Stiege/Stiegenhaus (nicht Treppe als Default), Parkpickerl, Mistplatz, Altsperrgut, Sperrmüll, Übersiedlung, Sackerl, heuer, Bezirksvorstehung, Magistrat, Wiener Wohnen, MA 46, MA 48, Verlassenschaft, Ordination, Trafik, Semmel. Kein „Brötchen“, kein „Januar“, kein norddeutscher Behördenton. Kein bayerisches „I hob“, kein „Servas“ im Fließtext.
Das Briefing darf auf Türkisch sein. Der fertige Text, Titel, FAQ und Schema sind ausschließlich österreichisches Deutsch – nichts Türkisches im veröffentlichten Artikel.

Reichweite: Allgemeine Sätze gelten für ganz Österreich – Bund, alle Bundesländer, Städte, Marktgemeinden und Dörfer. Nicht auf Großstädte verengen. Lokale Namen dort, wo sie den Ablauf wirklich ändern: Wien und Bezirke (z. B. 3. Bezirk/Landstraße), Graz, Linz, Salzburg, Innsbruck, Klagenfurt, St. Pölten, Wiener Neustadt, Steyr, Villach, Wels, Leoben, Amstetten sowie Bezirke und Gemeinden (Hartberg, Lienz, Zell am See, Gmunden, Deutschlandsberg). Beispiele: „In Wien ist Folgendes zu beachten“, „im 3. Wiener Gemeindebezirk“, „in der Steiermark“, „in einer Marktgemeinde in Oberösterreich“. Wien, MA 46/48, Parkpickerl, Wiener Wohnen nur wenn der Beitrag wirklich Wien betrifft – kein Keyword-Stuffing, kein Wien-Zwang.

Verboten: Floskeln wie „Beim Thema X geht es darum…“, „In der heutigen Zeit…“, „Immer mehr Menschen…“, „Weiterführend lohnt der Blick…“, SEO-Spam, Du-Anrede im Marketington. Neutral, konkret, praxisnah.
Jeder Text braucht einen eigenen Einstieg, eigene Beispiele, eigene FAQ-Fragen. Keine Satzklone.

Einzigartigkeit (nicht nachahmen):
${params.uniqueness}

Webrecherche / Wettbewerb (Fakten nutzen, keine Werbesätze abschreiben):
${params.research}

Pflicht:
- Mindestens zwei natürliche interne Links im Fließtext (nicht als Liste):
${relatedBlock}
- Quellen: ${serviceBlock}
- Offizielle Links: oesterreich.gv.at und das zuständige Landes- oder Gemeindeportal. Wien.gv.at, MA 48 oder MA 46 nur bei Wien-Themen.
- Keine erfundenen Preise als Garantie; Spannen als Orientierung für Österreich, regional abweichend.
- FAQ ist Pflicht: genau 5 oder 6 Fragen, jeweils eine vollständige Frage und eine belastbare Antwort. Keine Wiederholung der H2-Überschriften.
- Titel selbst formulieren: präzise, ohne Clickbait, österreichisch, Keyword natürlich eingebettet.
- Fließtext (intro + sections, ohne Tabelle/Checkliste/FAQ) circa 1000 Wörter (950–1100). Kein Fülltext: konkrete Abläufe, Zahlen als Spanne, Behörden.
- cluster_keyword und Titel-Keywords dürfen nicht die belegten Keywords als Hauptsignal wiederholen; verwandtes Silo-Thema, anderer Winkel.
- Nische ist Pflicht. Kein generischer Titel wie „Entrümpelung Wien“ oder „Umzug Tipps“. Ein enger Long-Tail: Ort (Wien-Favoriten, Graz-Lend, 3. Bezirk, Steyr, Lienz, Marktgemeinde in der Steiermark), Objekt (Kellerabteil, Dachboden, Gemeindebau ohne Lift, Reihenhaus, Bauernhof), Behörde (Mistplatz, Gemeindeamt, Bezirkshauptmannschaft, MA-46-Frist in Wien), Rechtslage (Verlassenschaft vor dem ersten Karton) oder Randfall (enge Hofeinfahrt, Altsperrgut). H2 beantworten echte Suchfragen, nicht Synonyme desselben Keywords. Suchintention informational.

Antworte ausschließlich als JSON-Objekt mit exakt diesen Schlüsseln:
{
  "title": "österreichischer Titel, von dir erfunden",
  "subtitle": "eine operative Zeile auf Deutsch",
  "cluster_keyword": "1–3 Wörter, de-AT",
  "meta_desc": "max. 155 Zeichen, Nutzen + Region, Deutsch",
  "reading_time": 6,
  "intro": "2–3 Sätze HTML <p>, ohne H1, anderer Einstieg als bestehende Texte",
  "sections": [
    { "heading": "H2 ohne Nummerierung", "body": "HTML mit <p>, <ul><li>, ggf. <a>" }
  ],
  "cost_table": [
    { "leistung": "", "spanne": "", "hinweis": "" }
  ],
  "checklist": [
    { "punkt": "", "detail": "" }
  ],
  "faqs": [
    { "q": "Frage als ganze Frage", "a": "kurze, belastbare Antwort" }
  ],
  "schema": {
    "keywords": ["3–8 deutschsprachige Keywords"],
    "about": "kurzer Gegenstand des Beitrags",
    "articleSection": "${params.categoryName}"
  }
}

4–6 sections, 3–5 cost_table Zeilen, 5–7 checklist Punkte, 5–6 FAQs. Circa 1000 Wörter Fließtext. schema.keywords und schema.about sind Pflicht.`;

  const openai = client();
  const completion = await openai.chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    temperature: params.rewrite ? 0.92 : 0.84,
    messages: [
      {
        role: "system",
        content:
          "Du bist Redakteurin in Österreich. Amtliches österreichisches Deutsch. Allgemeine Texte für ganz Österreich, lokale Details nur wo sie stimmen. Briefings auf Türkisch übersetzt du still. JSON mit Titel, ~1000 Wörtern Fließtext, Pflicht-FAQ und schema. Kein Bildprompt.",
      },
      { role: "user", content: prompt },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("Model boş yanıt verdi.");
  const parsed = JSON.parse(raw) as GeneratedArticle;
  return validateArticle(parsed);
}

function validateArticle(parsed: GeneratedArticle): GeneratedArticle {
  if (!parsed.title || !parsed.intro || !Array.isArray(parsed.sections)) {
    throw new Error("JSON şeması eksik.");
  }
  const faqs = (parsed.faqs || []).filter((f) => f?.q?.trim() && f?.a?.trim());
  if (faqs.length < 5) {
    throw new Error("FAQ zorunlu: her yazıda en az 5 soru-cevap olmalı.");
  }
  parsed.faqs = faqs.slice(0, 6);
  parsed.cluster_keyword =
    parsed.cluster_keyword?.trim() || parsed.schema?.keywords?.[0] || parsed.title;
  parsed.schema = {
    keywords: (parsed.schema?.keywords || [])
      .map((k) => String(k).trim())
      .filter(Boolean)
      .slice(0, 8),
    about: parsed.schema?.about?.trim() || parsed.subtitle || parsed.title,
    articleSection: parsed.schema?.articleSection?.trim() || undefined,
  };
  if (!parsed.schema.keywords?.length) {
    parsed.schema.keywords = [parsed.title];
  }
  return parsed;
}

export function renderArticleHtml(
  article: GeneratedArticle,
  plan?: Awaited<ReturnType<typeof buildLinkPlan>>,
) {
  const sections = article.sections
    .map((section) => {
      return `<h2>${escape(section.heading)}</h2>\n${section.body}`;
    })
    .join("\n");

  let html = `${article.intro}\n${sections}`;
  if (plan?.related.length) {
    const missing = plan.related.filter((r) => !html.includes(r.href));
    if (missing.length) {
      const extra = missing
        .slice(0, 2)
        .map((r) => `<a href="${r.href}">${escape(r.anchor)}</a>`)
        .join(" sowie ");
      html += `<p>Passend dazu: ${extra}.</p>`;
    }
  }
  return html;
}

function readingMinutes(html: string) {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(6, Math.min(12, Math.round(words / 140)));
}

function nextSlot() {
  const now = new Date();
  const slot = new Date(now);
  slot.setHours(7, 0, 0, 0);
  if (slot <= now) slot.setDate(slot.getDate() + 1);
  return slot;
}

function coverFor(slug: CategorySlug) {
  const map: Record<CategorySlug, string> = {
    entruempelung: "/images/boxes.webp",
    raeumung: "/images/house.webp",
    umzug: "/images/checklist.webp",
  };
  return map[slug];
}

function escape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export { slugify };

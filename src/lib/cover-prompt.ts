import OpenAI from "openai";
import type { CategorySlug } from "./site";
import { stripHtml } from "./utils";

export type CoverBrief = {
  prompt: string;
  alt: string;
};

/** Ein kurzer Call: englischer Bildprompt + natürlicher de-AT-Alttext. */
export async function coverBriefFromArticle(params: {
  title: string;
  subtitle?: string | null;
  html: string;
  headings?: string[];
  categorySlug: CategorySlug;
}): Promise<CoverBrief> {
  const fallback = {
    prompt: fallbackPrompt(params),
    alt: fallbackAlt(params),
  };
  const key = process.env.OPENAI_API_KEY;
  if (!key) return fallback;

  const excerpt = stripHtml(params.html).slice(0, 380);
  const heads = (params.headings || []).slice(0, 4).join(" · ");

  try {
    const openai = new OpenAI({ apiKey: key });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 140,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            'JSON only: {"prompt":"...","alt":"..."}. prompt: one English photographic line, max 55 words, editorial Austrian, photorealistic, no text/logos/faces. alt: österreichisches Deutsch, 6–12 Wörter, was auf dem Foto zu sehen ist, ruhig und konkret. Kein „Bild von“, kein „Foto zeigt“, kein Keyword-Stuffing, kein kompletter Artikeltitel.',
        },
        {
          role: "user",
          content: `Title: ${params.title}\n${params.subtitle || ""}\nHeadings: ${heads}\nExcerpt: ${excerpt}`,
        },
      ],
    });
    const raw = completion.choices[0]?.message?.content?.trim();
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as { prompt?: string; alt?: string };
    const prompt =
      parsed.prompt && parsed.prompt.length > 40 ? parsed.prompt.trim() : fallback.prompt;
    const alt = sanitizeAlt(parsed.alt) || fallback.alt;
    return { prompt, alt };
  } catch (error) {
    console.error("[cover-brief]", error);
    return fallback;
  }
}

export function sanitizeAlt(value?: string | null) {
  if (!value) return "";
  let alt = value.replace(/\s+/g, " ").trim();
  alt = alt.replace(/^["„“']+|["„“']+$/g, "");
  alt = alt.replace(/^(bild von|foto (von|zeigt)|abbildung:?)\s+/i, "");
  if (alt.length < 8 || alt.length > 110) return "";
  return alt;
}

function fallbackPrompt(params: { title: string; categorySlug: CategorySlug }) {
  const scene =
    params.categorySlug === "umzug"
      ? "Editorial photo: Gründerzeit street in Wien, clean van, linen-wrapped furniture, golden hour, cobblestones."
      : params.categorySlug === "raeumung"
        ? "Editorial photo: emptied Altbau room, tall windows, parquet, late sun, one carton stack, quiet."
        : "Editorial photo: Viennese Hofeinfahrt, stacked cartons, brick, Stiegenhaus glimpse, documentary light.";
  return `${scene} Mood for: ${params.title}. Photorealistic, no text, no logos, no faces.`;
}

function fallbackAlt(params: { title: string; categorySlug: CategorySlug }) {
  if (params.categorySlug === "umzug") {
    return "Umzugswagen vor einem Haus in Österreich";
  }
  if (params.categorySlug === "raeumung") {
    return "Leerer Altbauraum mit Kartons am Fenster";
  }
  return "Kartons in einem Hofeingang, bereit zur Entrümpelung";
}

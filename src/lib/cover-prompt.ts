import OpenAI from "openai";
import type { CategorySlug } from "./site";
import { stripHtml } from "./utils";

/** Kurzer Zweitcall: Artikel lesen, ein Bildprompt – wenige Tokens. */
export async function coverPromptFromArticle(params: {
  title: string;
  subtitle?: string | null;
  html: string;
  headings?: string[];
  categorySlug: CategorySlug;
}): Promise<string> {
  const fallback = fallbackPrompt(params);
  const key = process.env.OPENAI_API_KEY;
  if (!key) return fallback;

  const excerpt = stripHtml(params.html).slice(0, 380);
  const heads = (params.headings || []).slice(0, 4).join(" · ");

  try {
    const openai = new OpenAI({ apiKey: key });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.45,
      max_tokens: 90,
      messages: [
        {
          role: "system",
          content:
            "One English photographic prompt, max 55 words. Editorial, Viennese/Austrian, photorealistic. No text, logos, faces, collage.",
        },
        {
          role: "user",
          content: `Title: ${params.title}\n${params.subtitle || ""}\nHeadings: ${heads}\nExcerpt: ${excerpt}`,
        },
      ],
    });
    const text = completion.choices[0]?.message?.content?.trim();
    return text && text.length > 40 ? text : fallback;
  } catch (error) {
    console.error("[cover-prompt]", error);
    return fallback;
  }
}

function fallbackPrompt(params: {
  title: string;
  categorySlug: CategorySlug;
}) {
  const scene =
    params.categorySlug === "umzug"
      ? "Editorial photo: Gründerzeit street in Wien, clean van, linen-wrapped furniture, golden hour, cobblestones."
      : params.categorySlug === "raeumung"
        ? "Editorial photo: emptied Altbau room, tall windows, parquet, late sun, one carton stack, quiet."
        : "Editorial photo: Viennese Hofeinfahrt, stacked cartons, brick, Stiegenhaus glimpse, documentary light.";
  return `${scene} Mood for: ${params.title}. Photorealistic, no text, no logos, no faces.`;
}

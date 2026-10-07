import { getCategory, OFFICIAL_SOURCES, RESEARCH_SOURCES, type CategorySlug } from "./site";

const TIMEOUT_MS = 9000;

export async function researchTopic(params: {
  title: string;
  clusterKeyword: string;
  categorySlug: CategorySlug;
  editorPrompt?: string | null;
}) {
  if (process.env.GENERATE_WEB_RESEARCH === "false") {
    return "Webrecherche deaktiviert.";
  }

  const parts: string[] = [];
  const web = await openaiWebSearch(params).catch((error) => {
    console.error("[research] OpenAI-Suche", error);
    return "";
  });
  if (web) parts.push(`Live-Recherche:\n${web}`);

  const pages = await fetchReferencePages(params.categorySlug).catch(() => "");
  if (pages) parts.push(`Quellenausschnitte:\n${pages}`);

  return parts.join("\n\n").slice(0, 7000) || "Keine Webrecherche verfügbar.";
}

async function openaiWebSearch(params: {
  title: string;
  clusterKeyword: string;
  categorySlug: CategorySlug;
  editorPrompt?: string | null;
}) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return "";

  const extra = params.editorPrompt?.trim()
    ? `Redaktionswunsch: ${params.editorPrompt.trim()}`
    : "Kurz prüfen, was Ratgeber und Behörden zu dem Thema in Österreich schreiben.";

  const query = `Österreich ${params.categorySlug} ${params.clusterKeyword || ""} ${params.title || ""}. ${extra}
Suche aktuelle, sachliche Hinweise (Behörden, MA 48/46, Mistplatz, Halteverbot, Kostenrahmen).
Nenne 4–8 knappe Fakten mit Quelle (Domain). Keine abgeschriebenen Werbetexte, keine erfundenen Preise.`;

  const body = {
    model: process.env.OPENAI_RESEARCH_MODEL || "gpt-4o-mini",
    tools: [{ type: "web_search" }],
    input: query,
  };

  let res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS + 12000),
  });

  if (!res.ok) {
    res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...body,
        tools: [{ type: "web_search_preview" }],
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS + 12000),
    });
  }

  if (!res.ok) {
    return searchPreviewChat(key, query);
  }

  const json = (await res.json()) as {
    output_text?: string;
    output?: { content?: { text?: string }[] }[];
  };
  if (json.output_text) return json.output_text.slice(0, 4500);
  const texts =
    json.output
      ?.flatMap((item) => item.content || [])
      .map((c) => c.text)
      .filter(Boolean)
      .join("\n") || "";
  return texts.slice(0, 4500);
}

async function searchPreviewChat(key: string, query: string) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-search-preview",
      messages: [
        {
          role: "system",
          content:
            "Du recherchierst für einen österreichischen Ratgeber. Liefere knappe Fakten mit Quellen-Domains.",
        },
        { role: "user", content: query },
      ],
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS + 12000),
  });
  if (!res.ok) return "";
  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return json.choices?.[0]?.message?.content?.slice(0, 4500) || "";
}

async function fetchReferencePages(categorySlug: CategorySlug) {
  const category = getCategory(categorySlug);
  const urls = [
    ...OFFICIAL_SOURCES.slice(0, 3).map((s) => s.url),
    ...RESEARCH_SOURCES.map((s) => s.url),
    category?.pbnUrl,
  ].filter(Boolean) as string[];

    const snippets = await Promise.all(
    urls.slice(0, 6).map(async (url) => {
      try {
        const res = await fetch(url, {
          signal: AbortSignal.timeout(TIMEOUT_MS),
          headers: { "User-Agent": "GegenAlltagBot/1.0 (+https://gegenalltag.at)" },
        });
        if (!res.ok) return "";
        const html = await res.text();
        const text = html
          .replace(/<script[\s\S]*?<\/script>/gi, " ")
          .replace(/<style[\s\S]*?<\/style>/gi, " ")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 900);
        return text ? `${url}: ${text}` : "";
      } catch {
        return "";
      }
    }),
  );

  return snippets.filter(Boolean).join("\n\n");
}

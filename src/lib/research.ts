import { OFFICIAL_TOPIC_URLS, type CategorySlug } from "./site";

const TIMEOUT_MS = 8000;

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
  if (web) parts.push(`Behörden-Recherche:\n${web}`);

  const pages = await fetchOfficialPages(params.categorySlug).catch(() => "");
  if (pages) parts.push(`Amtliche Ausschnitte:\n${pages}`);

  return parts.join("\n\n").slice(0, 2400) || "Keine Webrecherche verfügbar.";
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
    ? `Briefing: ${params.editorPrompt.trim().slice(0, 280)}`
    : "";

  const query = `site:oesterreich.gv.at OR site:gv.at ${params.categorySlug} ${params.clusterKeyword || ""} ${extra}
Nur Fakten von Bund, Ländern und Gemeinden in ganz Österreich (oesterreich.gv.at, Landesportale, Gemeinde; Wien/MA nur wenn das Thema Wien ist). 5 kurze Punkte mit Domain. Keine Firmenwerbung, keine erfundenen Preise.`;

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
    signal: AbortSignal.timeout(TIMEOUT_MS + 10000),
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
      signal: AbortSignal.timeout(TIMEOUT_MS + 10000),
    });
  }

  if (!res.ok) {
    return searchPreviewChat(key, query);
  }

  const json = (await res.json()) as {
    output_text?: string;
    output?: { content?: { text?: string }[] }[];
  };
  if (json.output_text) return json.output_text.slice(0, 1800);
  const texts =
    json.output
      ?.flatMap((item) => item.content || [])
      .map((c) => c.text)
      .filter(Boolean)
      .join("\n") || "";
  return texts.slice(0, 1800);
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
      max_tokens: 320,
      messages: [
        {
          role: "system",
          content:
            "Kurze Behörden-Fakten für Österreich, mit Domain. Keine Werbetexte.",
        },
        { role: "user", content: query },
      ],
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS + 10000),
  });
  if (!res.ok) return "";
  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return json.choices?.[0]?.message?.content?.slice(0, 1800) || "";
}

async function fetchOfficialPages(categorySlug: CategorySlug) {
  const urls = OFFICIAL_TOPIC_URLS[categorySlug] || [];
  const snippets = await Promise.all(
    urls.slice(0, 3).map(async (url) => {
      try {
        const res = await fetch(url, {
          signal: AbortSignal.timeout(TIMEOUT_MS),
          headers: {
            "User-Agent": "GegenAlltagBot/1.0 (+https://gegenalltag.at)",
          },
        });
        if (!res.ok) return "";
        const html = await res.text();
        const text = html
          .replace(/<script[\s\S]*?<\/script>/gi, " ")
          .replace(/<style[\s\S]*?<\/style>/gi, " ")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 520);
        return text ? `${url}: ${text}` : "";
      } catch {
        return "";
      }
    }),
  );

  return snippets.filter(Boolean).join("\n\n");
}

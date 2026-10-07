import { prisma } from "./prisma";
import { getCategory, type CategorySlug } from "./site";

const WINDOW = 5;
const MAX_PBN_IN_WINDOW = 2;

export type LinkPlan = {
  includeServiceLink: boolean;
  serviceUrl: string | null;
  serviceAnchor: string | null;
  officialHint: string;
  related: { title: string; href: string; anchor: string }[];
};

function officialHint(slug: CategorySlug) {
  if (slug === "umzug") {
    return "Verweise im Fließtext auf MA 46 (Halteverbot), Wiener Wohnen und oesterreich.gv.at zur Ummeldung. Keine Firmen- oder Dienstleister-Backlinks.";
  }
  if (slug === "entruempelung") {
    return "Verweise auf MA 48, Mistplätze der Stadt Wien und oesterreich.gv.at. Dienstleister-Links nur wenn ausdrücklich vorgesehen.";
  }
  return "Verweise auf MA 48, wien.gv.at und – bei Exekution – auf die zuständigen Gerichtsseiten. Dienstleister-Links nur wenn ausdrücklich vorgesehen.";
}

export async function buildLinkPlan(params: {
  categorySlug: CategorySlug;
  targetLinkUrl?: string | null;
  targetAnchor?: string | null;
}): Promise<LinkPlan> {
  const category = getCategory(params.categorySlug);
  const relatedPosts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      category: { slug: params.categorySlug },
    },
    orderBy: { publishedAt: "desc" },
    take: 8,
    include: { category: true },
  });

  const related = relatedPosts.slice(0, 4).map((post) => ({
    title: post.title,
    href: `/${post.category.slug}/${post.slug}`,
    anchor: naturalAnchor(post.title, params.categorySlug),
  }));

  const windowPosts = relatedPosts.slice(0, WINDOW);
  const pbnCount = windowPosts.filter((p) =>
    containsServiceLink(p.content, category?.pbnHost),
  ).length;

  const host = category?.pbnHost;
  const defaultUrl = category?.pbnUrl;
  const requestedUrl = params.targetLinkUrl || defaultUrl;
  const canPbn = Boolean(host && requestedUrl) && pbnCount < MAX_PBN_IN_WINDOW;

  return {
    includeServiceLink: canPbn,
    serviceUrl: canPbn ? requestedUrl! : null,
    serviceAnchor: canPbn
      ? params.targetAnchor || defaultAnchor(params.categorySlug)
      : null,
    officialHint: officialHint(params.categorySlug),
    related,
  };
}

function containsServiceLink(html: string, host: string | null | undefined) {
  if (!host) return false;
  return html.includes(host);
}

function defaultAnchor(slug: CategorySlug) {
  if (slug === "entruempelung") return "Entrümpelung in Wien";
  if (slug === "raeumung") return "Objekt räumung in Österreich";
  return "Umzugshilfe in Wien";
}

function naturalAnchor(title: string, slug: CategorySlug) {
  const compact = title.replace(/\s+[–—-].*$/, "").trim();
  if (compact.length > 12 && compact.length < 70) return compact;
  if (slug === "entruempelung") return "die Entrümpelung in Wien";
  if (slug === "raeumung") return "eine Wohnungsräumung in Niederösterreich";
  return "die Umzug-Checkliste für Wien";
}

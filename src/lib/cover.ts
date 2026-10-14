import { sanitizeAlt } from "./cover-prompt";
import type { CategorySlug } from "./site";

const STOCK: Record<CategorySlug, string> = {
  entruempelung: "/images/boxes.webp",
  raeumung: "/images/house.webp",
  umzug: "/images/checklist.webp",
};

export function resolveCover(
  coverImage: string | null | undefined,
  categorySlug: string,
) {
  if (coverImage && coverImage.startsWith("/") && !coverImage.startsWith("//")) {
    if (coverImage.endsWith(".jpg")) {
      return coverImage.replace(/\.jpg$/i, ".webp");
    }
    return coverImage;
  }
  return STOCK[(categorySlug as CategorySlug)] || STOCK.entruempelung;
}

export function coverAltFor(params: {
  coverAlt?: string | null;
  title?: string | null;
  categorySlug?: string | null;
}) {
  const custom = sanitizeAlt(params.coverAlt);
  if (custom) return custom;
  const slug = params.categorySlug || "";
  if (slug === "umzug") return "Umzugswagen vor einem Haus in Österreich";
  if (slug === "raeumung") return "Leerer Altbauraum mit Kartons am Fenster";
  if (slug === "entruempelung") {
    return "Kartons in einem Hofeingang, bereit zur Entrümpelung";
  }
  return params.title?.trim() || "Beitragsbild";
}

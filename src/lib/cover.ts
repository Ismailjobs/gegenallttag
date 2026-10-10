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

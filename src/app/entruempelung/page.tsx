import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPageServer";
import { canonicalPath, getCategory } from "@/lib/site";

export const dynamic = "force-dynamic";

const category = getCategory("entruempelung")!;

export const metadata: Metadata = {
  title: "Entrümpelung in Österreich",
  description: category.description,
  alternates: { canonical: canonicalPath("/entruempelung") },
};

export default function Page() {
  return <CategoryPage slug="entruempelung" />;
}

import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPageServer";
import { canonicalPath, getCategory } from "@/lib/site";

export const dynamic = "force-dynamic";

const category = getCategory("raeumung")!;

export const metadata: Metadata = {
  title: "Räumung in Österreich",
  description: category.description,
  alternates: { canonical: canonicalPath("/raeumung") },
};

export default function Page() {
  return <CategoryPage slug="raeumung" />;
}

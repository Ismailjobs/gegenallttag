import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPageServer";
import { canonicalPath, getCategory } from "@/lib/site";

export const dynamic = "force-dynamic";

const category = getCategory("umzug")!;

export const metadata: Metadata = {
  title: "Umzug in Österreich",
  description: category.description,
  alternates: { canonical: canonicalPath("/umzug") },
};

export default function Page() {
  return <CategoryPage slug="umzug" />;
}

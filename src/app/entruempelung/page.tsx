import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPageServer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Entrümpelung in Wien und Niederösterreich",
  description:
    "Wohnungsentrümpelung, Hausentrümpelung, Messie, Verlassenschaft und Kosten – unabhängiger Ratgeber für Wien und NÖ.",
};

export default function Page() {
  return <CategoryPage slug="entruempelung" />;
}

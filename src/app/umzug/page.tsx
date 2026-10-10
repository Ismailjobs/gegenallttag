import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPageServer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Umzug in Wien und Niederösterreich",
  description:
    "Umzug Wien, Kosten, Übersiedlung, Halteverbotszone und Checkliste – unabhängig erklärt.",
};

export default function Page() {
  return <CategoryPage slug="umzug" />;
}

import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPageServer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Räumung in Wien und Niederösterreich",
  description:
    "Wohnungsräumung, Firmenräumung, Keller, Lager und Zwangsräumung – Ablauf und regionale Hinweise.",
};

export default function Page() {
  return <CategoryPage slug="raeumung" />;
}

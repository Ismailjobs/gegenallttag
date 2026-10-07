import type { Metadata } from "next";
import KontaktForm from "@/components/KontaktForm";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Redaktionelle Anfragen an Gegen Alltag – kein Auftragsformular für Räumungen.",
};

export default function KontaktPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy-400">
        Redaktion
      </p>
      <h1 className="mt-3 font-serif text-4xl sm:text-5xl text-ink">Kontakt</h1>
      <p className="mt-4 text-lg text-slate-600 leading-8">
        Hinweise zu Fehlern, Behördenlinks oder Themenwünschen. Kein Auftragsservice, keine
        Kostenvoranschläge für Entrümpelungen.
      </p>
      <KontaktForm />
    </section>
  );
}

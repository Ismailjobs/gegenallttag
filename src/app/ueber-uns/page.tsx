import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Über uns",
  description: `Was ${SITE.name} ist – und was nicht. Unabhängiger Ratgeber für Wien und Niederösterreich.`,
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy-400">Redaktion</p>
      <h1 className="mt-3 font-serif text-4xl sm:text-5xl text-ink">Über uns</h1>
      <div className="mt-8 space-y-5 text-lg leading-8 text-slate-600">
        <p>
          {SITE.name} ist ein editoryaler Ratgeber für Raum, Ordnung und Neuanfang in Österreich –
          mit Schwerpunkt Wien und Niederösterreich. Wir erklären Abläufe, Behördenwege und
          Kostenspannen, ohne ein Räumungsunternehmen zu sein.
        </p>
        <p>
          Texte entstehen redaktionell und über ein transparentes Themen-Backlog. Wo Dienstleister
          erwähnt werden, geschieht das sparsam. Amtliche Quellen bleiben{" "}
          <a className="text-accent underline" href="https://www.wien.gv.at" rel="nofollow">
            wien.gv.at
          </a>{" "}
          und{" "}
          <a className="text-accent underline" href="https://www.oesterreich.gv.at" rel="nofollow">
            oesterreich.gv.at
          </a>
          .
        </p>
        <p>
          {SITE.tagline} – das ist der Anspruch: Wissen vor Verkaufsdruck, Plan vor Panik, Region vor
          allgemeiner Floskel.
        </p>
      </div>
    </section>
  );
}

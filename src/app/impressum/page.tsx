import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Impressum" };

export default function ImpressumPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1 className="font-serif text-4xl text-ink">Impressum</h1>
      <div className="mt-8 space-y-4 text-slate-600 leading-8">
        <p>
          Medieninhaberin und redaktionelle Verantwortung: {SITE.name}, Österreich. Domain: {SITE.domain}.
        </p>
        <p>
          Inhaltlicher Zweck: unabhängige, allgemeine Informationen zu Entrümpelung, Räumung und Umzug
          in Wien und Niederösterreich. Keine Rechtsberatung, kein Werkvertrag, keine Vermittlungspflicht.
        </p>
        <p>
          Externe Links auf oesterreich.gv.at, wien.gv.at und andere Stellen werden mit Sorgfalt gesetzt;
          für deren Inhalt sind die jeweiligen Betreiber verantwortlich.
        </p>
        <p>Kontakt über das Formular unter /kontakt.</p>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { PUBLISHER, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Impressum / Offenlegung gemäß § 25 MedienG",
  description: `Medieninhaber und Offenlegung von ${SITE.domain} gemäß § 25 MedienG.`,
};

export default function ImpressumPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy-400">
        Rechtliches
      </p>
      <h1 className="mt-3 font-serif text-4xl sm:text-5xl text-ink">
        Impressum / Offenlegung gemäß § 25 MedienG
      </h1>

      <div className="mt-10 space-y-10 text-slate-600 leading-8">
        <section>
          <h2 className="font-serif text-2xl text-ink">
            Medieninhaber und für den Inhalt verantwortlich
          </h2>
          <p className="mt-4">{PUBLISHER.name}</p>
          <p>
            Adresse: {PUBLISHER.streetAddress}, {PUBLISHER.postalCode} {PUBLISHER.addressLocality}
          </p>
          <p>Telnr: {PUBLISHER.telephoneDisplay}</p>
          <p>
            E-Mail:{" "}
            <a className="text-accent underline" href={`mailto:${PUBLISHER.email}`}>
              {PUBLISHER.email}
            </a>
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-ink">Grundlegende Richtung (Blattlinie)</h2>
          <p className="mt-4">
            {SITE.domain} ist ein unabhängiges, redaktionelles Informations- und
            Ratgeberportal zu den Themen Entrümpelung, Räumung, Umzug, Übersiedlung,
            Umzugsplanung, Kosten und damit zusammenhängenden Themen. Die Website dient
            ausschließlich der allgemeinen Information und Orientierung.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-ink">
            Keine gewerblichen Umzugs- oder Räumungsleistungen
          </h2>
          <p className="mt-4">
            Über {SITE.domain} werden keine eigenen Umzugs-, Transport-, Räumungs- oder
            Entrümpelungsleistungen angeboten oder durchgeführt. Die Website nimmt keine
            Aufträge entgegen und vermittelt keine Verträge oder verbindlichen Angebote für
            solche Leistungen.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-ink">Rechtliche Hinweise</h2>
          <p className="mt-4">
            Die auf dieser Website bereitgestellten Inhalte dienen ausschließlich der
            allgemeinen Information und Orientierung und stellen keine individuelle Rechts-,
            Steuer- oder sonstige Fachberatung dar.
          </p>
          <p className="mt-4">
            Informationen zu Preisen, Kosten, Abläufen, gesetzlichen Bestimmungen oder
            behördlichen Vorgaben werden mit größtmöglicher Sorgfalt erstellt. Dennoch kann
            keine Gewähr für deren Vollständigkeit, Richtigkeit und Aktualität übernommen
            werden.
          </p>
          <p className="mt-4">
            Eine Haftung für Schäden aufgrund der Nutzung der bereitgestellten Informationen
            ist, soweit gesetzlich zulässig, ausgeschlossen.
          </p>
          <p className="mt-4">
            Für Inhalte externer Websites, auf die mittels Links verwiesen wird, sind
            ausschließlich deren Betreiber verantwortlich. Bei Bekanntwerden rechtswidriger
            Inhalte werden entsprechende Links entfernt.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-ink">Urheberrecht</h2>
          <p className="mt-4">
            Die auf {SITE.domain} veröffentlichten Texte, Grafiken und sonstigen eigenen
            Inhalte sind urheberrechtlich geschützt. Eine Verwendung außerhalb der
            gesetzlich zulässigen Grenzen bedarf der vorherigen Zustimmung des jeweiligen
            Rechteinhabers.
          </p>
        </section>
      </div>
    </section>
  );
}

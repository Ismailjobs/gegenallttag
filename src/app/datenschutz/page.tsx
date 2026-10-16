import type { Metadata } from "next";
import { canonicalPath, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Datenschutz",
  alternates: { canonical: canonicalPath("/datenschutz") },
};

export default function DatenschutzPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1 className="font-serif text-4xl text-ink">Datenschutz</h1>
      <div className="mt-8 space-y-4 text-slate-600 leading-8">
        <p>
          {SITE.name} verarbeitet personenbezogene Daten nur, soweit das für den Betrieb der Website und
          die Bearbeitung von Kontaktanfragen nötig ist (Art. 6 Abs. 1 lit. b und f DSGVO).
        </p>
        <p>
          Server-Logs enthalten übliche technische Angaben (IP-Adresse gekürzt soweit möglich, Zeitpunkt,
          User-Agent). Kontaktformularfelder dienen ausschließlich der Redaktionskorrespondenz.
        </p>
        <p>
          Das Admin-Login speichert ein httpOnly-Cookie mit dem Sitzungsgeheimnis. Es gibt kein Tracking
          zu Werbezwecken und keine Weitergabe an Räumungsunternehmen.
        </p>
        <p>
          Auskunft, Löschung und Beschwerde bei der österreichischen Datenschutzbehörde bleiben unberührt.
        </p>
      </div>
    </section>
  );
}

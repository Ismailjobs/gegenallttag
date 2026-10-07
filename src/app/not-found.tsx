import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-sm uppercase tracking-widest text-navy-400">404</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">Seite nicht gefunden</h1>
      <p className="mt-4 text-slate-600">
        Der Beitrag wurde verschoben oder existiert nicht. Zurück zur Startseite oder in die Ratgeber.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-navy-900 px-6 py-3 text-white font-semibold"
      >
        Zur Startseite
      </Link>
    </section>
  );
}

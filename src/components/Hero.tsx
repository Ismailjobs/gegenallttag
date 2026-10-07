import Link from "next/link";
import { Heart, ShieldCheck, MapPin, BookOpen } from "lucide-react";
import { CATEGORIES } from "@/lib/site";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-site px-4 sm:px-6 pt-10 lg:pt-14">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-8 items-start">
          <div className="pt-2 lg:pt-8">
            <h1 className="font-serif text-[40px] sm:text-[52px] leading-[1.12] text-ink font-medium max-w-xl">
              Ihr Ratgeber für Entrümpelung, Räumung und Umzug in Österreich
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">
              Praktische Tipps, regionale Informationen und Expertenwissen –
              für weniger Aufwand und einen guten Neuanfang.
            </p>
          </div>
          <div className="relative">
            <div className="relative overflow-hidden rounded-[28px] min-h-[360px] lg:min-h-[420px] bg-navy-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero-wien.jpg"
                alt="Wien, Blick über die Stadt zum Stephansdom"
                className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-navy-950/10 via-transparent to-transparent" />
              <p className="absolute left-8 top-7 font-script text-[36px] leading-[0.95] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
                Für ein
                <br />
                aufgeräumtes Morgen.
              </p>
              <div className="absolute right-5 bottom-5 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-sm text-navy-800 shadow-soft">
                <Heart className="h-4 w-4 text-accent fill-accent/20" />
                Österreich lebt weiter.
              </div>
            </div>
          </div>
        </div>

        <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-navy-800">
          <li className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-50 text-accent">
              <ShieldCheck className="h-4 w-4" />
            </span>
            Unabhängig und objektiv
          </li>
          <li className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-50 text-accent">
              <MapPin className="h-4 w-4" />
            </span>
            Regional für ganz Österreich
          </li>
          <li className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-50 text-accent">
              <BookOpen className="h-4 w-4" />
            </span>
            Praxisnahe Tipps von Experten
          </li>
        </ul>

        <div className="relative z-10 grid md:grid-cols-3 gap-4 mt-6 pb-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={category.href}
              className="group flex items-center gap-4 rounded-2xl border border-navy-100 bg-white px-5 py-5 shadow-card card-lift"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E8F2FB] text-accent">
                <CategoryGlyph name={category.icon} />
              </span>
              <span className="min-w-0">
                <span className="block font-serif text-xl text-ink">{category.name}</span>
                <span className="block text-sm text-slate-500">{category.teaser}</span>
              </span>
              <span className="ml-auto text-navy-300 group-hover:text-accent text-2xl">›</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryGlyph({ name }: { name: "package" | "home" | "truck" }) {
  if (name === "package") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </svg>
    );
  }
  if (name === "home") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 10v10h14V10" />
        <path d="M10 20v-6h4v6" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 17h1a2 2 0 0 0 4 0h6a2 2 0 0 0 4 0h1" />
      <path d="M14 17V6H3v8" />
      <path d="M14 8h4l3 4v5" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

import Link from "next/link";
import { Heart, ShieldCheck, MapPin, BookOpen } from "lucide-react";
import { CATEGORIES } from "@/lib/site";
import CoverImage from "./CoverImage";
import heroWien from "../../public/images/hero-wien.webp";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-site px-0 sm:px-6 lg:px-8 xl:px-10 pb-2">
        <div className="relative isolate overflow-hidden rounded-none sm:rounded-b-[28px] min-h-[560px] lg:min-h-[700px] flex flex-col">
          <div className="absolute inset-0">
            <CoverImage
              src={heroWien}
              alt="Wien, Blick über die Stadt zum Stephansdom"
              priority
              sizes="(max-width: 1320px) 100vw, 1320px"
              className="object-cover object-[center_right] scale-[1.08] origin-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white from-[0%] via-white/80 via-[38%] to-transparent to-[72%]" />
            <div className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-white via-white/50 to-transparent" />
            <div className="absolute -right-16 -bottom-24 h-[75%] w-[62%] bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.88)_0%,rgba(255,255,255,0.4)_38%,transparent_72%)]" />
          </div>

          <div className="relative z-10 flex flex-col flex-1 px-5 sm:px-8 lg:px-10 pt-10 sm:pt-14 lg:pt-16 pb-8">
        <p className="pointer-events-none hidden md:block absolute right-[12%] top-10 lg:top-14 font-script text-[34px] lg:text-[42px] leading-[0.95] text-navy-800/90 -rotate-6 drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
          Für ein
          <br />
          aufgeräumtes Morgen.
        </p>

        <div className="max-w-[560px]">
          <h1 className="font-serif text-[36px] sm:text-[48px] lg:text-[52px] leading-[1.12] text-ink font-medium">
            Ihr Ratgeber für Entrümpelung, Räumung und Umzug in Österreich
          </h1>
          <p className="mt-5 max-w-lg text-base sm:text-lg leading-8 text-slate-600">
            Praktische Tipps, regionale Informationen und Expertenwissen –
            für weniger Aufwand und einen guten Neuanfang.
          </p>
          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-navy-800">
            <li className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-accent shadow-soft">
                <ShieldCheck className="h-4 w-4" />
              </span>
              Unabhängig und objektiv
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-accent shadow-soft">
                <MapPin className="h-4 w-4" />
              </span>
              Regional für ganz Österreich
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-accent shadow-soft">
                <BookOpen className="h-4 w-4" />
              </span>
              Praxisnahe Tipps von Experten
            </li>
          </ul>
        </div>

        <div className="mt-10 lg:mt-auto grid sm:grid-cols-3 gap-3 sm:gap-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={category.href}
              className="group flex items-center gap-4 rounded-2xl border border-navy-100/80 bg-white px-5 py-5 shadow-card card-lift"
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

        <div className="pointer-events-none absolute right-4 sm:right-8 bottom-[9.5rem] sm:bottom-36 z-10 hidden sm:flex items-center gap-2 rounded-full bg-white/92 px-3 py-1.5 text-sm text-navy-800 shadow-soft">
          <Heart className="h-4 w-4 text-accent fill-accent/20" />
          Österreich lebt weiter.
        </div>
          </div>
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

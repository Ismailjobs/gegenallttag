"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { CATEGORIES, OFFICIAL_SOURCES, SITE } from "@/lib/site";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="mt-20 bg-navy-950 text-white">
      <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8 xl:px-10 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo inverted />
            <p className="mt-4 text-sm leading-6 text-white/70">
              {SITE.claim}. Unabhängige Orientierung für Wien und Niederösterreich.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">
              Ratgeber
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link href={c.href} className="text-white/80 hover:text-white">
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/ratgeber" className="text-white/80 hover:text-white">
                  Alle Artikel
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">
              Service
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/ueber-uns" className="text-white/80 hover:text-white">
                  Über uns
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-white/80 hover:text-white">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="/impressum" className="text-white/80 hover:text-white">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-white/80 hover:text-white">
                  Datenschutz
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">
              Amtliche Quellen
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {OFFICIAL_SOURCES.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    rel="nofollow noopener noreferrer"
                    target="_blank"
                    className="text-white/80 hover:text-white"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-white/50 flex flex-col sm:flex-row gap-2 sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}. Redaktioneller Ratgeber, kein Dienstleister.</p>
          <p>{SITE.domain}</p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import Logo from "./Logo";
import { NAV } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-navy-100">
      <div className="mx-auto max-w-site px-4 sm:px-6">
        <div className="flex h-[76px] items-center gap-4">
          <Logo />
          <nav className="ml-4 hidden lg:flex items-center gap-5 text-[15px] text-navy-800 whitespace-nowrap">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-1 transition ${
                    active ? "text-ink font-semibold" : "hover:text-ink"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute -bottom-[1.35rem] left-0 right-0 h-[2px] bg-ink" />
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto hidden md:flex items-center gap-3">
            <form action="/suchen" className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
              <input
                name="q"
                placeholder="Ratgeber durchsuchen …"
                className="h-10 w-44 xl:w-60 rounded-full border border-navy-100 bg-navy-50/60 pl-9 pr-3 text-sm placeholder:text-navy-400"
              />
            </form>
            <Link
              href="/kontakt"
              className="inline-flex h-10 items-center rounded-full bg-navy-900 px-5 text-sm font-semibold text-white hover:bg-ink"
            >
              Kontakt
            </Link>
          </div>
          <button
            className="ml-auto md:hidden p-2 text-ink"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menü"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-navy-100 bg-white px-4 pb-5">
          <nav className="flex flex-col py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-ink border-b border-navy-50"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <form action="/suchen" className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
            <input
              name="q"
              placeholder="Suchen …"
              className="h-11 w-full rounded-full border border-navy-100 bg-navy-50 pl-9 pr-3"
            />
          </form>
          <Link
            href="/kontakt"
            onClick={() => setOpen(false)}
            className="mt-3 flex h-11 items-center justify-center rounded-full bg-navy-900 text-white font-semibold"
          >
            Kontakt
          </Link>
        </div>
      )}
    </header>
  );
}

import type { Metadata } from "next";
import { Caveat, Newsreader, Source_Sans_3 } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/jsonld";
import { SITE } from "@/lib/site";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "optional",
  preload: false,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} – ${SITE.claim}`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Unabhängiger Ratgeber für Entrümpelung, Räumung und Umzug in Wien und Niederösterreich. Praxis, Kosten, Behörden – ohne Vertriebsdruck.",
  openGraph: {
    title: `${SITE.name} – ${SITE.claim}`,
    description:
      "Praktische Tipps, regionale Informationen und Expertenwissen für Wien und Niederösterreich.",
    locale: "de_AT",
    type: "website",
    siteName: SITE.name,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE.url },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de-AT">
      <body
        className={`${newsreader.variable} ${sourceSans.variable} ${caveat.variable} font-sans antialiased bg-white text-ink`}
      >
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

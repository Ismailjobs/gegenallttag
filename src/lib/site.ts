const PRODUCTION_ORIGIN = "https://gegenalltag.at";

export function siteOrigin() {
  const raw = String(process.env.SITE_URL || "")
    .trim()
    .replace(/\/$/, "");
  const isLocal = !raw || /localhost|127\.0\.0\.1/i.test(raw);
  if (isLocal && process.env.NODE_ENV === "production") {
    return PRODUCTION_ORIGIN;
  }
  return raw || "http://localhost:3030";
}

export const SITE = {
  name: "Gegen Alltag",
  domain: "GegenAlltag.at",
  tagline: "Wissen. Planen. Einfacher machen.",
  claim: "Ratgeber für Raum, Ordnung & Neuanfang in Österreich",
  locale: "de-AT",
  email: "info@gegenalltag.at",
  get url() {
    return siteOrigin();
  },
};

export const PUBLISHER = {
  name: "Nuran Duman",
  streetAddress: "Dr. Karl-Swoboda-Str. 25",
  postalCode: "2486",
  addressLocality: "Pottendorf",
  addressCountry: "AT",
  telephoneDisplay: "+43660 871 77 20",
  telephone: "+436608717720",
  email: SITE.email,
} as const;

export type CategorySlug = "entruempelung" | "raeumung" | "umzug";

export type Subtopic = {
  slug: string;
  name: string;
  hint: string;
};

export type CategoryDef = {
  slug: CategorySlug;
  name: string;
  short: string;
  description: string;
  teaser: string;
  href: string;
  icon: "package" | "home" | "truck";
  subtopics: Subtopic[];
  pbnHost: string | null;
  pbnUrl: string | null;
};

export const CATEGORIES: CategoryDef[] = [
  {
    slug: "entruempelung",
    name: "Entrümpelung",
    short: "Platz schaffen. Durchatmen. Neu starten.",
    description:
      "Entrümpelungen sind oft mit viel Arbeit, Stress und manchmal auch persönlichen Erinnerungen verbunden. Wir begleiten Sie zuverlässig und unkompliziert bei Wohnungsentrümpelungen, Hausentrümpelungen, Verlassenschaften und Messie-Haushalten – persönlich, respektvoll und in ganz Österreich.",
    teaser: "Platz schaffen. Durchatmen. Neu starten.",
    href: "/entruempelung",
    icon: "package",
    pbnHost: "sofortentrumpelung.at",
    pbnUrl: "https://sofortentrumpelung.at",
    subtopics: [
      { slug: "wohnungsentruempelung", name: "Wohnungsentrümpelung", hint: "Zimmerweise, mit Mistplatz-Logik" },
      { slug: "hausentruempelung", name: "Hausentrümpelung", hint: "Keller, Dachboden, Garten" },
      { slug: "messie", name: "Messie", hint: "Diskret, schrittweise, mit Plan" },
      { slug: "verlassenschaft", name: "Verlassenschaft", hint: "Nachlass, Fristen, Inventar" },
      { slug: "kosten", name: "Kosten", hint: "Volumen, Zufahrt, Entsorgung" },
    ],
  },
  {
    slug: "raeumung",
    name: "Räumung",
    short: "Zuverlässig. Diskret. Mit Plan.",
    description:
      "Räumungen bringen oft viele organisatorische, rechtliche und persönliche Fragen mit sich. Wir bieten Ihnen verständliche und praxisnahe Orientierung zu Wohnungsräumungen, Firmenräumungen, Keller-, Lager- und Zwangsräumungen – zuverlässig, menschlich und in ganz Österreich.",
    teaser: "Zuverlässig. Diskret. Mit Plan.",
    href: "/raeumung",
    icon: "home",
    pbnHost: "objektraeumung.at",
    pbnUrl: "https://objektraeumung.at",
    subtopics: [
      { slug: "wohnungsraeumung", name: "Wohnungsräumung", hint: "Übergabe, Kaution, Protokoll" },
      { slug: "firmenraeumung", name: "Firmenräumung", hint: "Betriebe, Büros, Fristen" },
      { slug: "keller", name: "Keller", hint: "Hausordnung, Sperrmüll, kommunale Entsorgung" },
      { slug: "lager", name: "Lager", hint: "Selfstorage und Betriebsflächen" },
      { slug: "zwangsraeumung", name: "Zwangsräumung", hint: "Exekution, Räumungstermin" },
    ],
  },
  {
    slug: "umzug",
    name: "Umzug",
    short: "Gut organisiert. Sicher am Ziel.",
    description:
      "Von der ersten Planung bis zum Einzug: Hier finden Sie hilfreiche Tipps rund um Umzug, Kosten, Organisation, Halteverbotszonen, Checklisten und Ummeldungen – verständlich erklärt für Umzüge in ganz Österreich.",
    teaser: "Gut organisiert. Sicher am Ziel.",
    href: "/umzug",
    icon: "truck",
    pbnHost: null,
    pbnUrl: null,
    subtopics: [
      { slug: "umzug-wien", name: "Umzug Wien", hint: "Höfe, Stiegen, Parkpickerl" },
      { slug: "kosten", name: "Kosten", hint: "Volumen, Etagen, Distanz" },
      { slug: "uebersiedlung", name: "Übersiedlung", hint: "Bundesländer, Gemeinden, Pendelwege" },
      { slug: "halteverbotszone", name: "Halteverbotszone", hint: "Gemeinde, Vorlauf, Schilder" },
      { slug: "checkliste", name: "Checkliste", hint: "Ummeldung, Zähler, Schlüssel" },
    ],
  },
];

export const NAV = [
  { href: "/", label: "Startseite" },
  { href: "/entruempelung", label: "Entrümpelung" },
  { href: "/raeumung", label: "Räumung" },
  { href: "/umzug", label: "Umzug" },
  { href: "/ratgeber", label: "Ratgeber" },
  { href: "/ueber-uns", label: "Über uns" },
] as const;

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

/** Nur Behörden – Wettbewerber-Homepages nicht crawlen. */
export const OFFICIAL_TOPIC_URLS: Record<CategorySlug, string[]> = {
  entruempelung: [
    "https://www.oesterreich.gv.at",
    "https://www.wien.gv.at/umwelt/ma48/",
    "https://www.wien.gv.at/umwelt/ma48/entsorgung/mistplatz/",
  ],
  raeumung: [
    "https://www.oesterreich.gv.at",
    "https://www.wien.gv.at/umwelt/ma48/",
    "https://www.justiz.gv.at",
  ],
  umzug: [
    "https://www.oesterreich.gv.at",
    "https://www.wien.gv.at/verkehr/verkehrsorganisation/",
    "https://www.help.gv.at",
  ],
};

export const OFFICIAL_SOURCES = [
  {
    name: "oesterreich.gv.at",
    url: "https://www.oesterreich.gv.at",
    label: "Lebenslagen des Bundes für ganz Österreich",
  },
  {
    name: "wien.gv.at",
    url: "https://www.wien.gv.at",
    label: "Stadt Wien – Services und Magistratsabteilungen",
  },
  {
    name: "MA 48",
    url: "https://www.wien.gv.at/umwelt/ma48/",
    label: "Abfallwirtschaft, Straßenreinigung und Fuhrpark",
  },
  {
    name: "MA 46",
    url: "https://www.wien.gv.at/verkehr/verkehrsorganisation/",
    label: "Verkehrsorganisation und technische Verkehrsangelegenheiten",
  },
] as const;

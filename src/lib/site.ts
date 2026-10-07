export const SITE = {
  name: "Gegen Alltag",
  domain: "GegenAlltag.at",
  tagline: "Wissen. Planen. Einfacher machen.",
  claim: "Ratgeber für Raum, Ordnung & Neuanfang in Österreich",
  locale: "de-AT",
  url: process.env.SITE_URL || "http://localhost:3030",
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
      "Praxisnahe Orientierung zu Wohnungsentrümpelung, Hausentrümpelung, Messie-Haushalten, Verlassenschaft und Kosten in Wien und Niederösterreich.",
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
      "Wohnungsräumung, Firmenräumung, Keller, Lager und Zwangsräumung: Ablauf, Rechte und regionale Besonderheiten in Wien und NÖ.",
    teaser: "Zuverlässig. Diskret. Mit Plan.",
    href: "/raeumung",
    icon: "home",
    pbnHost: "objektraeumung.at",
    pbnUrl: "https://objektraeumung.at",
    subtopics: [
      { slug: "wohnungsraeumung", name: "Wohnungsräumung", hint: "Übergabe, Kaution, Protokoll" },
      { slug: "firmenraeumung", name: "Firmenräumung", hint: "Betriebe, Büros, Fristen" },
      { slug: "keller", name: "Keller", hint: "Hausordnung, Sperrmüll, MA 48" },
      { slug: "lager", name: "Lager", hint: "Selfstorage und Betriebsflächen" },
      { slug: "zwangsraeumung", name: "Zwangsräumung", hint: "Exekution, Räumungstermin" },
    ],
  },
  {
    slug: "umzug",
    name: "Umzug",
    short: "Gut organisiert. Sicher am Ziel.",
    description:
      "Umzug in Wien, Kosten, Übersiedlung, Halteverbotszone und Checklisten – von der Planung bis zur Ummeldung.",
    teaser: "Gut organisiert. Sicher am Ziel.",
    href: "/umzug",
    icon: "truck",
    pbnHost: null,
    pbnUrl: null,
    subtopics: [
      { slug: "umzug-wien", name: "Umzug Wien", hint: "Höfe, Stiegen, Parkpickerl" },
      { slug: "kosten", name: "Kosten", hint: "Volumen, Etagen, Distanz" },
      { slug: "uebersiedlung", name: "Übersiedlung", hint: "Wien, NÖ und Pendelwege" },
      { slug: "halteverbotszone", name: "Halteverbotszone", hint: "MA 46, Vorlauf, Schilder" },
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

export const RESEARCH_SOURCES = [
  { name: "Ratgeber Österreich", url: "https://ratgeber-oesterreich.at" },
  { name: "Sofortentrümpelung", url: "https://sofortentrumpelung.at" },
  { name: "Objekträumung", url: "https://objektraeumung.at" },
] as const;

export const OFFICIAL_SOURCES = [
  {
    name: "oesterreich.gv.at",
    url: "https://www.oesterreich.gv.at",
    label: "Unternehmensservice und Lebenslagen des Bundes",
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

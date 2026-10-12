import { PUBLISHER, SITE } from "./site";
import type { FaqItem } from "./utils";

export function organizationSchema() {
  const url = SITE.url.replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}/#organization`,
    name: SITE.name,
    alternateName: SITE.domain,
    legalName: PUBLISHER.name,
    url,
    logo: `${url}/images/logo.png`,
    description: SITE.claim,
    email: PUBLISHER.email,
    telephone: PUBLISHER.telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress: PUBLISHER.streetAddress,
      postalCode: PUBLISHER.postalCode,
      addressLocality: PUBLISHER.addressLocality,
      addressCountry: PUBLISHER.addressCountry,
    },
    founder: {
      "@type": "Person",
      name: PUBLISHER.name,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "editorial",
      email: PUBLISHER.email,
      telephone: PUBLISHER.telephone,
      availableLanguage: ["de-AT", "de"],
    },
    publishingPrinciples: `${url}/impressum`,
    areaServed: [
      { "@type": "Country", name: "Österreich" },
      { "@type": "AdministrativeArea", name: "Wien" },
      { "@type": "AdministrativeArea", name: "Niederösterreich" },
      { "@type": "AdministrativeArea", name: "Oberösterreich" },
      { "@type": "AdministrativeArea", name: "Steiermark" },
      { "@type": "AdministrativeArea", name: "Kärnten" },
      { "@type": "AdministrativeArea", name: "Salzburg" },
      { "@type": "AdministrativeArea", name: "Tirol" },
      { "@type": "AdministrativeArea", name: "Vorarlberg" },
      { "@type": "AdministrativeArea", name: "Burgenland" },
    ],
    knowsAbout: ["Entrümpelung", "Räumung", "Umzug", "Wohnungsauflösung"],
  };
}

export function websiteSchema() {
  const url = SITE.url.replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    url,
    name: SITE.name,
    inLanguage: "de-AT",
    publisher: { "@id": `${url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${url}/suchen?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    hasPart: {
      "@type": "DataFeed",
      name: `${SITE.name} RSS-Feed`,
      url: `${url}/feed.xml`,
      encodingFormat: "application/rss+xml",
    },
  };
}

export function blogPostingSchema(params: {
  title: string;
  description: string;
  url: string;
  image?: string | null;
  datePublished?: Date | string | null;
  dateModified?: Date | string | null;
  articleSection?: string;
  keywords?: string[];
  about?: string;
  wordCount?: number;
}) {
  const origin = SITE.url.replace(/\/$/, "");
  const image = absoluteUrl(params.image);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: params.title,
    description: params.description,
    inLanguage: "de-AT",
    mainEntityOfPage: { "@type": "WebPage", "@id": params.url },
    url: params.url,
    image: image ? [image] : undefined,
    datePublished: toIso(params.datePublished),
    dateModified: toIso(params.dateModified || params.datePublished),
    author: { "@id": `${origin}/#organization` },
    publisher: { "@id": `${origin}/#organization` },
    articleSection: params.articleSection,
    keywords: params.keywords?.filter(Boolean).join(", "),
    about: params.about
      ? { "@type": "Thing", name: params.about }
      : undefined,
    wordCount: params.wordCount,
    isPartOf: { "@id": `${origin}/#website` },
  };
}

export function faqPageSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function collectionPageSchema(params: {
  name: string;
  description: string;
  url: string;
}) {
  const origin = SITE.url.replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: params.name,
    description: params.description,
    url: params.url,
    inLanguage: "de-AT",
    isPartOf: { "@id": `${origin}/#website` },
    publisher: { "@id": `${origin}/#organization` },
  };
}

export function absoluteUrl(path?: string | null) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${SITE.url.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

function toIso(value?: Date | string | null) {
  if (!value) return undefined;
  const d = typeof value === "string" ? new Date(value) : value;
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

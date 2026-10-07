import type { Metadata } from "next";
import ArticlePageServer, { articleMetadata } from "@/components/ArticlePageServer";

type Props = { params: { slug: string } };

export function generateMetadata({ params }: Props): Promise<Metadata> {
  return articleMetadata("umzug", params.slug);
}

export default function Page({ params }: Props) {
  return <ArticlePageServer categorySlug="umzug" slug={params.slug} />;
}

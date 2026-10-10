import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import { formatDate, readingLabel } from "@/lib/utils";
import { resolveCover } from "@/lib/cover";
import CoverImage from "./CoverImage";

export type ArticleCardPost = {
  slug: string;
  title: string;
  subtitle?: string | null;
  metaDesc?: string;
  readingTime: number;
  publishedAt?: Date | string | null;
  coverImage?: string | null;
  category: { name: string; slug: string };
};

export default function ArticleCard({ post }: { post: ArticleCardPost }) {
  const href = `/${post.category.slug}/${post.slug}`;
  const image = resolveCover(post.coverImage, post.category.slug);

  return (
    <article className="group flex h-full flex-col">
      <Link href={href} className="relative block overflow-hidden rounded-2xl aspect-[16/10] bg-navy-50">
        <CoverImage
          src={image}
          alt=""
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 bottom-3 z-10 rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-navy-700">
          {post.category.name}
        </span>
      </Link>
      <div className="pt-4 flex flex-col flex-1">
        <h3 className="font-serif text-[22px] leading-snug text-ink">
          <Link href={href} className="hover:text-navy-700">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600 line-clamp-3">
          {post.subtitle || post.metaDesc}
        </p>
        <div className="mt-auto pt-4 flex items-center gap-4 text-[13px] text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(post.publishedAt)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {readingLabel(post.readingTime)}
          </span>
        </div>
      </div>
    </article>
  );
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi, unauthorized } from "@/lib/admin-api";
import { generateCoverWebp } from "@/lib/images";
import { coverPromptFromArticle } from "@/lib/cover-prompt";
import type { CategorySlug } from "@/lib/site";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  if (!requireAdminApi()) return unauthorized();
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { category: true },
  });
  if (!post) return NextResponse.json({ ok: false }, { status: 404 });

  try {
    const visualPrompt = await coverPromptFromArticle({
      title: post.title,
      subtitle: post.subtitle,
      html: post.content,
      categorySlug: post.category.slug as CategorySlug,
    });
    const cover = await generateCoverWebp({
      title: post.title,
      subtitle: post.subtitle,
      categorySlug: post.category.slug as CategorySlug,
      slug: post.slug,
      coverPrompt: visualPrompt,
    });
    if (!cover) {
      return NextResponse.json(
        { ok: false, error: "Görsel üretilmedi. OPENAI_API_KEY değerini kontrol edin." },
        { status: 400 },
      );
    }
    await prisma.post.update({
      where: { id: post.id },
      data: { coverImage: cover },
    });
    return NextResponse.json({ ok: true, coverImage: cover });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Görsel üretilemedi.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

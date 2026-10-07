import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCategory } from "@/lib/site";
import { generateArticleFromTopic } from "@/lib/generator";
import { requireAdminApi, unauthorized } from "@/lib/admin-api";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
  if (!requireAdminApi()) return unauthorized();

  const body = await request.json().catch(() => ({}));
  const editorPrompt = String(body.editorPrompt || "").trim();
  const titleHint = String(body.title || "").trim();
  const clusterKeyword = String(body.clusterKeyword || "").trim();
  const categorySlug = String(body.categorySlug || "").trim();
  if ((!editorPrompt && !titleHint) || !getCategory(categorySlug)) {
    return NextResponse.json(
      { ok: false, error: "Prompt (veya başlık) ve kategori gerekli." },
      { status: 400 },
    );
  }

  const topic = await prisma.targetTopic.create({
    data: {
      title: titleHint || editorPrompt.slice(0, 90),
      clusterKeyword,
      categorySlug,
      targetLinkUrl: String(body.targetLinkUrl || "").trim() || null,
      targetAnchor: String(body.targetAnchor || "").trim() || null,
      editorPrompt: editorPrompt || titleHint,
      webResearch: body.webResearch !== false,
      status: "PENDING",
    },
  });

  if (!body.generateNow) {
    return NextResponse.json({ ok: true, topic });
  }

  try {
    const post = await generateArticleFromTopic(topic.id);
    return NextResponse.json({
      ok: true,
      topic,
      postId: post?.id,
      preview: post ? `/admin/vorschau/${post.id}` : undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Üretim başarısız.";
    return NextResponse.json({ ok: false, error: message, topic }, { status: 500 });
  }
}

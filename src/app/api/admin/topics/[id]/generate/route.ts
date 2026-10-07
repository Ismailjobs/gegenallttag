import { NextResponse } from "next/server";
import { requireAdminApi, unauthorized } from "@/lib/admin-api";
import { generateArticleFromTopic } from "@/lib/generator";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  if (!requireAdminApi()) return unauthorized();
  try {
    const post = await generateArticleFromTopic(params.id);
    if (!post) {
      return NextResponse.json(
        { ok: false, error: "Bu konu zaten işleniyor." },
        { status: 409 },
      );
    }
    return NextResponse.json({
      ok: true,
      postId: post.id,
      preview: `/admin/vorschau/${post.id}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Üretim başarısız.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

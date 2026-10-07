import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi, unauthorized } from "@/lib/admin-api";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  if (!requireAdminApi()) return unauthorized();
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ ok: false }, { status: 404 });

  const updated = await prisma.post.update({
    where: { id: post.id },
    data: {
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  return NextResponse.json({
    ok: true,
    href: `/${(await prisma.category.findUnique({ where: { id: updated.categoryId } }))?.slug}/${updated.slug}`,
  });
}

import { unlink } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi, unauthorized } from "@/lib/admin-api";
import { isSafeMediaName, uploadsDir } from "@/lib/images";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  if (!requireAdminApi()) return unauthorized();
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ ok: false }, { status: 404 });

  if (post.coverImage?.startsWith("/media/")) {
    const name = post.coverImage.slice("/media/".length);
    if (isSafeMediaName(name)) {
      await unlink(path.join(uploadsDir(), name)).catch(() => null);
    }
  }

  await prisma.post.delete({ where: { id: post.id } });
  return NextResponse.json({ ok: true });
}

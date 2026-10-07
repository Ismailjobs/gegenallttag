import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi, unauthorized } from "@/lib/admin-api";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  if (!requireAdminApi()) return unauthorized();
  await prisma.targetTopic.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { isValidSecret } from "@/lib/auth";
import { generateIfDue, publishDue } from "@/lib/scheduler";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key") || request.headers.get("x-admin-key");
  if (!isValidSecret(key)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const published = await publishDue();
  const generated = await generateIfDue();
  return NextResponse.json({ ok: true, published, generated });
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidSecret } from "@/lib/auth";
import { generateIfDue, publishDue } from "@/lib/scheduler";

export async function POST() {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  if (!isValidSecret(token)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const published = await publishDue();
  const generated = await generateIfDue();
  return NextResponse.json({ ok: true, published, generated });
}

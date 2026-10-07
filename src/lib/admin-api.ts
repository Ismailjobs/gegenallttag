import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidSecret } from "./auth";

export function unauthorized() {
  return NextResponse.json({ ok: false, error: "Oturum açık değil." }, { status: 401 });
}

export function requireAdminApi() {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return isValidSecret(token);
}

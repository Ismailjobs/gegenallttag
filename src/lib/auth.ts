import { cookies } from "next/headers";

export const ADMIN_COOKIE = "ga_admin";

export function getAdminSecret() {
  return process.env.ADMIN_SECRET_KEY || "";
}

export function isValidSecret(value: string | undefined | null) {
  const secret = getAdminSecret();
  return Boolean(secret) && value === secret;
}

export function isAdminAuthenticated() {
  const secret = getAdminSecret();
  if (!secret) return false;
  return cookies().get(ADMIN_COOKIE)?.value === secret;
}

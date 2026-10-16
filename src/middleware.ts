import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = (request.headers.get("host") || "").split(":")[0].toLowerCase();
  const url = request.nextUrl.clone();

  if (host === "www.gegenalltag.at") {
    url.protocol = "https:";
    url.host = "gegenalltag.at";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.replace(/\/+$/, "");
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|media/|images/).*)"],
};

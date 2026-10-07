import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { isSafeMediaName, uploadsDir } from "@/lib/images";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: { name: string } },
) {
  const name = params.name;
  if (!isSafeMediaName(name)) {
    return NextResponse.json({ error: "Ungültiger Dateiname." }, { status: 400 });
  }
  try {
    const file = await readFile(path.join(uploadsDir(), name));
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Nicht gefunden." }, { status: 404 });
  }
}

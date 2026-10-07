import { mkdir, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import OpenAI from "openai";
import type { CategorySlug } from "./site";

const MIN_BYTES = 70 * 1024;
const MAX_BYTES = 180 * 1024;

export function uploadsDir() {
  return path.join(process.cwd(), "data", "uploads");
}

export function isSafeMediaName(name: string) {
  return /^[a-zA-Z0-9._-]+\.webp$/.test(name);
}

export async function generateCoverWebp(params: {
  title: string;
  subtitle?: string | null;
  categorySlug: CategorySlug;
  slug: string;
  coverPrompt?: string | null;
}): Promise<string | null> {
  if (process.env.GENERATE_COVER_IMAGES === "false") return null;
  if (!process.env.OPENAI_API_KEY) return null;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const raw = await generateRawImage(openai, coverPrompt(params));
  if (!raw) return null;

  const webp = await compressToWebp(raw);
  await mkdir(uploadsDir(), { recursive: true });
  const name = `${params.slug}-${Date.now()}.webp`;
  await writeFile(path.join(uploadsDir(), name), webp);
  console.log(`[cover] ${name} ${(webp.length / 1024).toFixed(1)} KB`);
  return `/media/${name}`;
}

async function generateRawImage(openai: OpenAI, prompt: string) {
  const preferred = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";
  const models = unique([preferred, "gpt-image-1", "dall-e-3", "dall-e-2"]);
  let lastError: unknown;

  for (const model of models) {
    try {
      const result = await openai.images.generate(paramsFor(model, prompt));
      const item = result.data?.[0];
      if (item?.b64_json) return Buffer.from(item.b64_json, "base64");
      if (item?.url) {
        const response = await fetch(item.url);
        if (!response.ok) throw new Error("Bild-Download fehlgeschlagen.");
        return Buffer.from(await response.arrayBuffer());
      }
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[cover] ${model} fehlgeschlagen: ${message}`);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Kein Bildmodell verfügbar.");
}

function paramsFor(model: string, prompt: string): OpenAI.Images.ImageGenerateParams {
  if (model === "gpt-image-1" || model.startsWith("gpt-image")) {
    return {
      model,
      prompt,
      n: 1,
      size: "1536x1024",
      quality: "high",
    };
  }
  if (model === "dall-e-3") {
    return {
      model,
      prompt,
      n: 1,
      size: "1792x1024",
      quality: "hd",
      style: "vivid",
    };
  }
  return {
    model: "dall-e-2",
    prompt,
    n: 1,
    size: "1024x1024",
  };
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

async function compressToWebp(input: Buffer) {
  const prepared = await sharp(input)
    .rotate()
    .resize(1600, 1000, { fit: "cover", position: "attention" })
    .modulate({ saturation: 1.06, brightness: 1.02 })
    .toBuffer();

  let quality = 78;
  let out = await sharp(prepared).webp({ quality, effort: 6 }).toBuffer();

  while (out.length > MAX_BYTES && quality > 42) {
    quality -= 5;
    out = await sharp(prepared).webp({ quality, effort: 6 }).toBuffer();
  }

  if (out.length < MIN_BYTES && quality < 88) {
    quality = Math.min(88, quality + 8);
    out = await sharp(prepared).webp({ quality, effort: 5 }).toBuffer();
    if (out.length > MAX_BYTES) {
      quality = Math.max(48, quality - 8);
      out = await sharp(prepared).webp({ quality, effort: 6 }).toBuffer();
    }
  }

  return out;
}

function coverPrompt(params: {
  title: string;
  subtitle?: string | null;
  categorySlug: CategorySlug;
  coverPrompt?: string | null;
}) {
  const scene =
    params.categorySlug === "umzug"
      ? "A luxury editorial photograph of a Viennese Gründerzeit street at golden hour: a clean white removal van, stacked linen-wrapped furniture, warm sandstone facade, cobblestones, cinematic bokeh, magazine-cover composition."
      : params.categorySlug === "raeumung"
        ? "A cinematic still of a newly emptied Austrian Altbau apartment: tall windows, herringbone parquet catching late sun, one elegant cardboard stack, quiet grandeur, Architectural Digest lighting."
        : "A striking editorial photo of an Entrümpelung courtyard in Wien: Hofeinfahrt, warm brick, carefully stacked cartons, a classic Stiegenhaus glimpse, rich color, shallow depth of field, prestige documentary look.";

  const custom = params.coverPrompt?.trim();
  const topic = [params.title, params.subtitle].filter(Boolean).join(" — ");

  return [
    custom || scene,
    `Story: ${topic}.`,
    "Photorealistic, ultra-detailed, 8k, cinematic color grade, premium magazine cover, no illustration, no collage, no logos, no watermarks, no readable text, no faces in the foreground, elegant and impressive.",
  ].join(" ");
}

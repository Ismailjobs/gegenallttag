import cron from "node-cron";
import { prisma } from "./prisma";
import { generateArticleFromTopic } from "./generator";

let started = false;

export function startScheduler() {
  if (started) return;
  started = true;

  cron.schedule("*/2 * * * *", () => {
    publishDue().catch((err) => console.error("[scheduler] publishDue", err));
  });

  cron.schedule("15 * * * *", () => {
    generateIfDue().catch((err) => console.error("[scheduler] generate", err));
  });

  publishDue().catch((err) => console.error("[scheduler] initial publish", err));
  generateIfDue().catch((err) => console.error("[scheduler] initial generate", err));

  console.log("[scheduler] Gegen Alltag Cron aktiv (Europe/Vienna).");
}

export async function publishDue() {
  const due = await prisma.post.findMany({
    where: {
      status: "SCHEDULED",
      scheduledFor: { lte: new Date() },
    },
  });

  for (const post of due) {
    await prisma.post.update({
      where: { id: post.id },
      data: { status: "PUBLISHED", publishedAt: new Date() },
    });
  }

  return due.length;
}

export async function generateIfDue() {
  if (!process.env.OPENAI_API_KEY) return 0;
  const quota = Number(process.env.ARTICLES_PER_DAY || "1") || 1;

  const start = startOfViennaDay();
  const produced = await prisma.post.count({
    where: {
      createdAt: { gte: start },
      scheduledFor: { not: null },
    },
  });
  if (produced >= quota) return 0;

  const topic = await prisma.targetTopic.findFirst({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
  });
  if (!topic) return 0;

  await generateArticleFromTopic(topic.id);
  return 1;
}

function startOfViennaDay() {
  const now = new Date();
  const vienna = new Date(
    now.toLocaleString("en-US", { timeZone: "Europe/Vienna" }),
  );
  vienna.setHours(0, 0, 0, 0);
  const offset = now.getTime() - new Date(now.toLocaleString("en-US", { timeZone: "Europe/Vienna" })).getTime();
  return new Date(vienna.getTime() + offset);
}

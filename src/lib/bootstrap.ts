import { prisma } from "./prisma";
import { CATEGORIES } from "./site";
import { SEED_POSTS, SEED_TOPICS } from "./seed-data";

export async function bootstrapDatabase() {
  const categoryCount = await prisma.category.count();
  if (categoryCount === 0) {
    await seedAll();
    return;
  }

  const postCount = await prisma.post.count();
  if (postCount === 0) {
    await seedPostsAndTopics();
  }
}

export async function seedAll() {
  for (const category of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
    });
  }
  await seedPostsAndTopics();
}

async function seedPostsAndTopics() {
  for (const post of SEED_POSTS) {
    const category = await prisma.category.findUnique({
      where: { slug: post.categorySlug },
    });
    if (!category) continue;

    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        slug: post.slug,
        title: post.title,
        subtitle: post.subtitle,
        metaTitle: post.metaTitle,
        metaDesc: post.metaDesc,
        readingTime: post.readingTime,
        categoryId: category.id,
        content: post.content,
        tableJson: JSON.stringify(post.table),
        checklistJson: JSON.stringify(post.checklist),
        faqJson: JSON.stringify(post.faqs),
        schemaJson: JSON.stringify({
          keywords: [post.categorySlug, post.title],
          about: post.subtitle || post.title,
          articleSection: post.categorySlug,
        }),
        coverImage: post.coverImage,
        createdAt: new Date(post.publishedAt),
        status: "PUBLISHED",
        publishedAt: new Date(post.publishedAt),
      },
    });
  }

  const topicCount = await prisma.targetTopic.count();
  if (topicCount === 0) {
    await prisma.targetTopic.createMany({ data: SEED_TOPICS });
  }
}

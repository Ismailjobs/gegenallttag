import { prisma } from "./prisma";
import { CATEGORIES } from "./site";

export async function bootstrapDatabase() {
  await seedCategories();
}

export async function seedAll() {
  await seedCategories();
}

async function seedCategories() {
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
}

import { PrismaClient } from "@prisma/client";
import { seedAll } from "../src/lib/bootstrap";

const prisma = new PrismaClient();

async function main() {
  await seedAll();
  console.log("Seed abgeschlossen.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

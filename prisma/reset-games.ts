import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.game.deleteMany();

  console.log("Games deleted");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
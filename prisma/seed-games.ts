import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.game.createMany({
    data: [
      { name: "FC25" },
      { name: "Tekken 8" },
      { name: "GTA V" },
      { name: "God of War" },
      { name: "Mortal Kombat" },
      { name: "UFC 2026" },
      { name: "Uncharted 4" },
      { name: "Assassin's Creed" },
      { name: "Sniper Elite" },
      { name: "The Last of Us" },
      { name: "The Witcher" },
      { name: "The Last of Us Part II" },
      { name: "Watch Dogs" },
      { name: "Resident Evil" },
      { name: "Resident Evil 4" },
      { name: "Resident Evil 5" },
      { name: "Far Cry 6" },
      { name: "Call of Duty - Black Ops" },
      { name: "Call of Duty - Modern Warfare" },
      { name: "Battle Field" },
      { name: "Naruto" },
    ],
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
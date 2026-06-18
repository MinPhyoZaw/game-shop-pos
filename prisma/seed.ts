import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.station.createMany({
    data: [
      { code: "PS4-1", type: "PS4", hourlyRateMmk: 3000 },
      { code: "PS4-2", type: "PS4", hourlyRateMmk: 3000 },
      { code: "PS4-3", type: "PS4", hourlyRateMmk: 3000 },
      { code: "PS4-4", type: "PS4", hourlyRateMmk: 3000 },
      { code: "PS4-5", type: "PS4", hourlyRateMmk: 3000 },
      { code: "PS4-6", type: "PS4", hourlyRateMmk: 3000 },
      { code: "PS3-1", type: "PS3", hourlyRateMmk: 2000 },
    ],
  });

  console.log("Stations seeded");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
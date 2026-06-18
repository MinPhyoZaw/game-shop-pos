import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      { name: "Extra Controller", priceMmk: 1000 },
      { name: "Cold Drink", priceMmk: 1000 },
      { name: "Coffee", priceMmk: 1500 },
      { name: "Instant Noodle", priceMmk: 2000 },
      { name: "Fried Potato", priceMmk: 2500 },
      { name: "Energy Drink", priceMmk: 1500 },
      { name: "Mineral Water", priceMmk: 500 },
      { name: "Chicken Burger", priceMmk: 3500 },
      { name: "Hot Dog", priceMmk: 3000 },
      { name: "Ice Cream", priceMmk: 2000 },
      { name: "Extra Controller", priceMmk: 1000 },
    ],
  });

  console.log("Products seeded successfully");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
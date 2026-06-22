import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.game.createMany({
    data: [
      { 
        name: "FC25",
        coverImage: "/game-covers/gta5.jpg",
       },
      { 
        name: "Tekken 8",
        coverImage: "/game-covers/tekken8.jpg",},
      { 
         name: "GTA V",
         coverImage: "/game-covers/gta5.jpg",},
      {
         name: "God of War",
         coverImage: "/game-covers/god-of-war.jpg",},
      { 
        name: "Mortal Kombat" ,
        coverImage: "/game-covers/mortal-kombat.jpg",},
      {
         name: "UFC 2026",
         coverImage: "/game-covers/ufc.jpg",},
      { 
        name: "Uncharted 4",
        coverImage: "/game-covers/uncharted.jpg",},
      { 
        name: "Assassin's Creed",
        coverImage: "/game-covers/assassins-creed.jpg",
      },
      { 
        name: "Sniper Elite",
        coverImage: "/game-covers/sniper-elite.jpg",
      },
      { 
        name: "The Last of Us",
        coverImage: "/game-covers/the-last-of-us.jpg",
      },
      { 
        name: "The Witcher",
        coverImage: "/game-covers/the-witcher.jpg",},
      { 
        name: "The Last of Us Part II",
        coverImage: "/game-covers/the-last-of-us-part-2.jpg",},
      { 
        name: "Watch Dogs" ,
        coverImage: "/game-covers/watch-dogs.jpg",
      },
      {
         name: "Resident Evil",
         coverImage: "/game-covers/resident-evil.jpg",},
      { 
        name: "Resident Evil 4",
        coverImage: "/game-covers/resident-evil-4.jpg",
      },
      {
         name: "Resident Evil 5",
         coverImage: "/game-covers/resident-evil-5.jpg",
        },
      { 
        name: "Far Cry 6" ,
        coverImage: "/game-covers/far-cry-6.jpg",
      },

      { 
        name: "Call of Duty - Black Ops",
        coverImage: "/game-covers/call-of-duty-black-ops.jpg",},
      {
         name: "Call of Duty - Modern Warfare" ,
         coverImage: "/game-covers/call-of-duty-modern-warfare.jpg",},
      {
         name: "Battle Field",
         coverImage: "/game-covers/battlefield.jpg",},
      {
         name: "Naruto" },
    ],
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
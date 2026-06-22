-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "coverImage" TEXT,
    "platform" TEXT NOT NULL DEFAULT 'PS4',
    "isInstalled" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Game" ("createdAt", "id", "isActive", "name") SELECT "createdAt", "id", "isActive", "name" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
CREATE UNIQUE INDEX "Game_name_key" ON "Game"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

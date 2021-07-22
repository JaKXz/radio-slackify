/*
  Warnings:

  - You are about to drop the column `appleMusicURI` on the `Track` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Track" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "spotifyURI" TEXT,
    "stationId" INTEGER NOT NULL,
    "startAt" DATETIME NOT NULL,
    FOREIGN KEY ("stationId") REFERENCES "Station" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Track" ("id", "spotifyURI", "startAt", "stationId") SELECT "id", "spotifyURI", "startAt", "stationId" FROM "Track";
DROP TABLE "Track";
ALTER TABLE "new_Track" RENAME TO "Track";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

/*
  Warnings:

  - Added the required column `startAt` to the `Track` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Track" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "spotifyURI" TEXT,
    "appleMusicURI" TEXT,
    "stationId" INTEGER NOT NULL,
    "startAt" DATETIME NOT NULL,
    FOREIGN KEY ("stationId") REFERENCES "Station" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Track" ("appleMusicURI", "id", "spotifyURI", "stationId") SELECT "appleMusicURI", "id", "spotifyURI", "stationId" FROM "Track";
DROP TABLE "Track";
ALTER TABLE "new_Track" RENAME TO "Track";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

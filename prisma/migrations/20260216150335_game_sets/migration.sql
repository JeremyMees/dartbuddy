/*
  Warnings:

  - You are about to drop the column `legsWon` on the `GamePlayer` table. All the data in the column will be lost.
  - You are about to drop the column `gameId` on the `Leg` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[setId,number]` on the table `Leg` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `setId` to the `Leg` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Leg" DROP CONSTRAINT "Leg_gameId_fkey";

-- DropIndex
DROP INDEX "Leg_gameId_idx";

-- DropIndex
DROP INDEX "Leg_gameId_number_key";

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "setsToWin" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "GamePlayer" DROP COLUMN "legsWon",
ADD COLUMN     "setsWon" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Leg" DROP COLUMN "gameId",
ADD COLUMN     "setId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Set" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "winnerId" TEXT,

    CONSTRAINT "Set_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Set_gameId_idx" ON "Set"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "Set_gameId_number_key" ON "Set"("gameId", "number");

-- CreateIndex
CREATE INDEX "Leg_setId_idx" ON "Leg"("setId");

-- CreateIndex
CREATE UNIQUE INDEX "Leg_setId_number_key" ON "Leg"("setId", "number");

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leg" ADD CONSTRAINT "Leg_setId_fkey" FOREIGN KEY ("setId") REFERENCES "Set"("id") ON DELETE CASCADE ON UPDATE CASCADE;

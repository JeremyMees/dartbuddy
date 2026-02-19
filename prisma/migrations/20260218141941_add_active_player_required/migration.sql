/*
  Warnings:

  - Made the column `activePlayerId` on table `Game` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_activePlayerId_fkey";

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "activePlayerId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_activePlayerId_fkey" FOREIGN KEY ("activePlayerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `winner` on the `MatchGame` table. All the data in the column will be lost.
  - Added the required column `opponent` to the `MatchGame` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MatchGame" DROP COLUMN "winner",
ADD COLUMN     "opponent" TEXT NOT NULL;

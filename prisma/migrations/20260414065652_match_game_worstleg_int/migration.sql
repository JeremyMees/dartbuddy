/*
  Warnings:

  - You are about to alter the column `worstLeg` on the `MatchGame` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "MatchGame" ALTER COLUMN "worstLeg" SET DATA TYPE INTEGER;

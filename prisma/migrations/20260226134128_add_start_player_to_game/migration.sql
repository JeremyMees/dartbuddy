-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_activePlayerId_fkey";

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "startPlayerId" TEXT,
ALTER COLUMN "activePlayerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_activePlayerId_fkey" FOREIGN KEY ("activePlayerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_startPlayerId_fkey" FOREIGN KEY ("startPlayerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

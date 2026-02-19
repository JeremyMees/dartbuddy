-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "activePlayerId" TEXT;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_activePlayerId_fkey" FOREIGN KEY ("activePlayerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

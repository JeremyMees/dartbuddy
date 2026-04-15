-- CreateTable
CREATE TABLE "MatchGame" (
    "id" TEXT NOT NULL,
    "hasWon" BOOLEAN NOT NULL,
    "winner" TEXT NOT NULL,
    "threeDartAverage" DOUBLE PRECISION NOT NULL,
    "firstNineDartAverage" DOUBLE PRECISION NOT NULL,
    "checkoutThrown" INTEGER NOT NULL,
    "checkoutHits" INTEGER NOT NULL,
    "highestFinish" INTEGER NOT NULL,
    "highestScore" INTEGER NOT NULL,
    "bestLeg" INTEGER NOT NULL,
    "worstLeg" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MatchGame_pkey" PRIMARY KEY ("id")
);

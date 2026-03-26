-- CreateTable
CREATE TABLE "AroundTheClockGame" (
    "id" TEXT NOT NULL,
    "hitPercent" DOUBLE PRECISION NOT NULL,
    "dartsThrown" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AroundTheClockGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SinglesTrainingGame" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SinglesTrainingGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoublesTrainingGame" (
    "id" TEXT NOT NULL,
    "hitPercent" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoublesTrainingGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoreTrainingGame" (
    "id" TEXT NOT NULL,
    "totalScore" INTEGER NOT NULL,
    "highestScore" INTEGER NOT NULL,
    "oneEightyCount" INTEGER NOT NULL,
    "threeDartAverage" DOUBLE PRECISION NOT NULL,
    "oneDartAverage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScoreTrainingGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stats" (
    "id" SERIAL NOT NULL,
    "marketerId" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "caseType" TEXT NOT NULL,

    CONSTRAINT "Stats_pkey" PRIMARY KEY ("id")
);

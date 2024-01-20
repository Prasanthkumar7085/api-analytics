/*
  Warnings:

  - You are about to drop the `Stats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Stats";

-- CreateTable
CREATE TABLE "marketer_stats" (
    "id" SERIAL NOT NULL,
    "marketer_id" TEXT NOT NULL,
    "hospital_id" TEXT NOT NULL,
    "total_cases" INTEGER NOT NULL,
    "pending_cases" INTEGER NOT NULL DEFAULT 0,
    "completed_cases" INTEGER NOT NULL DEFAULT 0,
    "hospitals_count" INTEGER NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marketer_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseTypeWiseCounts" (
    "id" SERIAL NOT NULL,
    "case_type" TEXT NOT NULL,
    "pending" INTEGER NOT NULL,
    "completed" INTEGER NOT NULL,
    "statsId" INTEGER NOT NULL,

    CONSTRAINT "CaseTypeWiseCounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HospitalWiseCounts" (
    "id" SERIAL NOT NULL,
    "hospital_id" TEXT NOT NULL,
    "case_type" TEXT NOT NULL,
    "pending" INTEGER NOT NULL,
    "completed" INTEGER NOT NULL,
    "statsId" INTEGER NOT NULL,

    CONSTRAINT "HospitalWiseCounts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CaseTypeWiseCounts" ADD CONSTRAINT "CaseTypeWiseCounts_statsId_fkey" FOREIGN KEY ("statsId") REFERENCES "marketer_stats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HospitalWiseCounts" ADD CONSTRAINT "HospitalWiseCounts_statsId_fkey" FOREIGN KEY ("statsId") REFERENCES "marketer_stats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

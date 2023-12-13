/*
  Warnings:

  - You are about to drop the column `statsId` on the `CaseTypeWiseCounts` table. All the data in the column will be lost.
  - You are about to drop the column `statsId` on the `HospitalWiseCounts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CaseTypeWiseCounts" DROP CONSTRAINT "CaseTypeWiseCounts_statsId_fkey";

-- DropForeignKey
ALTER TABLE "HospitalWiseCounts" DROP CONSTRAINT "HospitalWiseCounts_statsId_fkey";

-- AlterTable
ALTER TABLE "CaseTypeWiseCounts" DROP COLUMN "statsId";

-- AlterTable
ALTER TABLE "HospitalWiseCounts" DROP COLUMN "statsId";

-- AlterTable
ALTER TABLE "marketer_stats" ADD COLUMN     "case_type_wise_counts" JSONB[],
ADD COLUMN     "hospital_case_type_wise_counts" JSONB[];

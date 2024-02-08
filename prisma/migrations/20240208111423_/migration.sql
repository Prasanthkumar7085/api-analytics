/*
  Warnings:

  - You are about to drop the column `hospital_marketer_wise_count` on the `revenue_stats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "revenue_stats" DROP COLUMN "hospital_marketer_wise_count",
ADD COLUMN     "hospital_wise_count" JSONB[];

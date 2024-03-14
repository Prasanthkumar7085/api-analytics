/*
  Warnings:

  - You are about to drop the column `patient_info` on the `patient_payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "patient_payments" DROP COLUMN "patient_info",
ADD COLUMN     "is_generated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "patient_first_name" TEXT,
ADD COLUMN     "patient_last_name" TEXT,
ADD COLUMN     "patient_middle_name" TEXT;

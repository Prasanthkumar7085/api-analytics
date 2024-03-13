/*
  Warnings:

  - You are about to drop the column `patient_id` on the `patient_payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "patient_payments" DROP COLUMN "patient_id",
ADD COLUMN     "patient_info" JSONB;

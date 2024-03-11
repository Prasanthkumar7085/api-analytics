/*
  Warnings:

  - You are about to drop the column `patient_billing_info` on the `patient_payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "patient_payments" DROP COLUMN "patient_billing_info";

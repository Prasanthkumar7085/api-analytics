/*
  Warnings:

  - The `hospital_marketers` column on the `revenue_marketers_schema` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `cpt_codes` column on the `revenue_marketers_schema` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `line_item_total` column on the `revenue_marketers_schema` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `insurance_payment_amount` column on the `revenue_marketers_schema` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `insurance_adjustment_amount` column on the `revenue_marketers_schema` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `insurance_write_of_amount` column on the `revenue_marketers_schema` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `patient_payment_amount` column on the `revenue_marketers_schema` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `patient_adjustment_amount` column on the `revenue_marketers_schema` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `patient_write_of_amount` column on the `revenue_marketers_schema` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `line_item_balance` column on the `revenue_marketers_schema` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "revenue_marketers_schema" DROP COLUMN "hospital_marketers",
ADD COLUMN     "hospital_marketers" JSONB[],
DROP COLUMN "cpt_codes",
ADD COLUMN     "cpt_codes" JSONB[],
DROP COLUMN "line_item_total",
ADD COLUMN     "line_item_total" JSONB[],
DROP COLUMN "insurance_payment_amount",
ADD COLUMN     "insurance_payment_amount" JSONB[],
DROP COLUMN "insurance_adjustment_amount",
ADD COLUMN     "insurance_adjustment_amount" JSONB[],
DROP COLUMN "insurance_write_of_amount",
ADD COLUMN     "insurance_write_of_amount" JSONB[],
DROP COLUMN "patient_payment_amount",
ADD COLUMN     "patient_payment_amount" JSONB[],
DROP COLUMN "patient_adjustment_amount",
ADD COLUMN     "patient_adjustment_amount" JSONB[],
DROP COLUMN "patient_write_of_amount",
ADD COLUMN     "patient_write_of_amount" JSONB[],
DROP COLUMN "line_item_balance",
ADD COLUMN     "line_item_balance" JSONB[];

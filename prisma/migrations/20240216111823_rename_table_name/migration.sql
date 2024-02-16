/*
  Warnings:

  - You are about to drop the `revenue_marketers_schema` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "revenue_marketers_schema";

-- CreateTable
CREATE TABLE "patient_payments" (
    "id" SERIAL NOT NULL,
    "case_id" TEXT NOT NULL,
    "hospital" TEXT NOT NULL,
    "accession_id" TEXT NOT NULL,
    "case_types" TEXT[],
    "hospital_marketers" JSONB[],
    "date_of_service" TIMESTAMP(3),
    "insurance_name" TEXT NOT NULL,
    "payment_status" TEXT NOT NULL,
    "cpt_codes" JSONB[],
    "line_item_total" JSONB[],
    "insurance_payment_amount" JSONB[],
    "insurance_adjustment_amount" JSONB[],
    "insurance_write_of_amount" JSONB[],
    "patient_payment_amount" JSONB[],
    "patient_adjustment_amount" JSONB[],
    "patient_write_of_amount" JSONB[],
    "line_item_balance" JSONB[],
    "total_amount" INTEGER NOT NULL,
    "paid_amount" INTEGER NOT NULL,
    "pending_amount" INTEGER NOT NULL,
    "process_status" TEXT NOT NULL,
    "values_changed" BOOLEAN NOT NULL DEFAULT false,
    "difference_values" JSONB,
    "patient_id" TEXT NOT NULL,

    CONSTRAINT "patient_payments_pkey" PRIMARY KEY ("id")
);

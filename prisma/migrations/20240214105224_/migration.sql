-- CreateTable
CREATE TABLE "marketer_stats" (
    "id" SERIAL NOT NULL,
    "marketer_id" TEXT NOT NULL,
    "total_cases" INTEGER NOT NULL,
    "pending_cases" INTEGER NOT NULL DEFAULT 0,
    "completed_cases" INTEGER NOT NULL DEFAULT 0,
    "hospitals_count" INTEGER NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "case_type_wise_counts" JSONB[],
    "hospital_case_type_wise_counts" JSONB[],
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marketer_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revenue_marketers_schema" (
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

    CONSTRAINT "revenue_marketers_schema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revenue_stats" (
    "id" SERIAL NOT NULL,
    "marketer_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "total_amount" INTEGER NOT NULL,
    "paid_amount" INTEGER NOT NULL,
    "pending_amount" INTEGER NOT NULL,
    "case_type_wise_counts" JSONB[],
    "hospital_wise_counts" JSONB[],
    "hospitals" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "revenue_stats_pkey" PRIMARY KEY ("id")
);

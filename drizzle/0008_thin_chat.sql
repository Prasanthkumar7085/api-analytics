ALTER TABLE "sales_reps" ALTER COLUMN "reporting_to" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "sales_reps" ALTER COLUMN "reporting_to" SET NOT NULL;
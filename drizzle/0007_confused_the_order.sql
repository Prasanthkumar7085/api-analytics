ALTER TABLE "facilities" ALTER COLUMN "ref_id" SET DEFAULT null;--> statement-breakpoint
ALTER TABLE "insurance_payors" ALTER COLUMN "ref_id" SET DEFAULT null;--> statement-breakpoint
ALTER TABLE "labs" ALTER COLUMN "ref_id" SET DEFAULT null;--> statement-breakpoint
ALTER TABLE "sales_reps" ALTER COLUMN "ref_id" SET DEFAULT null;--> statement-breakpoint
ALTER TABLE "sales_reps" ALTER COLUMN "mgh_ref_id" SET DEFAULT null;--> statement-breakpoint
ALTER TABLE "sales_reps" ALTER COLUMN "reporting_to" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "sales_reps" ALTER COLUMN "reporting_to" DROP NOT NULL;
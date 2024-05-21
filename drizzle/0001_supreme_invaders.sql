DROP INDEX IF EXISTS "case_types_status_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "facilities_status_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "insurance_status_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "lab_status_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "sales_rep_status_idx";--> statement-breakpoint
ALTER TABLE "case_types" DROP COLUMN IF EXISTS "status";--> statement-breakpoint
ALTER TABLE "facilities" DROP COLUMN IF EXISTS "status";--> statement-breakpoint
ALTER TABLE "insurance_payors" DROP COLUMN IF EXISTS "status";--> statement-breakpoint
ALTER TABLE "labs" DROP COLUMN IF EXISTS "status";--> statement-breakpoint
ALTER TABLE "sales_reps" DROP COLUMN IF EXISTS "status";
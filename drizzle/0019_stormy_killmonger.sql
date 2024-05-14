ALTER TABLE "case_types" ADD COLUMN "status" "status" DEFAULT 'ACTIVE';--> statement-breakpoint
ALTER TABLE "case_types" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "case_types" ADD COLUMN "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "insurance_payors" ADD COLUMN "status" "status" DEFAULT 'ACTIVE';--> statement-breakpoint
ALTER TABLE "labs" ADD COLUMN "status" "status" DEFAULT 'ACTIVE';--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "case_types_name_idx" ON "case_types" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "case_types_status_idx" ON "case_types" ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "insurance_status_idx" ON "insurance_payors" ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "lab_status_idx" ON "labs" ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sales_rep_status_idx" ON "sales_reps" ("status");
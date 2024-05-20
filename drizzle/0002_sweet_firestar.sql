ALTER TABLE "sales_reps" ADD COLUMN "status" "status" DEFAULT 'ACTIVE';--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sales_rep_status_idx" ON "sales_reps" ("status");
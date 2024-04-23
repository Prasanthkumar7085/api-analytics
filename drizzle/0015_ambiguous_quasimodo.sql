CREATE TABLE IF NOT EXISTS "sales_reps_monthly_achieves" (
	"id" serial PRIMARY KEY NOT NULL,
	"sales_rep_id" integer NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"month" varchar NOT NULL,
	"covid_a" integer DEFAULT 0,
	"covid_flu_a" integer DEFAULT 0,
	"clinical_a" integer DEFAULT 0,
	"gastro_a" integer DEFAULT 0,
	"nail_a" integer DEFAULT 0,
	"pgx_a" integer DEFAULT 0,
	"rpp_a" integer DEFAULT 0,
	"tox_a" integer DEFAULT 0,
	"ua_a" integer DEFAULT 0,
	"uti_a" integer DEFAULT 0,
	"wound_a" integer DEFAULT 0,
	"card_a" integer DEFAULT 0,
	"cgx_a" integer DEFAULT 0,
	"diabetes_a" integer DEFAULT 0,
	"pad_a" integer DEFAULT 0,
	"pul_a" integer DEFAULT 0,
	"total_a" integer DEFAULT 0,
	"new_facilities_a" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sales_reps_monthly_targets" (
	"id" serial PRIMARY KEY NOT NULL,
	"sales_rep_id" integer NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"month" varchar NOT NULL,
	"covid" integer DEFAULT 0,
	"covid_flu" integer DEFAULT 0,
	"clinical" integer DEFAULT 0,
	"gastro" integer DEFAULT 0,
	"nail" integer DEFAULT 0,
	"pgx" integer DEFAULT 0,
	"rpp" integer DEFAULT 0,
	"tox" integer DEFAULT 0,
	"ua" integer DEFAULT 0,
	"uti" integer DEFAULT 0,
	"wound" integer DEFAULT 0,
	"card" integer DEFAULT 0,
	"cgx" integer DEFAULT 0,
	"diabetes" integer DEFAULT 0,
	"pad" integer DEFAULT 0,
	"pul" integer DEFAULT 0,
	"total" integer DEFAULT 0,
	"new_facilities" integer DEFAULT 0
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sales_reps_monthly_achieves_sales_rep_id" ON "sales_reps_monthly_achieves" ("sales_rep_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sales_reps_monthly_achieves_month_idx" ON "sales_reps_monthly_achieves" ("month");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sales_reps_monthly_achieves_start_date_idx" ON "sales_reps_monthly_achieves" ("start_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sales_reps_monthly_achieves_end_date_idx" ON "sales_reps_monthly_achieves" ("end_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sales_reps_monthly_achieves_total_idx" ON "sales_reps_monthly_achieves" ("total_a");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sales_reps_monthly_targets_sales_rep_id" ON "sales_reps_monthly_targets" ("sales_rep_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sales_reps_monthly_targets_month_idx" ON "sales_reps_monthly_targets" ("month");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sales_reps_monthly_targets_start_date_idx" ON "sales_reps_monthly_targets" ("start_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sales_reps_monthly_targets_end_date_idx" ON "sales_reps_monthly_targets" ("end_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sales_reps_monthly_targets_total_idx" ON "sales_reps_monthly_targets" ("total");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_reps_monthly_achieves" ADD CONSTRAINT "sales_reps_monthly_achieves_sales_rep_id_sales_reps_id_fk" FOREIGN KEY ("sales_rep_id") REFERENCES "sales_reps"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_reps_monthly_targets" ADD CONSTRAINT "sales_reps_monthly_targets_sales_rep_id_sales_reps_id_fk" FOREIGN KEY ("sales_rep_id") REFERENCES "sales_reps"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

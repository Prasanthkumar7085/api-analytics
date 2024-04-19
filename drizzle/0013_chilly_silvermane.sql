CREATE TABLE IF NOT EXISTS "sales_reps_targets" (
	"id" serial PRIMARY KEY NOT NULL,
	"sales_rep_id" integer NOT NULL,
	"year" integer NOT NULL,
	"jan" jsonb DEFAULT '[0,0,0,0]'::jsonb,
	"feb" jsonb DEFAULT '[0,0,0,0]'::jsonb,
	"mar" jsonb DEFAULT '[0,0,0,0]'::jsonb,
	"april" jsonb DEFAULT '[0,0,0,0]'::jsonb,
	"may" jsonb DEFAULT '[0,0,0,0]'::jsonb,
	"june" jsonb DEFAULT '[0,0,0,0]'::jsonb,
	"july" jsonb DEFAULT '[0,0,0,0]'::jsonb,
	"aug" jsonb DEFAULT '[0,0,0,0]'::jsonb,
	"sep" jsonb DEFAULT '[0,0,0,0]'::jsonb,
	"oct" jsonb DEFAULT '[0,0,0,0]'::jsonb,
	"nov" jsonb DEFAULT '[0,0,0,0]'::jsonb,
	"dec" jsonb DEFAULT '[0,0,0,0]'::jsonb
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sales_reps_targets_sales_rep_id" ON "sales_reps_targets" ("sales_rep_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sales_reps_targets_year_idx" ON "sales_reps_targets" ("year");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_reps_targets" ADD CONSTRAINT "sales_reps_targets_sales_rep_id_sales_reps_id_fk" FOREIGN KEY ("sales_rep_id") REFERENCES "sales_reps"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

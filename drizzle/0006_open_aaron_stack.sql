CREATE TABLE IF NOT EXISTS "labs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"code" text,
	"ref_id" varchar
);
--> statement-breakpoint
ALTER TABLE "facilities" ADD COLUMN "mgh_ref_id" text DEFAULT null;--> statement-breakpoint
ALTER TABLE "insurance_payors" ADD COLUMN "mgh_ref_id" text DEFAULT null;--> statement-breakpoint
ALTER TABLE "patient_claims" ADD COLUMN "lab_id" integer;--> statement-breakpoint
ALTER TABLE "sales_reps" ADD COLUMN "mgh_ref_id" text;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "lab_ref_id_idx" ON "labs" ("ref_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "facilties_mgh_ref_id_idx" ON "facilities" ("mgh_ref_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "facilties_ref_id_idx" ON "facilities" ("ref_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "insurance_mgh_ref_id_idx" ON "insurance_payors" ("mgh_ref_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "insurance_ref_id_idx" ON "insurance_payors" ("ref_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "lab_id_idx" ON "patient_claims" ("lab_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sales_rep_mgh_ref_id_idx" ON "sales_reps" ("mgh_ref_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sales_rep_ref_id_idx" ON "sales_reps" ("ref_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_claims" ADD CONSTRAINT "patient_claims_lab_id_labs_id_fk" FOREIGN KEY ("lab_id") REFERENCES "labs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

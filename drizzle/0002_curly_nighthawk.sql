ALTER TABLE "facilities" ADD COLUMN "sales_rep_id" integer;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "accession_id_idx" ON "patient_claims" ("accession_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "case_type_id_idx" ON "patient_claims" ("case_type_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "physician_id_idx" ON "patient_claims" ("physician_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "facility_id_idx" ON "patient_claims" ("facility_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sales_rep_id_idx" ON "patient_claims" ("sales_rep_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "insurance_payer_id_idx" ON "patient_claims" ("insurance_payer_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_id_idx" ON "patient_claims" ("patient_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "facilities" ADD CONSTRAINT "facilities_sales_rep_id_sales_reps_id_fk" FOREIGN KEY ("sales_rep_id") REFERENCES "sales_reps"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

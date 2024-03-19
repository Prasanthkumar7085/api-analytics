CREATE TABLE IF NOT EXISTS "patient_claim_payment_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"accession_id" varchar(20),
	"cleared_amount" double precision DEFAULT 0,
	"payment_date" date,
	"patient_id" varchar(30),
	"patient_claim_id" integer
);
--> statement-breakpoint
ALTER TABLE "patient_claims" ADD COLUMN "billing_date" date;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_claim_accession_id_idx" ON "patient_claim_payment_history" ("accession_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_claim_patient_id_idx" ON "patient_claim_payment_history" ("patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_claim_patient_claim_id_idx" ON "patient_claim_payment_history" ("patient_claim_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_claim_payment_history" ADD CONSTRAINT "patient_claim_payment_history_patient_claim_id_patient_claims_id_fk" FOREIGN KEY ("patient_claim_id") REFERENCES "patient_claims"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

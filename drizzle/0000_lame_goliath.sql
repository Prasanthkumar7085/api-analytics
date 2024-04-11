CREATE TABLE IF NOT EXISTS "case_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"display_name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "facilities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"ref_id" text DEFAULT null,
	"mgh_ref_id" text DEFAULT null,
	"sales_rep_id" integer DEFAULT null
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "insurance_payors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"ref_id" text DEFAULT null,
	"mgh_ref_id" text DEFAULT null
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "labs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"code" text,
	"ref_id" varchar DEFAULT null
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patient_claim_payment_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"accession_id" varchar(20),
	"cleared_amount" double precision DEFAULT 0,
	"payment_date" date,
	"patient_id" varchar(30),
	"patient_claim_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patient_claims" (
	"id" serial PRIMARY KEY NOT NULL,
	"accession_id" varchar(20),
	"case_type_id" integer,
	"physician_id" varchar(30),
	"facility_id" integer,
	"sales_rep_id" integer,
	"insurance_payer_id" integer,
	"expected_amount" double precision DEFAULT 0,
	"billable_amount" double precision DEFAULT 0,
	"cleared_amount" double precision DEFAULT 0,
	"pending_amount" double precision DEFAULT 0,
	"service_date" date,
	"collection_date" date,
	"reports_finalized" boolean DEFAULT false,
	"is_bill_cleared" boolean DEFAULT false,
	"recent_payment_date" date,
	"insurnace_target_price" double precision DEFAULT 0,
	"patient_id" varchar(30),
	"is_partial_paid" boolean DEFAULT false,
	"billing_date" date,
	"lab_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sales_reps" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"ref_id" text DEFAULT null,
	"mgh_ref_id" text DEFAULT null,
	"reporting_to" serial NOT NULL,
	"role_id" integer,
	"email" varchar DEFAULT null
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_role" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "facilties_mgh_ref_id_idx" ON "facilities" ("mgh_ref_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "facilties_ref_id_idx" ON "facilities" ("ref_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "insurance_mgh_ref_id_idx" ON "insurance_payors" ("mgh_ref_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "insurance_ref_id_idx" ON "insurance_payors" ("ref_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "lab_ref_id_idx" ON "labs" ("ref_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_claim_accession_id_idx" ON "patient_claim_payment_history" ("accession_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_claim_patient_id_idx" ON "patient_claim_payment_history" ("patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_claim_patient_claim_id_idx" ON "patient_claim_payment_history" ("patient_claim_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "accession_id_idx" ON "patient_claims" ("accession_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "case_type_id_idx" ON "patient_claims" ("case_type_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "physician_id_idx" ON "patient_claims" ("physician_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "facility_id_idx" ON "patient_claims" ("facility_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sales_rep_id_idx" ON "patient_claims" ("sales_rep_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "insurance_payer_id_idx" ON "patient_claims" ("insurance_payer_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_id_idx" ON "patient_claims" ("patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "lab_id_idx" ON "patient_claims" ("lab_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sales_rep_mgh_ref_id_idx" ON "sales_reps" ("mgh_ref_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sales_rep_ref_id_idx" ON "sales_reps" ("ref_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "facilities" ADD CONSTRAINT "facilities_sales_rep_id_sales_reps_id_fk" FOREIGN KEY ("sales_rep_id") REFERENCES "sales_reps"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_claim_payment_history" ADD CONSTRAINT "patient_claim_payment_history_patient_claim_id_patient_claims_id_fk" FOREIGN KEY ("patient_claim_id") REFERENCES "patient_claims"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_claims" ADD CONSTRAINT "patient_claims_case_type_id_case_types_id_fk" FOREIGN KEY ("case_type_id") REFERENCES "case_types"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_claims" ADD CONSTRAINT "patient_claims_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_claims" ADD CONSTRAINT "patient_claims_sales_rep_id_sales_reps_id_fk" FOREIGN KEY ("sales_rep_id") REFERENCES "sales_reps"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_claims" ADD CONSTRAINT "patient_claims_insurance_payer_id_insurance_payors_id_fk" FOREIGN KEY ("insurance_payer_id") REFERENCES "insurance_payors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_claims" ADD CONSTRAINT "patient_claims_lab_id_labs_id_fk" FOREIGN KEY ("lab_id") REFERENCES "labs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_reps" ADD CONSTRAINT "sales_reps_role_id_user_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "user_role"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "case_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "facilities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"ref_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "insurance_payors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"ref_id" text
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
	"is_partial_paid" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sales_reps" (
	"id" serial NOT NULL,
	"name" text,
	"ref_id" text,
	"role_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_role" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text
);
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
 ALTER TABLE "sales_reps" ADD CONSTRAINT "sales_reps_role_id_user_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "user_role"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

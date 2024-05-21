ALTER TABLE "facilities" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "facilities" ADD COLUMN "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "insurance_payors" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "insurance_payors" ADD COLUMN "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "labs" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "labs" ADD COLUMN "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "patient_claims" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "patient_claims" ADD COLUMN "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "sales_reps" ADD COLUMN "status" "status" DEFAULT 'ACTIVE';--> statement-breakpoint
ALTER TABLE "sales_reps" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "sales_reps" ADD COLUMN "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "facilities_status_idx" ON "facilities" ("status");
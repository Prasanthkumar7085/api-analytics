ALTER TABLE "sales_reps" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "sales_reps" ADD COLUMN "reporting_to" serial NOT NULL;
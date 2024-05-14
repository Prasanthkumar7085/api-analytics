DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('ACTIVE', 'INACTIVE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "facilities" ADD COLUMN "status" "status" DEFAULT 'ACTIVE';
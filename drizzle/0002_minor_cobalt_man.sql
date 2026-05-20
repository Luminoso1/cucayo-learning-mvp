ALTER TABLE "enrollments" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "enrollments" ALTER COLUMN "status" SET DEFAULT 'no_init'::text;--> statement-breakpoint
DROP TYPE "public"."course_status";--> statement-breakpoint
CREATE TYPE "public"."course_status" AS ENUM('no_init', 'in_progress', 'completed');--> statement-breakpoint
ALTER TABLE "enrollments" ALTER COLUMN "status" SET DEFAULT 'no_init'::"public"."course_status";--> statement-breakpoint
ALTER TABLE "enrollments" ALTER COLUMN "status" SET DATA TYPE "public"."course_status" USING "status"::"public"."course_status";

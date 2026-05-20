CREATE TYPE "public"."course_status" AS ENUM('no_iniciado', 'en_progreso', 'completado');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('student', 'teacher', 'admin');--> statement-breakpoint
CREATE TABLE "student_details" (
	"profile_id" uuid PRIMARY KEY NOT NULL,
	"career_name" text NOT NULL,
	"semester" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teacher_details" (
	"profile_id" uuid PRIMARY KEY NOT NULL,
	"bio" text,
	"specialty" text
);
--> statement-breakpoint
ALTER TABLE "enrollments" ALTER COLUMN "student_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "enrollments" ALTER COLUMN "course_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "icon" text DEFAULT 'Book' NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "xp" integer DEFAULT 100 NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "theme" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "enrollments" ADD COLUMN "status" "course_status" DEFAULT 'no_iniciado' NOT NULL;--> statement-breakpoint
ALTER TABLE "enrollments" ADD COLUMN "remaining_minutes" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "enrollments" ADD COLUMN "last_accessed" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "student_details" ADD CONSTRAINT "student_details_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_details" ADD CONSTRAINT "teacher_details_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;

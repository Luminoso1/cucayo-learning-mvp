CREATE TYPE "public"."assessment_type" AS ENUM('lesson_quiz', 'unit_examn', 'course_examn');--> statement-breakpoint
CREATE TYPE "public"."question_type" AS ENUM('multiple_choise', 'ordering', 'text_input', 'cloze');--> statement-breakpoint
CREATE TABLE "assessment_attempt" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid,
	"assessment_id" uuid,
	"score" integer,
	"status" text,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "assessment_questions" (
	"assessment_id" uuid,
	"question_id" uuid,
	"order" integer NOT NULL,
	CONSTRAINT "assessment_questions_assessment_id_question_id_pk" PRIMARY KEY("assessment_id","question_id")
);
--> statement-breakpoint
CREATE TABLE "assessment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"type" "assessment_type" NOT NULL,
	"lesson_id" uuid,
	"unit_id" uuid,
	"course_id" uuid,
	"points" integer DEFAULT 100 NOT NULL,
	"passing_score" integer DEFAULT 70 NOT NULL,
	"time_limit" integer,
	"completedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid,
	"content" text NOT NULL,
	"is_correct" boolean DEFAULT false,
	"order" integer
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "question_type" NOT NULL,
	"statement" text NOT NULL,
	"metadata" jsonb,
	"points" integer DEFAULT 10,
	"feedback_correct" text,
	"feedback_error" text
);
--> statement-breakpoint
CREATE TABLE "user_response" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"attempt_id" uuid,
	"question_id" uuid,
	"answer" jsonb NOT NULL,
	"is_correct" boolean NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assessment_attempt" ADD CONSTRAINT "assessment_attempt_student_id_profiles_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_attempt" ADD CONSTRAINT "assessment_attempt_assessment_id_assessment_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_questions" ADD CONSTRAINT "assessment_questions_assessment_id_assessment_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_questions" ADD CONSTRAINT "assessment_questions_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment" ADD CONSTRAINT "assessment_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment" ADD CONSTRAINT "assessment_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment" ADD CONSTRAINT "assessment_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_options" ADD CONSTRAINT "question_options_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_response" ADD CONSTRAINT "user_response_attempt_id_assessment_attempt_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."assessment_attempt"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_response" ADD CONSTRAINT "user_response_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;
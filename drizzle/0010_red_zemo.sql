CREATE TYPE "public"."lesson_block_type" AS ENUM('content', 'question');--> statement-breakpoint
CREATE TABLE "lesson_block" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" uuid NOT NULL,
	"type" "lesson_block_type" NOT NULL,
	"order" integer NOT NULL,
	"content" text,
	"question_id" uuid
);
--> statement-breakpoint
ALTER TABLE "lesson_block" ADD CONSTRAINT "lesson_block_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_block" ADD CONSTRAINT "lesson_block_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE set null ON UPDATE no action;
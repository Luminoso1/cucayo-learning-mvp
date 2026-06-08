import {
  pgTable,
  primaryKey,
  uuid,
  pgEnum,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { nanoid } from 'nanoid'

export const roleEnum = pgEnum('role', ['student', 'teacher', 'admin'])

// assessment types
export const assessmentTypeEnum = pgEnum('assessment_type', [
  'lesson_quiz',
  'unit_examn',
  'course_examn',
])

// question types
export const questionTypeEnum = pgEnum('question_type', [
  'multiple_choise',
  'ordering',
  'text_input',
  'cloze',
  'multiple_cloze',
])

// course status
export const courseStatusEnum = pgEnum('course_status', [
  'no_init',
  'in_progress',
  'completed',
])

// lesson sections type (content - assessment)
export const lessonBlockEnum = pgEnum('lesson_block_type', [
  'content',
  'question',
])

const slugGen = () =>
  text('slug')
    .$defaultFn(() => nanoid(12))
    .unique()
    .notNull()

// profiles (admin, teacher, student)
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  dni: text('dni').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  role: roleEnum('role').default('student').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// student details
export const studentDetails = pgTable('student_details', {
  profileId: uuid('profile_id')
    .primaryKey()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  careerName: text('career_name').notNull(),
  semester: integer('semester').notNull(),
})

// teacher details
export const teacherDetails = pgTable('teacher_details', {
  profileId: uuid('profile_id')
    .primaryKey()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  bio: text('bio'),
  specialty: text('specialty'),
})

// courses
export const courses = pgTable('courses', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: slugGen(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  icon: text('icon').notNull().default('Book'),
  xp: integer('xp').default(100).notNull(),

  theme: jsonb('theme')
    .$type<{
      borderColor: string
      accentColor: string
      badgeBg: string
      badgeText: string
    }>()
    .notNull(),

  hours: integer('hours').notNull(),
  teacherId: uuid('teacher_id').references(() => profiles.id), // Teacher
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// enrollments
export const enrollments = pgTable(
  'enrollments',
  {
    studentId: uuid('student_id')
      .notNull()
      .references(() => profiles.id),
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id),
    enrolledAt: timestamp('enrolled_at').defaultNow().notNull(),

    status: courseStatusEnum('status').default('no_init').notNull(),
    progress: integer('progress').default(0).notNull(), // 0 - 100
    remainingMinutes: integer('remaining_minutes').notNull(),
    lastAccessed: timestamp('last_accessed').defaultNow(),
  },
  (table) => [
    primaryKey({
      columns: [table.studentId, table.courseId],
    }),
  ],
)

// units
export const units = pgTable('units', {
  id: uuid('id').defaultRandom().primaryKey(),
  courseId: uuid('course_id').references(() => courses.id, {
    onDelete: 'cascade',
  }),
  title: text('title').notNull(),
  order: integer('order').notNull(),
})

// lessons (micro-learning)
export const lessons = pgTable('lessons', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: slugGen(),
  unitId: uuid('unit_id').references(() => units.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  duration: integer('duration').default(15),
  order: integer('order').notNull(),

  // AI key concepts
  keyConcepts: text('key_concepts').array(),
})

export type LessonInsert = typeof lessons.$inferInsert
export type BlockInsert = typeof lessonBlocks.$inferInsert
export type QuestionInsert = typeof questions.$inferInsert
export type OptionInsert = typeof questionOptions.$inferInsert

export const lessonBlocks = pgTable('lesson_block', {
  id: uuid('id').defaultRandom().primaryKey(),
  lessonId: uuid('lesson_id')
    .notNull()
    .references(() => lessons.id, { onDelete: 'cascade' }),

  type: lessonBlockEnum('type').notNull(),
  order: integer('order').notNull(),

  content: text('content'),

  questionId: uuid('question_id').references(() => questions.id, {
    onDelete: 'set null',
  }),
})

// completed lessons
export const lessonCompletions = pgTable(
  'lesson_completions',
  {
    studentId: uuid('student_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    lessonId: uuid('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    completedAt: timestamp('completedAt').defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.studentId, table.lessonId] })],
)

// assessments
export const assessments = pgTable('assessment', {
  id: uuid().defaultRandom().primaryKey(),

  courseId: uuid('course_id')
    .notNull()
    .references(() => courses.id, {
      onDelete: 'cascade',
    }),

  title: text('title').notNull(),

  points: integer('points').default(100).notNull(),
  passingScore: integer('passing_score').default(70).notNull(), // 70% min to pass
  timeLimit: integer('time_limit').default(60).notNull(), // minutes

  createdAt: timestamp('completedAt').defaultNow().notNull(),
})

// questions
export const questions = pgTable('questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: questionTypeEnum('type').notNull(),
  statement: text('statement').notNull(), // markdown

  // 'ordering' o 'cloze', we save solution or config
  // e.g: { "correct_order": [2, 0, 1], "tolerance": "exact" }
  metadata: jsonb('metadata'),

  points: integer('points').default(10),
  feedbackCorrect: text('feedback_correct'),
  feedbackError: text('feedback_error'),
})

export const questionOptions = pgTable('question_options', {
  id: uuid('id').defaultRandom().primaryKey(),
  questionId: uuid('question_id').references(() => questions.id, {
    onDelete: 'cascade',
  }),
  content: text('content').notNull(),
  isCorrect: boolean('is_correct').default(false),
  order: integer('order'),
})

export const assessmentQuestions = pgTable(
  'assessment_questions',
  {
    assessmentId: uuid('assessment_id')
      .notNull()
      .references(() => assessments.id),
    questionId: uuid('question_id')
      .notNull()
      .references(() => questions.id),
    order: integer('order').notNull(),

    points: integer('points').default(5).notNull(),
  },
  (table) => [primaryKey({ columns: [table.assessmentId, table.questionId] })],
)

// attempts by student
export const assessmentAttempt = pgTable('assessment_attempt', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id').references(() => profiles.id),
  assessmentId: uuid('assessment_id').references(() => assessments.id),
  score: integer('score'),
  status: text('status'), // 'start', 'started', 'completed'
  startedAt: timestamp('started_at').defaultNow(),
  completedAt: timestamp('completed_at'),
})

// student responses
export const userResponse = pgTable('user_response', {
  id: uuid('id').defaultRandom().primaryKey(),
  attemptId: uuid('attempt_id').references(() => assessmentAttempt.id),
  questionId: uuid('question_id').references(() => questions.id),

  // e.g: { "selected_id": "..." } o { "user_order": [1, 0, 2] }
  answer: jsonb('answer').notNull(),
  isCorrect: boolean('is_correct').notNull(),
})

// relations
export const coursesRelations = relations(courses, ({ many }) => ({
  units: many(units),
  enrollments: many(enrollments),
}))

export const unitsRelations = relations(units, ({ one, many }) => ({
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}))

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id],
  }),
  blocks: many(lessonBlocks),
  completions: many(lessonCompletions),
  assessments: many(assessments),
}))

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
  student: one(profiles, {
    fields: [enrollments.studentId],
    references: [profiles.id],
  }),
}))

export const leessonBlockRelations = relations(lessonBlocks, ({ one }) => ({
  lesson: one(lessons, {
    fields: [lessonBlocks.lessonId],
    references: [lessons.id],
  }),
  question: one(questions, {
    fields: [lessonBlocks.questionId],
    references: [questions.id],
  }),
}))

export const lessonCompletionsRelations = relations(
  lessonCompletions,
  ({ one }) => ({
    lesson: one(lessons, {
      fields: [lessonCompletions.lessonId],
      references: [lessons.id],
    }),
    student: one(profiles, {
      fields: [lessonCompletions.studentId],
      references: [profiles.id],
    }),
  }),
)

// assessment relations
export const assessmentRelations = relations(assessments, ({ one, many }) => ({
  course: one(courses, {
    fields: [assessments.courseId],
    references: [courses.id],
  }),

  assessmentQuestions: many(assessmentQuestions),
  attempts: many(assessmentAttempt),
}))

// questions relations
export const questionsRelations = relations(questions, ({ many }) => ({
  options: many(questionOptions),
  assessmentQuestions: many(assessmentQuestions),
}))

// questionOptions relations
export const questionOptionsRelations = relations(
  questionOptions,
  ({ one }) => ({
    question: one(questions, {
      fields: [questionOptions.questionId],
      references: [questions.id],
    }),
  }),
)

// assessmentQuestions relations (La tabla intermedia)
export const assessmentQuestionsRelations = relations(
  assessmentQuestions,
  ({ one }) => ({
    assessment: one(assessments, {
      fields: [assessmentQuestions.assessmentId],
      references: [assessments.id],
    }),
    question: one(questions, {
      fields: [assessmentQuestions.questionId],
      references: [questions.id],
    }),
  }),
)

// assessmentAttempt relations
export const assessmentAttemptRelations = relations(
  assessmentAttempt,
  ({ one, many }) => ({
    assessment: one(assessments, {
      fields: [assessmentAttempt.assessmentId],
      references: [assessments.id],
    }),
    student: one(profiles, {
      fields: [assessmentAttempt.studentId],
      references: [profiles.id],
    }),
    responses: many(userResponse),
  }),
)

// userResponse relations
export const userResponseRelations = relations(userResponse, ({ one }) => ({
  attempt: one(assessmentAttempt, {
    fields: [userResponse.attemptId],
    references: [assessmentAttempt.id],
  }),
  question: one(questions, {
    fields: [userResponse.questionId],
    references: [questions.id],
  }),
}))

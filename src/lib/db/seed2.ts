import 'dotenv/config'
import { db } from './index'
import {
  profiles,
  courses,
  enrollments,
  units,
  lessons,
  questions,
  questionOptions,
  lessonBlocks,
} from './schema'
import { eq, and } from 'drizzle-orm'
import { nanoid } from 'nanoid'

import type {
  LessonInsert,
  BlockInsert,
  QuestionInsert,
  OptionInsert,
} from '#/lib/db/schema'

// Forzar el tipado estricto alineado a los Enums de tu base de datos
interface Question extends Omit<QuestionInsert, 'type'> {
  type:
    | 'multiple_choise'
    | 'ordering'
    | 'text_input'
    | 'cloze'
    | 'multiple_cloze'
  options: OptionInsert[]
}

interface Block extends BlockInsert {
  question: Question | null
}

interface Lesson extends Omit<LessonInsert, 'unitId'> {
  unitId: string
  blocks: Block[]
}

async function seed() {
  console.log('⏳ Iniciando preparación de infraestructura base...')

  // 0. Validar existencia del estudiante objetivo
  const student = await db.query.profiles.findFirst({
    where: eq(profiles.role, 'student'),
  })

  if (!student) {
    console.error(
      '❌ Error Crítico: No se encontró un perfil con rol "student" en la base de datos.',
    )
    return
  }

  // ID Estático e inmutable para el curso de Computación Forense
  const forenseId = '7eec9a52-8d4e-8b2a-1c81-21aa7e6b9031'

  const rawCourses = [
    {
      id: forenseId,
      slug: nanoid(12),
      nombre: 'Computación Forense',
      descripcion:
        'Investigación de incidentes informáticos bajo estándares de la industria y principios de criminalística digital.',
      icon: 'Fingerprint',
      tema: {
        borderColor: 'border-slate-700',
        accentColor: 'bg-slate-700',
        badgeBg: 'bg-slate-700/10',
        badgeText: 'text-slate-700',
      },
      duracionTotalMin: 1440,
      xp: 500,
    },
    {
      id: '1c92ab44-33de-4fa2-bbb1-55b7f21ac002',
      slug: nanoid(12),
      nombre: 'Base de Datos I',
      descripcion: 'Modelado relacional, normalización y consultas SQL.',
      icon: 'Database',
      tema: {
        borderColor: 'border-red-500',
        accentColor: 'bg-red-500',
        badgeBg: 'bg-red-500/10',
        badgeText: 'text-red-500',
      },
      duracionTotalMin: 300,
      xp: 180,
    },
  ]

  // UUIDs fijos obligatorios para evitar que ".defaultRandom()" genere duplicados
  const unitOneId = 'a1111111-1111-4111-a111-111111111111'
  const unitTwoId = 'a2222222-2222-4222-a222-222222222222'
  const unitThreeId = 'a3333333-3333-4333-a333-333333333333'
  const unitFourId = 'a4444444-4444-4444-a444-444444444444'

  const computacionForenseUnits = [
    { id: unitOneId, title: 'Unidad 1: Marco Legal y Amenazas', order: 1 },
    {
      id: unitTwoId,
      title: 'Unidad 2: Evidencia Digital (Adquisición)',
      order: 2,
    },
    { id: unitThreeId, title: 'Unidad 3: Análisis Forense Profundo', order: 3 },
    { id: unitFourId, title: 'Unidad 4: Documentación y Resultados', order: 4 },
  ]

  // =========================================================================
  // DICCIONARIO DE CONTENIDO INCREMENTAL (Edita aquí las lecciones una por una)
  // =========================================================================
  const contentDictionary: Record<string, Lesson[]> = {
    [unitFourId]: [],
  }

  // =========================================================================
  // EJECUCIÓN SCRIPT DE INSERCIÓN
  // =========================================================================

  // 1. Sincronizar Cursos y Matrículas (Enrollments)
  for (const c of rawCourses) {
    await db
      .insert(courses)
      .values({
        id: c.id,
        name: c.nombre,
        description: c.descripcion,
        icon: c.icon,
        xp: c.xp,
        theme: c.tema,
        hours: Math.ceil(c.duracionTotalMin / 60),
      })
      .onConflictDoUpdate({
        target: courses.id,
        set: { name: c.nombre, description: c.descripcion },
      })

    await db
      .insert(enrollments)
      .values({
        studentId: student.id,
        courseId: c.id,
        status: 'no_init',
        progress: 0,
        remainingMinutes: c.duracionTotalMin,
      })
      .onConflictDoNothing()

    // 2. Sincronizar Unidades y aplicar Purga de duplicados erróneos
    if (c.id === forenseId) {
      const officialUnitIds = [unitOneId, unitTwoId, unitThreeId, unitFourId]

      // Intentar limpiar registros huérfanos o duplicados autogenerados por pruebas previas
      try {
        await db.execute(
          `DELETE FROM "units" WHERE "course_id" = '${c.id}' AND "id" NOT IN (${officialUnitIds.map((id) => `'${id}'`).join(',')})`,
        )
      } catch (e) {
        console.log(
          '⚠️  Aviso: Limpieza saltada. Las unidades existentes están en uso activo.',
        )
      }

      for (const u of computacionForenseUnits) {
        await db
          .insert(units)
          .values({
            id: u.id, // Forzado manual
            courseId: c.id,
            title: u.title,
            order: u.order,
          })
          .onConflictDoUpdate({
            target: units.id,
            set: { title: u.title, order: u.order }, // Upsert estricto: evita la duplicación por completo
          })
      }
    }
  }

  console.log(
    '📦 Estructuras core y unidades validadas. Sincronizando lecciones...',
  )

  // 3. Procesamiento incremental de lecciones desde el diccionario
  for (const unitId of Object.keys(contentDictionary)) {
    const lessonsToSync = contentDictionary[unitId]

    for (const targetLesson of lessonsToSync) {
      // Validamos si la combinación de Unidad y Orden ya está registrada
      const existingLesson = await db.query.lessons.findFirst({
        where: and(
          eq(lessons.unitId, unitId),
          eq(lessons.order, targetLesson.order),
        ),
      })

      let lessonId: string

      if (!existingLesson) {
        console.log(
          `✨ Insertando nueva lección [Orden ${targetLesson.order}]: "${targetLesson.title}"`,
        )
        const [insertedLesson] = await db
          .insert(lessons)
          .values({
            unitId: unitId,
            title: targetLesson.title,
            content: targetLesson.content,
            duration: targetLesson.duration,
            order: targetLesson.order,
            keyConcepts: targetLesson.keyConcepts,
          })
          .returning()

        lessonId = insertedLesson.id
      } else {
        console.log(
          `🔄 Lección [Orden ${targetLesson.order}] ya existente en DB. Actualizando contenidos y bloques...`,
        )
        lessonId = existingLesson.id

        // Limpiamos los bloques antiguos de esta lección específica para sobreescribir limpiamente
        await db.delete(lessonBlocks).where(eq(lessonBlocks.lessonId, lessonId))
      }

      // 4. Inserción de bloques y generación de sus preguntas / opciones
      if (targetLesson.blocks && targetLesson.blocks.length > 0) {
        for (const b of targetLesson.blocks) {
          let finalQuestionId: string | null = null

          // Si el bloque es evaluativo, creamos la pregunta primero para heredar su id
          if (b.type === 'question' && b.question) {
            const [insertedQuestion] = await db
              .insert(questions)
              .values({
                type: b.question.type,
                statement: b.question.statement,
                metadata: b.question.metadata || null,
                points: b.question.points,
                feedbackCorrect: b.question.feedbackCorrect,
                feedbackError: b.question.feedbackError,
              })
              .returning()

            finalQuestionId = insertedQuestion.id

            // Inyectar las opciones de respuesta vinculadas a la pregunta
            if (b.question.options && b.question.options.length > 0) {
              for (const opt of b.question.options) {
                await db.insert(questionOptions).values({
                  questionId: finalQuestionId,
                  content: opt.content,
                  isCorrect: opt.isCorrect,
                  order: opt.order,
                })
              }
            }
          }

          // Insertar el bloque apuntando a la lección actual
          await db.insert(lessonBlocks).values({
            lessonId: lessonId,
            type: b.type,
            order: b.order,
            content: b.content || null,
            questionId: finalQuestionId,
          })
        }
      }
    }
  }

  console.log('✅ ¡Seeding incremental completado con éxito!')
}

seed()

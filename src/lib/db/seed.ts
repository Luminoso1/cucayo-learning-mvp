import 'dotenv/config'
import { db } from './index'
import {
  profiles,
  courses,
  enrollments,
  units,
  lessons,
  assessments,
  questions,
  questionOptions,
  assessmentQuestions,
  lessonBlocks,
} from './schema'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'

async function seed() {
  console.log('Preparing courses...')

  const student = await db.query.profiles.findFirst({
    where: eq(profiles.role, 'student'),
  })

  if (!student) {
    console.error('Opps Student not found')
    return
  }

  const rawCourses = [
    {
      id: '7eec9a52-8d4e-8b2a-1c81-21aa7e6b9031',
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
      id: '7f3c9a12-8d4e-4b1a-9c33-21aa7e6b9011',
      slug: nanoid(12),
      nombre: 'Algoritmos y Programación I',
      descripcion:
        'Estructuras de datos avanzadas, árboles balanceados y grafos.',
      icon: 'Code',
      tema: {
        borderColor: 'border-primary',
        accentColor: 'bg-primary',
        badgeBg: 'bg-primary/10',
        badgeText: 'text-primary',
      },
      duracionTotalMin: 320,
      xp: 200,
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
    {
      id: 'aa7d9921-ff12-4a89-8c77-9988abcc3103',
      slug: nanoid(12),
      nombre: 'Cálculo Diferencial',
      descripcion: 'Derivadas parciales y aplicaciones prácticas.',
      icon: 'Check',
      tema: {
        borderColor: 'border-green-600',
        accentColor: 'bg-green-600',
        badgeBg: 'bg-green-600/10',
        badgeText: 'text-green-600',
      },
      duracionTotalMin: 310,
      xp: 220,
    },
  ]

  const computacionForenseData = [
    {
      title: 'Unidad 1: Marco Legal y Amenazas',
      order: 1,
      lessons: [
        {
          title: 'Ley 1273 de 2009: Delitos Informáticos en Colombia',
          order: 1,
          concepts: ['Ley 1273', 'Sujeto Activo', 'Bien Jurídico Tutelado'],
        },
        {
          title: 'Tipificación de ataques de red comunes',
          order: 2,
          concepts: ['Spoofing', 'DDoS', 'Man-in-the-middle'],
        },
        {
          title: 'Fundamentos de Ciberseguridad vs. Informática Forense',
          order: 3,
          concepts: ['CIA Triad', 'Preservación', 'Post-mortem'],
        },
        {
          title: 'Mecanismos de defensa preventiva',
          order: 4,
          concepts: ['Firewalls', 'IDS/IPS', 'Hardening'],
        },
      ],
    },
    {
      title: 'Unidad 2: Evidencia Digital (Adquisición)',
      order: 2,
      lessons: [
        {
          title: 'Cadena de custodia y preservación',
          order: 1,
          concepts: ['Cadena de Custodia', 'Integridad', 'Hash'],
        },
        {
          title: 'Herramientas de clonación (FTK Imager/dd)',
          order: 2,
          concepts: ['Imagen Forense', 'Bit-a-bit', 'Write Blocker'],
        },
        {
          title: 'Configuración de un laboratorio forense estéril',
          order: 3,
          concepts: ['Aislamiento', 'Entorno Controlado'],
        },
      ],
    },
    {
      title: 'Unidad 3: Análisis Forense Profundo',
      order: 3,
      lessons: [
        {
          title: 'Estructura de Sistemas de Archivos (NTFS/ext4)',
          order: 1,
          concepts: ['MFT', 'Journaling', 'Inodos'],
        },
        {
          title: 'Análisis de Unidades de Almacenamiento (Sectores y Clusters)',
          order: 2,
          concepts: ['Slack Space', 'Unallocated Space'],
        },
        {
          title: 'Forense en Memoria RAM (Volatility)',
          order: 3,
          concepts: ['Artifacts', 'Dump', 'Procesos Volátiles'],
        },
        {
          title: 'Suites de análisis (Autopsy/EnCase)',
          order: 4,
          concepts: ['Keyword Search', 'Timeline Analysis'],
        },
      ],
    },
    {
      title: 'Unidad 4: Documentación y Resultados',
      order: 4,
      lessons: [
        {
          title: 'Estructura de informes periciales oficiales',
          order: 1,
          concepts: ['Dictamen Pericial', 'Metodología'],
        },
        {
          title: 'Redacción técnica: El "cómo" y el "qué"',
          order: 2,
          concepts: ['Lenguaje Técnico', 'Evidencia Objetiva'],
        },
        {
          title: 'Resumen ejecutivo: Traduciendo bits a lenguaje legal',
          order: 3,
          concepts: ['Hallazgos Clave', 'Conclusiones'],
        },
      ],
    },
  ]

  for (const c of rawCourses) {
    // 1. Insertar curso
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
      .onConflictDoNothing()

    // 2. Insertar enrollment
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

    // Lógica específica para Computación Forense
    if (c.id === '7eec9a52-8d4e-8b2a-1c81-21aa7e6b9031') {
      for (const u of computacionForenseData) {
        const [insertedUnit] = await db
          .insert(units)
          .values({
            courseId: c.id,
            title: u.title,
            order: u.order,
          })
          .returning()

        for (const l of u.lessons) {
          const [insertedLesson] = await db
            .insert(lessons)
            .values({
              unitId: insertedUnit.id,
              title: l.title,
              order: l.order,
              duration: 8,
              content: `Contenido base para ${l.title}...`, // Aquí iría tu Markdown
              keyConcepts: l.concepts,
            })
            .returning()

          // --- SEED DE ASSESSMENT: Lección 1, Unidad 1 ---
          if (u.order === 1 && l.order === 1) {
            console.log('📦 Insertando bloques para Lección 1...')

            // BLOQUE 1: Introducción Teórica
            await db.insert(lessonBlocks).values({
              lessonId: insertedLesson.id,
              type: 'content',
              content: `## Introducción a la Ley 1273\nLa Ley 1273 de 2009 modificó el Código Penal colombiano para incluir la protección de la información y los datos...`,
              order: 1,
            })

            // BLOQUE 2: Pregunta Interactiva (Multiple Choice)
            const [q1] = await db
              .insert(questions)
              .values({
                type: 'multiple_choise',
                statement:
                  '¿Cuál es el Bien Jurídico Tutelado por la Ley 1273?',
                points: 10,
                feedbackCorrect: '¡Exacto! Protege la información.',
              })
              .returning()

            await db.insert(questionOptions).values([
              { questionId: q1.id, content: 'Hardware', isCorrect: false },
              {
                questionId: q1.id,
                content: 'Información y datos',
                isCorrect: true,
              },
            ])

            await db.insert(lessonBlocks).values({
              lessonId: insertedLesson.id,
              type: 'question',
              questionId: q1.id,
              order: 2,
            })

            // BLOQUE 3: Más contenido (Deep Dive)
            await db.insert(lessonBlocks).values({
              lessonId: insertedLesson.id,
              type: 'content',
              content: `### El Sujeto Activo\nEn estos delitos, el sujeto activo puede ser cualquier persona que acceda sin autorización...`,
              order: 3,
            })

            // BLOQUE 4: Pregunta de Cloze (Completar)
            const [q2] = await db
              .insert(questions)
              .values({
                type: 'cloze',
                statement:
                  'La integridad de la evidencia se garantiza mediante un {{Hash}}.',
                points: 15,
              })
              .returning()

            await db
              .insert(questionOptions)
              .values([{ questionId: q2.id, content: 'Hash', isCorrect: true }])

            await db.insert(lessonBlocks).values({
              lessonId: insertedLesson.id,
              type: 'question',
              questionId: q2.id,
              order: 4,
            })
            /*
            console.log('Inserting Quiz for Lesson 1...')

            // 1. Crear el Assessment (Contenedor)
            const [quiz] = await db
              .insert(assessments)
              .values({
                title: 'Quiz rápido: Ley 1273',
                type: 'lesson_quiz',
                lessonId: insertedLesson.id,
                passingScore: 70,
              })
              .returning()

            // 2. Crear una Pregunta de Opción Múltiple
            const [q1] = await db
              .insert(questions)
              .values({
                type: 'multiple_choise',
                statement:
                  '¿Cuál es el Bien Jurídico Tutelado por la Ley 1273 de 2009?',
                points: 10,
                feedbackCorrect:
                  '¡Exacto! La ley protege la información y los datos.',
              })
              .returning()

            await db.insert(questionOptions).values([
              {
                questionId: q1.id,
                content: 'El hardware físico',
                isCorrect: false,
              },
              {
                questionId: q1.id,
                content: 'La protección de la información y los datos',
                isCorrect: true,
              },
              {
                questionId: q1.id,
                content: 'La infraestructura de red',
                isCorrect: false,
              },
            ])

            // 3. Crear una Pregunta de Ordenamiento
            const [q2] = await db
              .insert(questions)
              .values({
                type: 'ordering',
                statement:
                  'Ordene los pasos de preservación vistos en el laboratorio:',
                metadata: { correct_order: [0, 1, 2] }, // Índices de las opciones creadas abajo
                points: 10,
              })
              .returning()

            await db.insert(questionOptions).values([
              { questionId: q2.id, content: 'Preservar Memoria RAM', order: 0 },
              {
                questionId: q2.id,
                content: 'Identificar IP de origen',
                order: 1,
              },
              {
                questionId: q2.id,
                content: 'Tipificar delito legalmente',
                order: 2,
              },
            ])

            // 4. NUEVA: Pregunta de TEXT_INPUT (Respuesta corta escrita)
            const [q3] = await db
              .insert(questions)
              .values({
                id: crypto.randomUUID(),
                type: 'text_input',
                statement:
                  '¿Cuál es el nombre técnico de la copia bit-a-bit que se realiza a un disco duro para no alterar el original?',
                points: 10,
                feedbackCorrect:
                  '¡Excelente! La imagen forense es la base de la investigación.',
                feedbackError: 'Se conoce comúnmente como Imagen Forense.',
              })
              .returning()

            await db.insert(questionOptions).values([
              { questionId: q3.id, content: 'Imagen forense', isCorrect: true },
              {
                questionId: q3.id,
                content: 'Clonación forense',
                isCorrect: true,
              }, // Aceptamos sinónimos
            ])

            // 5. NUEVA: Pregunta de CLOZE (Completar espacios)
            const [q4] = await db
              .insert(questions)
              .values({
                id: crypto.randomUUID(),
                type: 'cloze',
                statement:
                  'Para garantizar la integridad de una evidencia digital, se debe generar un código {{Hash}} único.',
                points: 10,
                feedbackCorrect:
                  'El Hash funciona como una huella digital para los archivos.',
              })
              .returning()

            await db
              .insert(questionOptions)
              .values([{ questionId: q4.id, content: 'Hash', isCorrect: true }])

            const [q5] = await db
              .insert(questions)
              .values({
                id: crypto.randomUUID(),
                type: 'multiple_cloze',
                statement:
                  'En la informática forense, primero se debe {{0}} la escena, luego {{1}} la evidencia y finalmente {{2}} los hallazgos en un informe.',
                points: 30,
                feedbackCorrect:
                  '¡Perfecto! Has memorizado el flujo de trabajo pericial.',
              })
              .returning()

            await db.insert(questionOptions).values([
              {
                questionId: q5.id,
                content: 'asegurar',
                isCorrect: true,
                order: 0,
              },
              {
                questionId: q5.id,
                content: 'recolectar',
                isCorrect: true,
                order: 1,
              },
              {
                questionId: q5.id,
                content: 'documentar',
                isCorrect: true,
                order: 2,
              },
              { questionId: q5.id, content: 'borrar', isCorrect: false }, // Distractor
              { questionId: q5.id, content: 'alterar', isCorrect: false }, // Distractor
            ])

            // 6. Vincular TODAS las preguntas al Assessment
            await db.insert(assessmentQuestions).values([
              { assessmentId: quiz.id, questionId: q1.id, order: 1 },
              { assessmentId: quiz.id, questionId: q2.id, order: 2 },
              { assessmentId: quiz.id, questionId: q3.id, order: 3 },
              { assessmentId: quiz.id, questionId: q4.id, order: 4 },
              { assessmentId: quiz.id, questionId: q5.id, order: 5 },
            ])

          */
          }
        }
      }
    }
  }

  console.log('Course ready')
}

seed()

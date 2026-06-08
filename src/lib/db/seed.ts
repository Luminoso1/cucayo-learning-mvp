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

import type {
  LessonInsert,
  BlockInsert,
  QuestionInsert,
  OptionInsert,
} from '#/lib/db/schema'

interface Question extends QuestionInsert {
  options: OptionInsert[]
}

interface Block extends BlockInsert {
  question: Question | null
}

interface Lesson extends LessonInsert {
  unitId: string
  blocks: Block[]
}

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

  const contentDictionary: Record<string, Lesson[]> = {
    U1: [
      // lesson 1
      {
        unitId: '',
        title: '',
        content: 'unidad 1 lesson 1',
        duration: 0,
        order: 1,
        keyConcepts: [''],
        blocks: [
          // block 1 - content
          {
            content: 'unidad 1 lesson 1 block 1',
            lessonId: '',
            order: 1,
            question: null,
            questionId: null,
            type: 'content',
          },
          // block 2 - question
          {
            lessonId: '',
            order: 2,
            question: {
              type: 'multiple_cloze',
              statement:
                'Una base de datos cifrada afecta a la {{0}}, el hacker es el {{1}} y el afectado el {{2}}.',
              metadata: '',
              points: 25,
              feedbackCorrect: '¡Excelente mapeo legal!',
              feedbackError:
                'Repasa los roles activos, pasivos y la tríada de seguridad.',
              options: [
                {
                  content: 'disponibilidad',
                  isCorrect: true,
                  order: 0,
                },
                { content: 'sujeto activo', isCorrect: true, order: 1 },
                { content: 'sujeto pasivo', isCorrect: true, order: 2 },
                {
                  content: 'confidencialidad',
                  isCorrect: false,
                  order: null,
                },
              ],
            },
            questionId: null,
            type: 'question',
          },

          // block 3 - content
          {
            content: 'unidad 1 lesson 1 block 3',
            lessonId: '',
            order: 3,
            question: null,
            questionId: null,
            type: 'content',
          },
          // block 4 - question
          {
            lessonId: '',
            order: 4,
            question: {
              type: 'multiple_cloze',
              statement:
                'Una base de datos cifrada afecta a la {{0}}, el hacker es el {{1}} y el afectado el {{2}}.',
              metadata: '',
              points: 25,
              feedbackCorrect: '¡Excelente mapeo legal!',
              feedbackError:
                'Repasa los roles activos, pasivos y la tríada de seguridad.',
              options: [
                {
                  content: 'disponibilidad',
                  isCorrect: true,
                  order: 0,
                },
                { content: 'sujeto activo', isCorrect: true, order: 1 },
                { content: 'sujeto pasivo', isCorrect: true, order: 2 },
                {
                  content: 'confidencialidad',
                  isCorrect: false,
                  order: null,
                },
              ],
            },
            questionId: null,
            type: 'question',
          },

          // block 5 - content
          {
            content: 'unidad 1 lesson 1 block 1',
            lessonId: '',
            order: 5,
            question: null,
            questionId: null,
            type: 'content',
          },
          // block 6 - question
          {
            lessonId: '',
            order: 6,
            question: {
              type: 'multiple_cloze',
              statement:
                'Una base de datos cifrada afecta a la {{0}}, el hacker es el {{1}} y el afectado el {{2}}.',
              metadata: '',
              points: 25,
              feedbackCorrect: '¡Excelente mapeo legal!',
              feedbackError:
                'Repasa los roles activos, pasivos y la tríada de seguridad.',
              options: [
                {
                  content: 'disponibilidad',
                  isCorrect: true,
                  order: 0,
                },
                { content: 'sujeto activo', isCorrect: true, order: 1 },
                { content: 'sujeto pasivo', isCorrect: true, order: 2 },
                {
                  content: 'confidencialidad',
                  isCorrect: false,
                  order: null,
                },
              ],
            },
            questionId: null,
            type: 'question',
          },

          // block 7 - content
          {
            content: 'unidad 1 lesson 1 block 1',
            lessonId: '',
            order: 7,
            question: null,
            questionId: null,
            type: 'content',
          },

          // block 8 - question
          {
            lessonId: '',
            order: 8,
            question: {
              type: 'multiple_cloze',
              statement:
                'Una base de datos cifrada afecta a la {{0}}, el hacker es el {{1}} y el afectado el {{2}}.',
              metadata: '',
              points: 25,
              feedbackCorrect: '¡Excelente mapeo legal!',
              feedbackError:
                'Repasa los roles activos, pasivos y la tríada de seguridad.',
              options: [
                {
                  content: 'disponibilidad',
                  isCorrect: true,
                  order: 0,
                },
                { content: 'sujeto activo', isCorrect: true, order: 1 },
                { content: 'sujeto pasivo', isCorrect: true, order: 2 },
                {
                  content: 'confidencialidad',
                  isCorrect: false,
                  order: null,
                },
              ],
            },
            questionId: null,
            type: 'question',
          },
        ],
      },
    ],
  }

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
            console.log(
              '📦 Insertando bloques de Microlearning para Lección 1...',
            )

            // ==========================================
            // BLOQUE 1: Contenido (Conceptos Fundamentales)
            // ==========================================
            await db.insert(lessonBlocks).values({
              lessonId: insertedLesson.id,
              type: 'content',
              order: 1,
              content: `# Conceptos Fundamentales de Criminalística Digital (Ley 1273 de 2009)\n\nComo ingenieros de software, estamos acostumbrados a construir sistemas y optimizar algoritmos. Sin embargo, en la **Computación Forense**, nuestra misión cambia radicalmente: debemos entender cómo la ley castiga a quienes usan el software para dañar a otros.\n\nEn Colombia, la **Ley 1273 de 2009** introdujo un nuevo bien jurídico protegido: **la protección de la información y de los datos**. Para que un incidente informático sea procesable legalmente, como peritos debemos mapear técnicamente la escena digital basándonos en dos pilares:\n\n### A. El Bien Jurídico Tutelado\nNo protegemos el *hardware* físico, sino los activos lógicos. Se tutela de forma estricta la **Tríada de la Seguridad (CIA)**:\n* **Confidencialidad:** Protección contra acceso no autorizado.\n* **Integridad:** Protección contra modificaciones o alteraciones.\n* **Disponibilidad:** Garantía de acceso al sistema cuando se requiera.\n\n### B. Los Sujetos del Delito\nEn un reporte o dictamen forense pericial, identificarás obligatoriamente a dos actores:\n\n| Sujeto | Definición | Ejemplo Técnico |\n| :--- | :--- | :--- |\n| **Sujeto Activo** | Quien ejecuta la acción delictiva directa. | Un atacante externo, un insider (empleado deshonesto). |\n| **Sujeto Pasivo** | El titular del bien jurídico dañado (víctima). | Una entidad bancaria, un ciudadano, el Estado |`,
            })

            // ==========================================
            // BLOQUE 2: Pregunta (Multiple Cloze)
            // ==========================================
            const [q1] = await db
              .insert(questions)
              .values({
                type: 'multiple_cloze',
                statement:
                  'Durante el peritaje de un ataque de ransomware a un hospital, la base de datos de historias clínicas cifrada representa el daño a la {{0}}, el atacante externo que desplegó el malware actúa como el {{1}} y el centro médico afectado se tipifica como el {{2}}.',
                points: 25,
                feedbackCorrect:
                  '¡Excelente! Has mapeado con precisión la anatomía legal del incidente informático.',
                feedbackError:
                  'Recuerda: El pasivo es la víctima, el activo ejecuta la acción y los datos representan el bien jurídico comprometido.',
              })
              .returning()

            await db.insert(questionOptions).values([
              {
                questionId: q1.id,
                content: 'disponibilidad',
                isCorrect: true,
                order: 0,
              },
              {
                questionId: q1.id,
                content: 'sujeto activo',
                isCorrect: true,
                order: 1,
              },
              {
                questionId: q1.id,
                content: 'sujeto pasivo',
                isCorrect: true,
                order: 2,
              },
              {
                questionId: q1.id,
                content: 'confidencialidad',
                isCorrect: false,
                order: null,
              },
              {
                questionId: q1.id,
                content: 'hardware del servidor',
                isCorrect: false,
                order: null,
              },
            ])

            await db.insert(lessonBlocks).values({
              lessonId: insertedLesson.id,
              type: 'question',
              questionId: q1.id,
              order: 2,
            })

            // ==========================================
            // BLOQUE 3: Contenido (Tipificación Penal)
            // ==========================================
            await db.insert(lessonBlocks).values({
              lessonId: insertedLesson.id,
              type: 'content',
              order: 3,
              content: `# Tipificación Penal: Artículos 269A y 269F\n\nComo investigador o perito informático, tu evidencia técnica en crudo servirá para que un juez determine si la conducta encaja en un delito específico (tipificación):\n\n### Art. 269A: Acceso Abusivo a Sistema Informático\n* **Definición:** Entrar en un sistema informático de manera total o parcial, sin autorización o excediendo la que se posee.\n* **Evidencia de Campo:** Análisis de logs de autenticación (ej. Event Viewer en Windows o \`/var/log/auth.log\` en Linux), registros de sesiones RDP activas en horarios anómalos, trazas de bypass de firewalls o detección de patrones de fuerza bruta (*brute force*).\n\n### Art. 269F: Violación de Datos Personales\n* **Definición:** Obtener, compilar, sustraer, ofrecer, vender, intercambiar, comprar o modificar bases de datos con información personal sin autorización previa o mandamiento judicial.\n* **Evidencia de Campo:** Extracción forense de archivos estructurados (**.csv**, **.sql**, **.json**) o volcados de memoria volátil (RAM) que almacenen datos sensibles de clientes o usuarios (nombres, hashes de contraseñas, tarjetas de crédito) dentro del almacenamiento del dispositivo del sospechoso.`,
            })

            // ==========================================
            // BLOQUE 4: Pregunta (Multiple Choice)
            // ==========================================
            const [q2] = await db
              .insert(questions)
              .values({
                type: 'multiple_choise',
                statement:
                  'Al realizar el análisis post-mortem de un servidor, localizas en el historial bash del sospechoso el comando "mysqldump -u root -p production_db > exfiltrado.sql", seguido de una transferencia exógena masiva. ¿Bajo qué artículo principal de la Ley 1273 debes tipificar técnicamente este hallazgo en tu informe pericial?',
                points: 25,
                feedbackCorrect:
                  '¡Correcto! La exportación y sustracción no autorizada de bases de datos que contienen registros se tipifica bajo el Art. 269F.',
                feedbackError:
                  'Analiza la acción del comando: no solo ingresó al sistema de forma anómala, extrajo explícitamente una base de datos estructurada con información.',
              })
              .returning()

            await db.insert(questionOptions).values([
              {
                questionId: q2.id,
                content: 'Art. 269A: Acceso Abusivo a Sistema Informático.',
                isCorrect: false,
              },
              {
                questionId: q2.id,
                content: 'Art. 269F: Violación de Datos Personales.',
                isCorrect: true,
              },
              {
                questionId: q2.id,
                content: 'Daño Informático simple sobre el hardware físico.',
                isCorrect: false,
              },
            ])

            await db.insert(lessonBlocks).values({
              lessonId: insertedLesson.id,
              type: 'question',
              questionId: q2.id,
              order: 4,
            })

            // ==========================================
            // BLOQUE 5: Contenido (Rol Técnico del Perito)
            // ==========================================
            await db.insert(lessonBlocks).values({
              lessonId: insertedLesson.id,
              type: 'content',
              order: 5,
              content: `# El Rol Técnico del Perito Forense (Análisis Post-Mortem)\n\nA diferencia de un analista de SOC (Security Operations Center) o un ingeniero de Blue Team, cuyo foco primordial es mitigar, contener y repeler un ciberataque en tiempo real, el **Ingeniero Forense** opera en un entorno **Post-Mortem**. Su objetivo es reconstructivo e histórico.\n\nA nivel de código, un perito debe codificar herramientas de triaje que busquen correlaciones lógicas basadas en la ley. Observa este ejemplo abstracto de cómo se estructuran las reglas de evaluación automatizada de incidentes:\n\n\`\`\`javascript\n// Lógica base de un script de triaje forense pericial\nconst evaluarTrazasLog = (logEntry) => {\n  const { statusCode, loginAttempts, payloadType } = logEntry;\n\n  // Entrada forzada sin privilegios\n  if (statusCode === 401 && loginAttempts > 50) {\n    return "Evidencia de intento de Acceso Abusivo (Art. 269A)";\n  }\n  \n  // Modificación no autorizada de datos/estructura\n  if (payloadType === 'SQL_INJECTION_DROP_TABLE') {\n    return "Evidencia flagrante de Daño Informático (Art. 269D)";\n  }\n\n  return "Trazas requieren análisis manual en laboratorio";\n};\n\`\`\``,
            })

            // ==========================================
            // BLOQUE 6: Pregunta (Text Input)
            // ==========================================
            const [q3] = await db
              .insert(questions)
              .values({
                type: 'text_input',
                statement:
                  '¿Cómo se conoce técnicamente en la ingeniería de seguridad al análisis de un incidente informático que se realiza después de que el evento ya ha ocurrido y concluido por completo? (Escribe el término compuesto de dos palabras separado por un guion):',
                points: 25,
                feedbackCorrect:
                  '¡Excelente! El análisis Post-Mortem define la naturaleza analítica y reconstructiva de la computación forense.',
                feedbackError:
                  'Se refiere al examen retrospectivo o "después de la muerte" del incidente informático en el servidor.',
              })
              .returning()

            await db.insert(questionOptions).values([
              { questionId: q3.id, content: 'post-mortem', isCorrect: true },
              { questionId: q3.id, content: 'post mortem', isCorrect: true },
            ])

            await db.insert(lessonBlocks).values({
              lessonId: insertedLesson.id,
              type: 'question',
              questionId: q3.id,
              order: 6,
            })

            // ==========================================
            // BLOQUE 7: Contenido (Cadena de Custodia)
            // ==========================================
            await db.insert(lessonBlocks).values({
              lessonId: insertedLesson.id,
              type: 'content',
              order: 7,
              content: `# La Regla de Oro y la Cadena de Custodia\n\nCualquier hallazgo técnico, por más incriminatorio o brillante que sea, carece por completo de validez jurídica si el perito rompe la **Cadena de Custodia**. En el derecho penal, esto se rige bajo la doctrina constitucional del **fruto del árbol envenenado**: si la fuente de la evidencia está contaminada, toda la evidencia derivada es nula.\n\n> ⚠️ Regla de Oro del Perito: **No trabajar jamás sobre la evidencia original.**\n\n### Protocolo de Aseguramiento de Evidencia:\n1. **Bloqueo de Escritura:** Se debe conectar el disco o unidad bajo investigación a un dispositivo de hardware denominado *Write Blocker*. Esto impide físicamente que el sistema operativo del perito altere un solo bit o los metadatos de la unidad al montarla.\n2. **Duplicación Forense:** Se genera una imagen bit a bit (clonación exacta sector por sector) en formatos forenses estandarizados como \`.E01\` (Expert Witness Format) o copias crudas \`.dd\`.\n3. **Cálculo de Hash (Integridad):** Inmediatamente finalizada la copia, se calcula el algoritmo de verificación matemática (SHA-256 o MD5) de la unidad física y de la imagen generada. Ambos strings deben ser idénticos. Si un solo bit varía, la cadena de custodia se ha roto.`,
            })

            // ==========================================
            // BLOQUE 8: Pregunta (Ordering)
            // ==========================================
            const [q4] = await db
              .insert(questions)
              .values({
                type: 'ordering',
                statement:
                  'Estás en la escena de un incidente y necesitas extraer la imagen de un disco duro de forma pericial. Ordena cronológicamente los pasos requeridos para blindar legalmente la evidencia contra la doctrina del fruto del árbol envenenado:',
                points: 25,
                metadata: { correct_order: [0, 1, 2] },
                feedbackCorrect:
                  '¡Perfecto! Has preservado de manera impecable la Cadena de Custodia siguiendo la secuencia forense internacional.',
                feedbackError:
                  'Recuerda el orden físico y lógico: Primero impides físicamente la escritura, luego extraes el clon idéntico sector por sector y finalmente firmas matemáticamente para verificar integridad.',
              })
              .returning()

            await db.insert(questionOptions).values([
              {
                questionId: q4.id,
                content:
                  'Conectar el medio de almacenamiento original a un bloqueador de escritura (Write Blocker).',
                order: 0,
              },
              {
                questionId: q4.id,
                content:
                  'Realizar la duplicación forense bit a bit (generación de imagen estandarizada .E01 o .dd).',
                order: 1,
              },
              {
                questionId: q4.id,
                content:
                  'Generar y registrar el valor del algoritmo hash criptográfico (SHA-256) de ambas unidades.',
                order: 2,
              },
            ])

            await db.insert(lessonBlocks).values({
              lessonId: insertedLesson.id,
              type: 'question',
              questionId: q4.id,
              order: 8,
            })
          }
        }
      }
    }
  }

  console.log('Course ready')
}

seed()

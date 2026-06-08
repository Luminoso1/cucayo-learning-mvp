import { createServerFn } from '@tanstack/react-start'
import { studentMiddleware } from '@/middleware/student'
import { db } from '@/lib/db'
import { lessonCompletions } from '@/lib/db/schema'
import { z } from 'zod'
import type { Block, Question } from '#/components/lesson/types'

import { openAiClient } from '#/lib/ai/openai'

const lessonParamsSchema = z.object({
  lessonSlug: z.string(),
})

export const getLessonFn = createServerFn({ method: 'GET' })
  .middleware([studentMiddleware])
  .inputValidator((data) => lessonParamsSchema.parse(data))
  .handler(async ({ data: { lessonSlug } }) => {
    const lesson = await db.query.lessons.findFirst({
      where: (lesson, { eq }) => eq(lesson.slug, lessonSlug),
      with: {
        blocks: {
          orderBy: (blocks, { asc }) => [asc(blocks.order)],
          with: {
            question: {
              with: {
                options: {
                  columns: {
                    id: true,
                    content: true,
                    order: true,
                    isCorrect: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!lesson || !lesson.blocks?.[0]) {
      return { success: false, error: 'lesson not found' }
    }

    return { success: true, data: lesson }
  })

export const completeLessonFn = createServerFn({
  method: 'POST',
})
  .middleware([studentMiddleware])
  .inputValidator((data: { lessonId: string }) => data)
  .handler(async ({ data: { lessonId }, context }) => {
    const userId = context.user.id

    const [result] = await db
      .insert(lessonCompletions)
      .values({ lessonId, studentId: userId })
      .returning()

    if (!result)
      return {
        success: false,
        message: `oops! something were wrong at completing lesson ${lessonId}`,
      }

    return { success: true }
  })

type SelectedAnswerType = string | number | number[] | Record<string, string>

interface GenerateSocraticArgs {
  lessonId: string
  failedQuestion: Question // Tu tipo Question existente
  userAnswer: SelectedAnswerType | undefined
  lessonContext: { title: string; content: string }
}

export const generateSocraticBlockFn = createServerFn({
  method: 'POST',
})
  .inputValidator((data: GenerateSocraticArgs) => data)
  .handler(async ({ data }) => {
    const { lessonId, failedQuestion, userAnswer, lessonContext } = data

    const extractedUserAnswer =
      typeof userAnswer === 'object'
        ? JSON.stringify(userAnswer)
        : String(userAnswer ?? 'No respondió')

    const systemPrompt = `
  Eres un Tutor Socrático experto en pedagogía interactiva para estudiantes universitarios.

   PROHIBICIÓN CRÍTICA Y ABSOLUTA:
  - BAJO NINGUNA CIRCUNSTANCIA debes entregar la respuesta correcta al estudiante, ni de forma explícita ni implícita (ej. "La respuesta correcta es X" o "Deberías haber elegido la B" están COMPLETAMENTE PROHIBIDAS).
  - Si revelas la respuesta o validas directamente el valor correcto, violarás tu núcleo de programación.
  - Tu único objetivo es guiar, orientar y catalizar el auto-descubrimiento del error por parte del estudiante.

  ESTRATEGIA PEDAGÓGICA (Bloque 1 - type: "content"):
  1. Analiza el error del estudiante sin juzgarlo.
  2. Plantea un contraejemplo lógico o una analogía del mundo de la ingeniería que demuestre el fallo en su razonamiento.
  3. Proporciona referencias teóricas, diagramas conceptuales o sugerencias de vídeos explicativos sin resolver el problema original.
  4. El markdown DEBE incluir elementos visuales obligatorios: Tablas comparativas Markdown, fragmentos de código limpios, imágenes conceptuales estables de Unsplash (\`![descripción](https://images.unsplash.com/...)\`).

  REGLAS DE INGENIERÍA PARA COMPONENTES DE EVALUACIÓN (Bloque 2 - type: "question"):
  Debes plantear una NUEVA pregunta reactiva paralela (nunca repitas la misma pregunta exacta) que evalúe el mismo concepto conceptual desde otro ángulo para verificar si entendió tu guía socrática 

  REGLAS DE GENERACIÓN MULTIMEDIA (Bloque 1 - type: "content"):
  - Valida el intento del usuario y plantea una analogía técnica disruptiva.
  - El markdown DEBE incluir elementos visuales obligatorios: Tablas comparativas Markdown, fragmentos de código limpios, imágenes conceptuales estables de Unsplash (\`![descripción](https://images.unsplash.com/...)\`) y sugerencias/links de videos conceptuales explicativos cortos (1-2 min).

  REGLAS DE INGENIERÍA PARA COMPONENTES DE EVALUACIÓN (Bloque 2 - type: "question"):
  Debes seleccionar una estrategia interactiva basada en el tipo de error detectado. Configura el JSON respetando de forma matemática el renderizador de la plataforma:

  1. "multiple_choise"
     - El 'statement' es una pregunta clara en texto plano.
     - 'options': Genera de 3 a 4 opciones. Solo una debe tener "isCorrect": true.

  2. "ordering"
     - El 'statement' debe indicar que se ordene una secuencia paso a paso (ej. un flujo algorítmico).
     - 'options': Envía las opciones conceptuales. Asigna a cada una el número de secuencia correcto en la propiedad "order" (0 para el primero, 1 para el segundo, etc.). La plataforma las barajará automáticamente, pero validará comparando arrays por ID basados en tu orden numérico.

  3. "text_input"
     - El 'statement' es una pregunta de desarrollo corto o cálculo exacto en texto plano.
     - 'options': Genera una o más opciones con "isCorrect": true donde "content" almacene los strings exactos aceptados (en minúsculas o variaciones semánticas idénticas) contra los que se evaluará el textarea del usuario.

  4. "cloze" (Rellenar espacio en línea)
     - El 'statement' DEBE incluir obligatoriamente el texto exacto a ocultar envuelto en llaves dobles. Ejemplo: "La memoria {{cache}} es más rápida que la RAM."
     - 'options': Debe contener exactamente una opción con "isCorrect": true, cuyo "content" debe ser idéntico al string que pusiste dentro de las llaves dobles (ej. "cache"), ignorando mayúsculas/minúsculas.

  5. "multiple_cloze" (Drag and Drop de palabras al texto)
     - El 'statement' DEBE contener marcadores posicionales numéricos estrictos empezando desde cero. Ejemplo: "Un clúster de Kubernetes usa un {{0}} para el plano de control y varios {{1}} para ejecutar las cargas de trabajo."
     - 'options': Debe contener todas las palabras del banco (tanto correctas como distractores si deseas).
     - Para las palabras correctas, DEBES poner "isCorrect": true y asignar en la propiedad "order" el índice numérico exacto que le corresponde en el statement (ej. Opción con content "Master Node" llevará order: 0. Opción con content "Worker Nodes" llevará order: 1).
     - Para distractores opcionales, usa "isCorrect": false y "order": null.

  FORMATO DE SALIDA ESTRICTO (JSON):
  Devuelve única y exclusivamente un objeto JSON bajo esta estructura exacta:
  {
    "blocks": [
      {
        "type": "content",
        "content": "Markdown aquí..."
      },
      {
        "type": "question",
        "question": {
          "type": "multiple_choise" | "ordering" | "text_input" | "cloze" | "multiple_cloze",
          "statement": "Enunciado formateado según las reglas del tipo de pregunta elegida...",
          "metadata": {},
          "points": 10,
          "feedbackCorrect": "¡Excelente deducción!",
          "feedbackError": "Revisa el concepto de...",
          "options": [
            { "content": "Valor", "isCorrect": true, "order": 0 }
          ]
        }
      }
    ]
  }
  `

    const userPrompt = `
  CONTEXTO DE LA LECCIÓN:
  Título: "${lessonContext.title}"
  Contenido Base: "${lessonContext.content}"

  PREGUNTA EN LA QUE FALLÓ EL ESTUDIANTE:
  Tipo original: "${failedQuestion.type}"
  Enunciado original: "${failedQuestion.statement}"
  Opciones originales: ${JSON.stringify(failedQuestion.options.map((o) => ({ content: o.content, isCorrect: o.isCorrect, order: o.order })))}
  
  RESPUESTA DEL ESTUDIANTE (ERROR):
  El estudiante ingresó/seleccionó: "${extractedUserAnswer}"

  Genera los 2 bloques correspondientes (remediación socrática + nueva pregunta reactiva). Asegúrate de inyectar la sintaxis correcta en el statement y las opciones según el tipo que elijas.
  `

    const response = await openAiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.6,
    })

    const responseText = response.choices[0].message.content
    if (!responseText) throw new Error('OpenAI devolvió una respuesta vacía.')

    const parsedData = JSON.parse(responseText) as {
      blocks: Block[]
    }

    const blocks = parsedData.blocks.map((block, idx) => {
      const blockId = crypto.randomUUID()
      if (block.type === 'question' && block.question) {
        const qId = crypto.randomUUID()
        return {
          id: blockId,
          lessonId,
          type: block.type,
          order: idx,
          content: null,
          questionId: qId,
          question: {
            id: qId,
            type: block.question.type,
            statement: block.question.statement,
            metadata: block.question.metadata ?? {}, // Ahora es Record<string, any>
            points: 10,
            feedbackCorrect: block.question.feedbackCorrect,
            feedbackError: block.question.feedbackError,
            options: block.question.options.map((opt, oIdx) => ({
              id: crypto.randomUUID(),
              questionId: qId,
              content: opt.content,
              isCorrect: opt.isCorrect,
              order: opt.order ?? oIdx,
            })),
          },
        }
      }

      return {
        id: blockId,
        lessonId,
        type: block.type,
        order: idx,
        content: block.content,
        questionId: null,
        question: null,
      }
    })

    return blocks
  })

import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { getLessonFn } from '#/lib/tutor/fn'
import { updateLessonContent } from '#/lib/tutor/fn'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { Edit3, Save, Eye, CheckCircle2, Loader2 } from 'lucide-react'
import 'highlight.js/styles/github-dark.css'

export const Route = createFileRoute(
  '/_authenticated/tutor/courses/$courseSlug/lesson/$lessonSlug',
)({
  loader: async ({ params }) =>
    await getLessonFn({
      data: { lessonSlug: params.lessonSlug },
    }),
  component: RouteComponent,
})

function RouteComponent() {
  const { data, success } = Route.useLoaderData()
  const { courseSlug } = Route.useParams()

  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(data?.content || '')
  const [isSaving, setIsSaving] = useState(false)
  const [hasSaved, setHasSaved] = useState(false)

  if (!success || !data)
    return <div className="p-10 text-center">No se pudo cargar la lección.</div>

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateLessonContent({ data: { id: data.id, content } })
      setHasSaved(true)
      setIsEditing(false)
      setTimeout(() => setHasSaved(false), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-stone-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-stone-900">{data.title}</h1>
            <p className="text-sm text-stone-500 font-medium italic">
              Editando lección del curso {courseSlug}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {hasSaved && (
              <span className="flex items-center gap-1 text-green-600 font-bold text-sm animate-in fade-in slide-in-from-right-4">
                <CheckCircle2 className="size-4" /> Guardado
              </span>
            )}

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-stone-600 hover:bg-stone-100 transition-colors"
            >
              {isEditing ? (
                <>
                  <Eye className="size-4" /> Previsualizar
                </>
              ) : (
                <>
                  <Edit3 className="size-4" /> Editar Markdown
                </>
              )}
            </button>

            {isEditing && (
              <button
                disabled={isSaving}
                onClick={handleSave}
                className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-xl font-bold shadow-[0_4px_0_#c2410c] hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                Guardar Cambios
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="py-8">
        {isEditing ? (
          <div className="grid grid-cols-1 gap-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-[60vh] p-6 text-stone-800 font-mono text-lg rounded-3xl focus:border-primary focus:ring-0 resize-none bg-stone-50 shadow-inner"
              placeholder="Escribe tu contenido en Markdown aquí..."
            />
            <p className="text-xs text-stone-400 font-medium">
              Soporta GitHub Flavored Markdown, tablas y código resaltado.
            </p>
          </div>
        ) : (
          <article
            className="prose prose-stone max-w-none 
                            prose-headings:font-black prose-headings:text-stone-900
                            prose-p:text-stone-600 prose-p:leading-relaxed
                            prose-code:bg-stone-100 prose-code:p-1 prose-code:rounded
                            prose-pre:rounded-3xl prose-pre:bg-stone-900 px-8"
          >
            <Markdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
            >
              {content}
            </Markdown>
          </article>
        )}

        {/* Acceso rápido a Assessment */}
        <div className="mt-20 p-8 bg-stone-50 rounded-[2.5rem] border-2 border-dashed border-stone-200 flex flex-col items-center text-center gap-4">
          <div className="size-16 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-stone-200">
            <CheckCircle2 className="size-8 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-stone-900">
              Configuración de Evaluación
            </h3>
            <p className="text-stone-500">
              Asegúrate de que los estudiantes hayan entendido los conceptos
              clave.
            </p>
          </div>
          <Link
            to="/"
            className="mt-2 px-8 py-4 bg-white border-2 border-stone-200 rounded-2xl font-black text-stone-700 hover:border-primary hover:text-primary transition-all active:translate-y-1 shadow-sm"
          >
            Gestionar Quiz de la Lección
          </Link>
        </div>
      </div>
    </div>
  )
}

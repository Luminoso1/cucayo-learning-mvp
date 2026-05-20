import { createFileRoute, Link } from '@tanstack/react-router'
import { getLessonFn } from '#/lib/lessons/fn'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import 'highlight.js/styles/github-dark.css'

export const Route = createFileRoute(
  '/_authenticated/student/calderos/$courseSlug/lesson/$lessonSlug/',
)({
  component: RouteComponent,
  loader: async ({ params }) =>
    await getLessonFn({
      data: { lessonSlug: params.lessonSlug },
    }),
})

function RouteComponent() {
  const { data, success, error } = Route.useLoaderData()
  const { courseSlug, lessonSlug } = Route.useParams()

  if (!success) return <div>{error}</div>

  return (
    <div>
      <div className="flex flex-col items-center py-10 px-4">
        {/* 
          - 'prose': Activa los estilos por defecto (h1, p, ul, etc)
          - 'prose-slate': Elige una paleta base para el texto
          - 'max-w-none': Permite que el texto use todo el ancho del contenedor padre
          - 'prose-headings:text-primary': Ejemplo de cómo usar tus variables @theme
      */}
        <section
          className="prose prose-slate max-w-none 
                        prose-headings:text-primary-text
                        prose-p:text-secondary-text
                        prose-a:text-primary
                        prose-strong:text-primary-text"
        >
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
          >
            {data.content}
          </Markdown>
        </section>
        <Link
          to="/student/calderos/$courseSlug/lesson/$lessonSlug/assessment"
          params={{ courseSlug, lessonSlug }}
          className={`max-w-md mt-20 py-4 px-8 rounded-2xl border-2 text-left font-bold transition-all border-primary bg-primary/5 text-primary 
            active:translate-y-1 active:shadow-none disabled:opacity-100`}
        >
          Autoevaluación{' '}
        </Link>
      </div>
    </div>
  )
}

import { createFileRoute, Link } from '@tanstack/react-router'
import { getCourseEditorDetails } from '#/lib/tutor/fn'
import {
  Plus,
  BookOpen,
  FileQuestion,
  MoreVertical,
  LayoutGrid,
  Clock,
} from 'lucide-react'

export const Route = createFileRoute(
  '/_authenticated/tutor/courses/$courseSlug/',
)({
  component: RouteComponent,
  loader: async ({ params }) =>
    getCourseEditorDetails({ data: params.courseSlug }),
})

function RouteComponent() {
  const course = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* course header */}
      <header className="bg-white border-b-2 border-stone-200 pt-10 pb-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-stone-500 font-bold text-sm uppercase tracking-wider">
              <LayoutGrid className="size-4" />
              Gestión de Curso
            </div>
            <h1 className="text-4xl font-black text-stone-900">
              {course.name}
            </h1>
            <p className="text-stone-500 font-medium max-w-2xl">
              {course.description}
            </p>
          </div>

          <div className="flex gap-3">
            <button className="px-6 py-3 bg-primary text-white rounded-2xl font-bold hover:translate-y-1 hover:shadow-none transition-all">
              Nueva Unidad
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-12">
        {course.units.map((unit) => (
          <section key={unit.id} className="space-y-6">
            <div className="flex items-center justify-between border-b-2 border-stone-200 pb-2">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-stone-800">
                  {unit.title}
                </h2>
              </div>
              <button className="flex items-center gap-2 text-primary font-bold hover:underline">
                <Plus className="size-5" />
                Añadir Lección
              </button>
            </div>

            {/* lessons grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unit.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="group bg-white border-2 border-stone-200 rounded-3xl p-5 hover:border-primary transition-all flex flex-col gap-4 relative"
                >
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-stone-100 rounded-2xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <BookOpen className="size-6" />
                    </div>
                    <button className="text-stone-400 hover:text-stone-600">
                      <MoreVertical className="size-5" />
                    </button>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg text-stone-900 line-clamp-1">
                      {lesson.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-stone-500 text-sm font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {lesson.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        <FileQuestion className="size-3" />
                        {lesson.assessments.length > 0
                          ? 'Con Quiz'
                          : 'Sin Quiz'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 mt-auto">
                    <Link
                      to="/tutor/courses/$courseSlug/lesson/$lessonSlug"
                      params={{
                        courseSlug: course.slug,
                        lessonSlug: lesson.slug,
                      }}
                      className="flex-1 text-center py-2 bg-stone-100 hover:bg-stone-200 rounded-xl font-bold text-stone-700 text-sm transition-colors"
                    >
                      Editar Contenido
                    </Link>
                    <Link
                      to="/"
                      className={`flex-1 text-center py-2 rounded-xl font-bold text-sm transition-colors ${
                        lesson.assessments.length > 0
                          ? 'bg-primary/10 text-primary hover:bg-primary/20'
                          : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                      }`}
                    >
                      {lesson.assessments.length > 0
                        ? 'Ver Quiz'
                        : 'Crear Quiz'}
                    </Link>
                  </div>
                </div>
              ))}

              {/* empty card to add lesson */}
              <button className="border-2 border-dashed border-stone-300 rounded-3xl p-10 flex flex-col items-center justify-center gap-3 text-stone-400 hover:border-primary hover:text-primary transition-all group">
                <div className="p-4 bg-stone-50 rounded-full group-hover:bg-primary/5 transition-colors">
                  <Plus className="size-8" />
                </div>
                <span className="font-bold">Nueva Lección</span>
              </button>
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}

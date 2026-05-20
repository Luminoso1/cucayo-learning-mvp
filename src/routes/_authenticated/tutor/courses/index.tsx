import { createFileRoute, Link } from '@tanstack/react-router'
import { getTutorCourses } from '#/lib/tutor/fn'
import { BookOpen, Users, Clock, ChevronRight } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/tutor/courses/')({
  component: RouteComponent,
  loader: async () => getTutorCourses(),
})

function RouteComponent() {
  const courses = Route.useLoaderData()
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              to="/tutor/courses/$courseSlug"
              params={{ courseSlug: course.slug }}
              className="group bg-white border-2 border-stone-200 rounded-3xl overflow-hidden hover:border-primary transition-all flex flex-col"
            >
              <div
                className={`h-24 p-6 flex items-end justify-end transition-colors ${course.theme?.badgeBg ?? 'bg-stone-200'}`}
              >
                <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-sm">
                  <BookOpen
                    className={`w-6 h-6 ${course.theme?.badgeText ?? 'text-stone-700'}`}
                  />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col">
                <div>
                  <h3
                    className={`text-xl font-bold text-stone-900 group-hover:text-primary transition-colors`}
                  >
                    {course.name}
                  </h3>
                  <p className="text-stone-500 line-clamp-2 text-sm mt-1">
                    {course.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-stone-600 text-sm font-semibold pt-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {course.hours}h
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {/* Hardcoded por ahora o podrías sumarlo en el serverFn */}
                    0 Estudiantes
                  </div>
                </div>

                <div className="pt-4 mt-auto">
                  <div className="flex items-center justify-between text-primary font-bold">
                    <span>Gestionar contenido</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200">
          <p className="text-stone-400 font-medium text-lg">
            Aún no tienes cursos asignados.
          </p>
        </div>
      )}
    </div>
  )
}

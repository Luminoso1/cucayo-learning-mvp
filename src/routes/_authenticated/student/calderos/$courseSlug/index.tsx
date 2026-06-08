import { createFileRoute, useLoaderData, Link } from '@tanstack/react-router'
import {
  ChevronRight,
  PlayCircle,
  Brain,
  Timer,
  CheckCircle2,
  Lock,
  Donut,
} from 'lucide-react'

export const Route = createFileRoute(
  '/_authenticated/student/calderos/$courseSlug/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useLoaderData({
    from: '/_authenticated/student/calderos/$courseSlug',
  })

  const { course, enrollment, units, canTakeAssessment } = data
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-stone-900 text-3xl md:text-4xl font-black tracking-tight">
            {course.name}
          </h1>
          <p className="text-stone-600 text-lg max-w-2xl">
            {course.description}
          </p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 group">
          <PlayCircle className="group-hover:scale-110 transition-transform" />
          Continuar Cocinando
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {/* Progreso */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden group">
          <Donut className="absolute -right-2 -top-2 size-24 text-primary opacity-5 group-hover:scale-110 transition-transform" />
          <p className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-2">
            Progreso del Caldero
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-stone-900">
              {enrollment?.progress || 0}%
            </p>
            <span className={`text-sm font-medium ${course.theme.badgeText}`}>
              +5% hoy
            </span>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full mt-3">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${course.theme.accentColor}`}
              style={{ width: `${enrollment?.progress || 50}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden group">
          <Brain className="absolute -right-2 -top-2 size-24 text-secondary opacity-5 group-hover:scale-110 transition-transform" />
          <p className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-2">
            Nivel de Maestría
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-stone-900">82%</p>
            <span className={`${course.theme.badgeText} text-sm font-medium`}>
              Top 10%
            </span>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full mt-3">
            <div
              className={`${course.theme.accentColor} h-2 rounded-full w-[82%]`}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden group">
          <Timer className="absolute -right-2 -top-2 size-24 text-stone-400 opacity-5 group-hover:scale-110 transition-transform" />
          <p className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-2">
            Tiempo Invertido
          </p>
          <p className="text-3xl font-black text-stone-900">
            {Math.floor((enrollment?.remainingMinutes || 0) / 60)}h{' '}
            {(enrollment?.remainingMinutes || 0) % 60}m
          </p>
          <p className="text-xs text-stone-400 mt-2 flex items-center gap-1">
            Restantes para completar
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-stone-900">
          Módulos de Aprendizaje
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {units.map(({ id, title, lessons }) => (
            <article
              key={id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden group hover:border-primary/30 transition-all shadow-sm flex flex-col"
            >
              {/* Cabecera de la Unidad */}
              <div className="p-6 bg-stone-50/50 border-b border-stone-100">
                <div className="flex gap-4 items-center">
                  <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Brain className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 leading-tight">
                      {title}
                    </h3>
                    <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mt-1">
                      {lessons?.length || 0} Lecciones
                    </p>
                  </div>
                </div>
              </div>

              {/* Lessons */}
              <div className="p-4 flex-1">
                <div className="space-y-1">
                  {lessons && lessons.length > 0 ? (
                    lessons.map((lesson) => {
                      const { isLocked, isCompleted, title, id } = lesson

                      return (
                        <Link
                          key={id}
                          to="/student/calderos/$courseSlug/lesson/$lessonSlug"
                          params={{
                            courseSlug: course.slug,
                            lessonSlug: lesson.slug,
                          }}
                          className={`${isLocked ? 'cursor-not-allowed pointer-events-none' : ''}`}
                        >
                          <div
                            className={`
              flex items-center justify-between p-2.5 rounded-xl transition-all duration-200
              ${
                isLocked
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-stone-50 cursor-pointer group/lesson'
              }
            `}
                          >
                            <div className="flex items-center gap-3">
                              {/* Icono dinámico según estado */}
                              <div
                                className={`
                size-8 rounded-full flex items-center justify-center transition-colors
                ${
                  isCompleted
                    ? 'bg-green-100 text-green-600'
                    : isLocked
                      ? 'bg-stone-100 text-stone-400'
                      : 'bg-stone-100 text-stone-500 group-hover/lesson:bg-primary/10 group-hover/lesson:text-primary'
                }
              `}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="size-4.5" />
                                ) : isLocked ? (
                                  <Lock className="size-4" />
                                ) : (
                                  <PlayCircle className="size-4.5" />
                                )}
                              </div>

                              {/* Título de la lección */}
                              <span
                                className={`text-sm font-medium transition-colors
                ${isLocked ? 'text-stone-400' : 'text-stone-600 group-hover/lesson:text-stone-900'}
              `}
                              >
                                {title}
                              </span>
                            </div>

                            {/* Badge o Indicador a la derecha */}
                            {!isLocked && (
                              <div className="flex items-center">
                                {isCompleted ? (
                                  <span className="text-[10px] font-bold uppercase tracking-tight text-green-600/70 bg-green-50 px-2 py-0.5 rounded-md">
                                    Listo
                                  </span>
                                ) : (
                                  <ChevronRight className="size-4 text-stone-300 group-hover/lesson:text-primary group-hover/lesson:translate-x-0.5 transition-all" />
                                )}
                              </div>
                            )}
                          </div>
                        </Link>
                      )
                    })
                  ) : (
                    <p className="text-sm text-stone-400 italic p-2">
                      Próximamente...
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {canTakeAssessment ? (
          <Link
            to="/student/calderos/$courseSlug/assessment"
            params={{
              courseSlug: course.slug,
            }}
          >
            <article className="bg-linear-to-r from-primary to-primary/80 text-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-4">
                <Brain className="size-10" />

                <div>
                  <h3 className="font-black text-xl">Examen Final del Curso</h3>

                  <p className="opacity-90">20 preguntas • 60 minutos</p>
                </div>
              </div>
            </article>
          </Link>
        ) : (
          <article className="bg-stone-100 rounded-2xl p-6 border border-stone-200">
            <div className="flex items-center gap-4">
              <Lock className="size-8 text-stone-500" />

              <div>
                <h3 className="font-bold text-stone-700">
                  Examen Final Bloqueado
                </h3>

                <p className="text-stone-500 text-sm">
                  Completa todas las lecciones para desbloquearlo.
                </p>
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  )
}

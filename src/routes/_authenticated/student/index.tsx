import { createFileRoute, useLoaderData, Link } from '@tanstack/react-router'
import {
  Sun,
  Flame,
  TrendingUp,
  BadgeCheck,
  PersonStanding,
  Droplet,
  ChartNoAxesColumnIncreasing,
  ListFilter,
  Code,
  Clock8,
  Star,
  Database,
  Check,
  Cpu,
  Network,
  Shield,
  Fingerprint,
} from 'lucide-react'

const iconMap = {
  Code,
  Database,
  Check,
  Cpu,
  Network,
  Shield,
  Fingerprint,
}

export const Route = createFileRoute('/_authenticated/student/')({
  component: App,
})

function App() {
  const enrollments = useLoaderData({
    from: '/_authenticated/student',
  })

  return (
    <div className="flex flex-col gap-8">
      <header className="pb-6 border-b border-stone-200">
        <h1 className="text-3xl md:text-4xl font-black tracking-wide text-primary-text ">
          Tu Cocina de Aprendizaje
        </h1>
        <p className="text-secondary-text text-lg">
          El Cucayo de hoy es el conocimiento de mañana
        </p>
      </header>

      {/* Estadisticas */}
      <section className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col gap-3 relative overflow-hidden group">
          <div className="absolute -right-2.5 -top-2.5 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-500">
            <Sun className="size-32 text-primary" />
          </div>
          <div className="flex items-center gap-2 text-orange-600">
            <Flame className="text-orange-600" />
            <span className="text-sm font-bold uppercase tracking-wider">
              Racha Solar
            </span>
          </div>
          <div>
            <span className="text-3xl font-black text-primary-text">
              15 Días
            </span>
          </div>
          <div className="flex items-center gap-1 text-secondary text-sm font-medium">
            <TrendingUp />
            <span>¡Estás que ardes!</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col gap-3 relative overflow-hidden group">
          <div className="absolute -right-2.5 -top-2.5 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-500">
            <PersonStanding className="size-32 text-secondary" />
          </div>
          <div className="flex items-center gap-2 text-secondary">
            <BadgeCheck className="" />
            <span className="text-sm font-bold uppercase tracking-wider">
              Nivel Actual
            </span>
          </div>
          <div>
            <span className="text-3xl font-black text-primary-text">
              Cultivador Jr.
            </span>
          </div>
          <div className="text-secondary text-sm font-medium">
            <span>+150 XP para subir</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col gap-3 relative overflow-hidden group">
          <div className="absolute -right-2.5 -top-2.5 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-500">
            <Droplet className="size-28 text-blue-500" />
          </div>
          <div className="flex items-center gap-2 text-orange-600">
            <ChartNoAxesColumnIncreasing className="text-blue-500" />
            <span className="text-sm font-bold uppercase tracking-wider text-blue-500">
              Caldero Semestral
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-primary-text">65%</span>
            <span className="text-sm text-text-secondary-text mb-1">
              completado
            </span>
          </div>

          <div className="w-full h-2 bg-stone-200 rounded-full mt-1 overflow-hidden">
            <div className="w-2/3 h-full bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Tu camino */}

      <section className="bg-white border-stone-200 w-full px-12 py-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Tu Camino del Cucayo</h2>
          <button className="cursor-pointer hover:text-primary transition-colors hover:bg-primary/10 p-3 rounded-full bg-stone-100">
            <ListFilter />
          </button>
        </div>

        <div className="mt-12 relative pl-4 md:pl-8 ">
          {enrollments.map((course, index) => {
            const IconComponent = iconMap[course.icon as keyof typeof iconMap]

            return (
              <Link
                key={course.id}
                to="/student/calderos/$courseSlug"
                params={{ courseSlug: course.courseSlug }}
              >
                <div className="relative pl-4 md:pl-8">
                  {/* Línea vertical */}
                  {index !== enrollments.length - 1 && (
                    <div className="absolute left-6.5 md:left-10.5 top-4 -bottom-2 w-0.5 bg-stone-200" />
                  )}

                  <div className="relative grid grid-cols-[auto_1fr] gap-10 group">
                    {/* ICONO */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`
                  w-14 h-14 md:w-16 md:h-16 
                  rounded-full bg-white border-4 
                  ${course.theme.borderColor}
                  shadow-md flex items-center justify-center 
                  group-hover:scale-110 transition-transform duration-300
                `}
                      >
                        {IconComponent && (
                          <IconComponent className={course.theme.badgeText} />
                        )}
                      </div>
                    </div>

                    {/* CARD */}
                    <div className="pb-10 pt-1">
                      <div
                        className={`
                  relative overflow-hidden rounded-2xl p-5 transition-all
                  ${
                    course.status === 'completed'
                      ? 'bg-stone-50 opacity-80'
                      : 'bg-white border border-primary/30 shadow-sm hover:shadow-md cursor-pointer'
                  }
                `}
                      >
                        {/* Barra lateral de acento */}
                        <div
                          className={`absolute top-0 left-0 w-1.5 h-full ${course.theme.accentColor}`}
                        />

                        <div className="flex justify-between items-start mb-2">
                          <h4
                            className={`
                      text-lg font-bold
                      ${
                        course.status === 'completed'
                          ? 'line-through decoration-2'
                          : ''
                      }
                    `}
                          >
                            {course.name}
                          </h4>

                          <span
                            className={`
                      px-3 py-1 rounded-full text-xs font-bold uppercase
                      ${course.theme.badgeBg}
                      ${course.theme.badgeText}
                    `}
                          >
                            {course.status === 'no_init'
                              ? 'Sin empezar'
                              : course.status === 'in_progress'
                                ? 'En Progreso'
                                : 'Completado'}
                          </span>
                        </div>

                        <p className="text-secondary-text text-sm mb-4">
                          {course.description}
                        </p>

                        {/* Meta info */}
                        <div className="flex items-center gap-4 text-sm text-stone-500">
                          <div className="flex items-center gap-1">
                            <Clock8 className="size-4" />
                            <span>
                              {course.remainingMinutes > 0
                                ? `${course.remainingMinutes} min restantes`
                                : 'Finalizado'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Star className="size-4" />
                            <span>{course.xp} XP</span>
                          </div>
                        </div>

                        {/* Progress bar */}
                        {course.progress > 0 && course.progress < 100 && (
                          <div className="mt-4 w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                            <div
                              className={`${course.theme.accentColor} h-full rounded-full transition-all`}
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}

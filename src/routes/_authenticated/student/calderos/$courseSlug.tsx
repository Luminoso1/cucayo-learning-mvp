import { createFileRoute, Outlet, Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'

import { getCourseDetailFn } from '@/lib/student/fn'

export const Route = createFileRoute(
  '/_authenticated/student/calderos/$courseSlug',
)({
  component: RouteComponent,
  loader: async ({ params }) => {
    const data = await getCourseDetailFn({ data: params.courseSlug })
    return { data }
  },
})

function RouteComponent() {
  const { data } = Route.useLoaderData()

  const { course } = data

  return (
    <div className="flex flex-col max-w-300 flex-1">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm mb-6">
        <Link
          to="/student"
          className="text-stone-500 hover:text-primary transition-colors"
        >
          Dashboard
        </Link>

        <ChevronRight className="size-3 text-stone-400" />
        <Link
          to="/student/calderos/$courseSlug"
          params={{ courseSlug: course.slug }}
        >
          <span className="text-primary font-medium">{course.name}</span>
        </Link>
      </nav>

      <Outlet />
    </div>
  )
}

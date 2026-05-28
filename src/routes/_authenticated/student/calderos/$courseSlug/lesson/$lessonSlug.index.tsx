import { createFileRoute } from '@tanstack/react-router'
import { getLessonFn } from '#/lib/lessons/fn'
import 'highlight.js/styles/github-dark.css'
import Lesson from '#/components/lesson'

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

  if (!success) return <div>{error}</div>

  return <Lesson {...data} />
}

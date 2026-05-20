import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/student/calderos/$courseSlug/lesson/$lessonSlug',
)({
  component: () => <Outlet />,
})

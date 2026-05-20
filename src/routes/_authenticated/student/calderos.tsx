import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/student/calderos')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}

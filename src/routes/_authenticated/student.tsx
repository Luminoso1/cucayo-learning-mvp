import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { getDashboardFn } from '@/lib/student/fn'

export const Route = createFileRoute('/_authenticated/student')({
  beforeLoad: ({ context }) => {
    if (context.user?.role !== 'student') {
      throw redirect({ to: '/' })
    }
  },
  loader: async () => await getDashboardFn(),
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}

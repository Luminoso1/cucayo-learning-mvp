import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import Aside from '@/components/Aside'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="h-screen w-full">
      <Aside />

      <main className="py-6 ml-64 flex-1">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

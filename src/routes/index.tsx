import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (context.user?.role === 'student') {
      throw redirect({ to: '/student' })
    }

    if (context.user?.role === 'teacher') {
      throw redirect({ to: '/tutor/courses' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/"!</div>
}

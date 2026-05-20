import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/student/calderos/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/student/calderos/"!</div>
}

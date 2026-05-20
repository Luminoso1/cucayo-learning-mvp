import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/student/mejores')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/mejores"!</div>
}

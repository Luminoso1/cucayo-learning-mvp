import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/student/configuracion')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/configuracion"!</div>
}

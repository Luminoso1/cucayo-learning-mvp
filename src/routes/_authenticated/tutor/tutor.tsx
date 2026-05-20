import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/tutor/tutor')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>hello</div>
}

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/services')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/services"!</div>
}

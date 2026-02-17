import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/equipment/add')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/equipment/add"!</div>
}

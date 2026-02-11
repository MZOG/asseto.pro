import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/equipment')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/equipment"!</div>
}

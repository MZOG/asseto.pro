import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1 className="font-medium text-sm">Przegląd</h1>
    </div>
  )
}

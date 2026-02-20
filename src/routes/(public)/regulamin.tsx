import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/regulamin')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(public)/regulamin"!</div>
}

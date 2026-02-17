import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/mozliwosci/powiadomienia')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/mozliwosci/powiadomienia"!</div>
}

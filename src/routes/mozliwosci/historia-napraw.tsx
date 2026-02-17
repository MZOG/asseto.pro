import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/mozliwosci/historia-napraw')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/mozliwosci/historia-napraw"!</div>
}

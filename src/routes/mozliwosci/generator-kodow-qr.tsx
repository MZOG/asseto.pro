import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/mozliwosci/generator-kodow-qr')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/mozliwosci/generator-kodow-qr"!</div>
}

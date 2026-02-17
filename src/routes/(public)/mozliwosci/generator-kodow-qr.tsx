import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/mozliwosci/generator-kodow-qr')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/mozliwosci/generator-kodow-qr"!</div>
}

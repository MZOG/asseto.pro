import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/mozliwosci/formularz-zgloszeniowy')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/mozliwosci/formularz-zgloszeniowy"!</div>
}

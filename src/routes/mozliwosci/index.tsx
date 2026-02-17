import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/mozliwosci/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <section className="px-5 mx-auto max-w-5xl">Hello "/faq"!</section>
}

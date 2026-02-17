import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/kontakt')({
  component: RouteComponent,
})

function RouteComponent() {
  return <section className="px-5 mx-auto max-w-5xl">Hello "/kontakt"!</section>
}

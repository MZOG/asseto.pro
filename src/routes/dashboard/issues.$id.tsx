import { Button } from '@/components/ui/button'
import { useParams } from '@tanstack/react-router'

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/issues/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ from: '/dashboard/issues/$id' })

  return (
    <div>
      <Button variant="success">Oznacz jako sprawna</Button>
    </div>
  )
}

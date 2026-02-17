import { supabase } from '@/utils/supabase'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/equipment/$id')({
  loader: async ({ params }) => {
    const { data: equipment } = await supabase.from('assets').select(`*`).eq('id', params.id).single()
    return { equipment }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { equipment } = Route.useLoaderData()
  return <div>{equipment.name}</div>
}

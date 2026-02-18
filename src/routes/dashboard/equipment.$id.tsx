import { DeleteAssetButton } from '@/components/dashboard/DeleteAssetButton'
import { StatusBadge } from '@/components/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
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
  return <div>
    <Skeleton className="size-50" />
    <h1 className="font-medium mt-4 flex gap-2 items-center">{equipment.name} <StatusBadge status={equipment.status} /></h1>
    <p className="text-sm ">Ostatni serwis: DATA</p>
    <p className="text-sm ">Następny serwis: DATA</p>
    <DeleteAssetButton id={equipment.id} />

  </div>
}

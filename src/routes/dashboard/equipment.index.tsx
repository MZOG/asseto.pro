import { StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'
import { supabase } from '@/utils/supabase'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/equipment/')({
  loader: async () => {
    const { data: equipment, count } = await supabase
      .from('assets')
      .select(`*`, { count: 'exact' })
    return { equipment, count }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { equipment, count } = Route.useLoaderData()

  return (
    <div>
      <h1 className="text-sm font-medium">Maszyny ({count}/15)</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
        {equipment?.map((eq) => (
          <EquipmentCard key={eq.id} props={eq} />
        ))}
      </div>

      <Button size="sm" className="mt-5">
        <Link to="/dashboard/equipment/add" className="text-sm">
          + Dodaj maszynę
        </Link>
      </Button>
    </div>
  )
}

interface EquipmentProps {
  id: string
  name: string
  status: 'working' | 'maintenance' | 'broken'
  created_at: string
  serial_number: string
}

function EquipmentCard({ props }: { props: EquipmentProps }) {
  // dodać typy
  return (
    <Link
      to="/dashboard/equipment/$id"
      params={{ id: props.id }}
      className="border border-gray-100 rounded-md p-3"
    >
      <Skeleton className="size-40 w-full" />
      <h2 className="font-medium mt-3">{props.name}</h2>
      <p className="text-xs text-gray-500 mt-1">
        Dodano: {formatDate(props.created_at, false)}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Numer seryjny: {props.serial_number}
      </p>
      {/* <StatusBadge status={props.status} className='mt-2' /> */}
    </Link>
  )
}

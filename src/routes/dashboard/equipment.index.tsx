import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/utils/supabase';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/equipment/')({
  loader: async () => {
    const { data: equipment } = await supabase.from('assets').select(`*`)
    return { equipment }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { equipment } = Route.useLoaderData()

  return (
    <div>
      <h1 className="text-sm font-medium">Maszyny</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
        {equipment?.map((eq) => (
          <EquipmentCard key={eq.id} props={eq} />
        ))}
      </div>

      <Button size="sm" className='mt-5'>
        <Link to="/dashboard/equipment/add" className="text-sm">
          + Dodaj maszynę
        </Link>
      </Button>
    </div>
  )
}

interface EquipmentProps {
  id: string;
  name: string;
  status: string;
}

function EquipmentCard({ props }: { props: EquipmentProps }) { // dodać typy
  return (
    <Link to="/dashboard/equipment/$id" params={{ id: props.id }} className="border rounded-md p-2">
      <Skeleton className="size-40 w-full" />
      <h2 className="font-medium mt-2">{props.name}</h2>
      <p className="text-sm text-muted-foreground">Status: {props.status}</p>
    </Link>
  )
}

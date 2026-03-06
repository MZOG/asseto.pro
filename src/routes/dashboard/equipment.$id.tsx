import { DeleteAssetButton } from '@/components/dashboard/DeleteAssetButton'
import { StatusBadge } from '@/components/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { Field, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/utils/supabase'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/equipment/$id')({
  loader: async ({ params }) => {
    const { data: equipment } = await supabase
      .from('assets')
      .select(`*`)
      .eq('id', params.id)
      .single()
    return { equipment }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { equipment } = Route.useLoaderData()
  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h1 className="font-medium">{equipment.name} </h1>
        <StatusBadge status={equipment.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <Skeleton className="size-50 col-span-1" />

          <div className="mt-5">
            <FieldGroup>
              <Field>
                <Label>Nazwa</Label>
                <Input defaultValue={equipment.name || ''} />
              </Field>

              <Field>
                <Label>Numer seryjny / referencyjny</Label>
                <Input defaultValue={equipment.serial_number || ''} />
              </Field>
            </FieldGroup>
          </div>
        </div>

        <div className="col-span-2">
          <p className="font-medium text-sm">Historia awarii:</p>

          <div className="space-y-2">
            <div className="mt-2">
              <div className="border p-2 rounded-md bg-amber-50 border-amber-300 flex gap-5 items-center">
                <p className="text-xs">22.02.2026</p>
                <p className="text-sm font-medium">Tytuł awarii</p>
              </div>
            </div>

            <div className="mt-2">
              <div className="border p-2 rounded-md bg-amber-50 border-amber-300 flex gap-5 items-center">
                <p className="text-xs">22.02.2026</p>
                <p className="text-sm font-medium">Tytuł awarii</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <DeleteAssetButton id={equipment.id} />
      </div>
    </div>
  )
}

import IssueCard from '@/components/dashboard/IssueCard'
import { supabase } from '@/utils/supabase'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/issues/archive')({
  loader: async () => {
    const { data: issues } = await supabase.from('issues').select(`
        *,
        assets!issues_asset_id_fkey (
          name
        )
      `).eq('status', 'closed')
    return { issues }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { issues } = Route.useLoaderData()

  return (
    <div>
      <h1 className="font-medium text-sm">Archiwum awarii</h1>

      <div className="space-y-2 mt-5">
        {issues?.map((issue) => {
          return (
            <IssueCard key={issue.id} issue={issue} />
          )
        })}
      </div>

    </div>
  )
}

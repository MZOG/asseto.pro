// app/routes/dashboard.issues.tsx
import IssueCard from '@/components/dashboard/IssueCard'
import { Button } from '@/components/ui/button'
import { supabase } from '@/utils/supabase'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/issues/')({
  loader: async () => {
    const { data: issues } = await supabase.from('issues').select(`
      *,
      assets!issues_asset_id_fkey (
        name
      )
    `).neq('status', 'closed')
    return { issues }
  },
  component: IssuesComponent,
})

function IssuesComponent() {
  const { issues } = Route.useLoaderData()

  return (
    <div>
      <h1 className="font-medium text-sm">Aktywne Awarie</h1>

      <div className="space-y-2 mt-5">
        {issues?.map((issue) => {
          return (
            <IssueCard key={issue.id} issue={issue} />
          )
        })}
      </div>

      <Button size="sm" className='mt-5'>
        <Link to="/dashboard/issues/archive" className="text-sm">
          Zobacz archiwum
        </Link>
      </Button>
    </div>
  )
}

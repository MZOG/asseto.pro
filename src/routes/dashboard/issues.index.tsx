// app/routes/dashboard.issues.tsx
import { Button } from '@/components/ui/button'
import { cn, formatDate } from '@/lib/utils'
import { supabase } from '@/utils/supabase'
import { createFileRoute, Link } from '@tanstack/react-router'
import { TriangleAlert } from 'lucide-react'

export const Route = createFileRoute('/dashboard/issues/')({
  loader: async () => {
    const { data: issues } = await supabase.from('issues').select(`
      *,
      assets!issues_asset_id_fkey (
        name
      )
    `)
    return { issues }
  },
  component: IssuesComponent,
})

function IssuesComponent() {
  const { issues } = Route.useLoaderData()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-medium text-sm">Aktywne Awarie</h1>
        <Button size="sm">
          <Link to="/dashboard/issues/archive" className="text-sm">
            Zobacz archiwum
          </Link>
        </Button>
      </div>
      {/* Lista awarii z bazy Convex */}
      <div className="space-y-2">
        {issues?.map((issue) => {
          return (
            <Link
              key={issue.id}
              to={`/dashboard/issues/${issue.id}`}
              className={cn(
                'block p-3 rounded-md',
                issue.status === 'open'
                  ? 'bg-red-50/70 border border-red-100 hover:bg-red-100/50 space-y-1'
                  : issue.status === 'in_progress'
                    ? 'bg-amber-50 border border-amber-200 hover:bg-amber-100/50'
                    : 'bg-green-50/70 border border-green-100 hover:bg-green-100/50',
              )}
            >
              <div className="flex justify-between items-center">
                <h2 className="flex items-center gap-2 font-medium">
                  <TriangleAlert
                    size={15}
                    className={cn(
                      issue.status === 'open'
                        ? 'text-red-400'
                        : 'text-amber-400',
                    )}
                  />
                  {issue.assets?.name}
                </h2>
                <p className="text-sm">{formatDate(issue.created_at)}</p>
              </div>

              <div className="grid grid-cols-5 mt-3">
                <p className="text-sm col-span-1">Status: {issue.status}</p>

                <div className="text-sm col-span-4">
                  <p className="font-medium">Opis:</p>
                  <p>{issue.description}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

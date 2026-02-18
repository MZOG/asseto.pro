import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { supabase } from '@/utils/supabase'

export const Route = createFileRoute('/dashboard')({
  loader: async () => {
    // count issues
    const { count } = await supabase
      .from('issues')
      .select('*', { count: 'exact', head: true })
      .neq('status', 'closed')
      .order('created_at', { ascending: false })
    // count equipment
    const { count: equipmentCount } = await supabase
      .from('assets')
      .select('*', { count: 'exact', head: true })
    return { issuesCount: count, equipmentCount }
  },
  component: DashboardLayout,
})

import { Cog, TriangleAlert, BookOpen, Factory, FileText, MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { cn } from '@/lib/utils'

function DashboardLayout() {
  const { issuesCount, equipmentCount } = Route.useLoaderData()

  const dashboardLinks = [
    { to: '/dashboard', label: 'Przegląd', icon: BookOpen },
    {
      to: '/dashboard/issues',
      label: 'Awarie',
      icon: TriangleAlert,
      count: issuesCount,
    },
    { to: '/dashboard/equipment', label: 'Maszyny', icon: Factory, count: equipmentCount },
    { to: '/dashboard/questionnaire', label: 'Ankiety', icon: FileText, disabled: true, separator: true },
    { to: '/dashboard/feedback', label: 'Opinie', icon: MessageSquare, disabled: true }
  ]

  return (
    <>
    <DashboardHeader />
    <section className="px-5 mx-auto max-w-6xl mt-5">
      <div className=" flex gap-5  h-full">
        {/* SIDEBAR */}
        <aside className="bg-white w-64 rounded-xl flex flex-col  h-100 p-5  border border-gray-100">
          <nav className="space-y-2">
            {dashboardLinks.map((link) => {
              return (
                <>
                  {link.separator && <div className='border-t border-gray-100 my-3' />}

                  <Link
                    key={link.label}
                    to={link.to}
                    disabled={link.disabled}
                    className={cn('text-sm py-1 rounded flex items-center gap-2', link.disabled && 'opacity-50 cursor-not-allowed')}
                  >
                    <link.icon size={16} />
                    <span className="hover:underline">{link.label}</span>
                    {link.disabled && <span className='text-xs ml-auto'>(wkrótce)</span>}
                    {link.count && <p className='text-xs ml-auto'><Badge variant='outline' className='text-[10px]'>{link.count}</Badge></p>}
                  </Link>
                </>
              )
            })}
          </nav>

          <Link
            to="/dashboard/settings"
            className="text-sm py-1 hover:underline rounded mt-auto flex items-center gap-1"
          >
            <Cog size={16} />
            Ustawienia
          </Link>
        </aside>

        <main className="bg-white w-full rounded-xl p-5 border border-gray-100">
          <Outlet /> {/* TUTAJ RENDERUJĄ SIĘ PODSTRONY */}
        </main>
      </div>
    </section>
    </>
  )
}

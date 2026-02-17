import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { supabase } from '@/utils/supabase'

export const Route = createFileRoute('/dashboard')({
  loader: async () => {
    // count issues
    const { count } = await supabase
      .from('issues')
      .select('*', { count: 'exact', head: true })
      .order('created_at', { ascending: false })
    return { issuesCount: count }
  },
  component: DashboardLayout,
})

import { Cog, TriangleAlert, BookOpen, Factory } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

function DashboardLayout() {
  const { issuesCount } = Route.useLoaderData()

  const dashboardLinks = [
    { to: '/dashboard', label: 'Przegląd', icon: BookOpen },
    {
      to: '/dashboard/issues',
      label: 'Awarie',
      icon: TriangleAlert,
      count: issuesCount,
    },
    { to: '/dashboard/equipment', label: 'Maszyny', icon: Factory, count: 31 },
  ]

  return (
    <section className="px-5 mx-auto max-w-6xl mt-5">
      <div className="bg-white border border-dashed rounded-xl p-4 mb-5 text-xs max-w-4xl">
        <p>
          Aplikacja jest w fazie testów, więc jeśli natrafisz na jakiś błąd,
          prosimy o wyrozumiałość i zgłoszenie go do działu IT.
          <span className="block">
            Twoje sugestie są dla nas kluczowe w procesie ulepszania narzędzia.
            Dziękujemy, że jesteś z nami!{' '}
            <Link
              to="/dashboard/feedback"
              className="font-medium text-blue-600 cursor-pointer hover:underline underline-offset-2 bg-blue-50"
            >
              Zgłoś błąd / sugestię
            </Link>
          </span>
        </p>
      </div>
      <div className=" flex gap-5  h-full">
        {/* SIDEBAR */}
        <aside className="bg-white w-64 rounded-xl flex flex-col  h-100 p-5  border border-gray-100">
          <nav className="space-y-2">
            {dashboardLinks.map((link) => {
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-sm py-1 rounded flex items-center gap-2"
                >
                  <link.icon size={16} />
                  <span className="hover:underline">{link.label}</span>
                  {link.count && <Badge variant="outline">{link.count}</Badge>}
                </Link>
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
  )
}

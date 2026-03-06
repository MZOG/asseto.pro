import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import {
  BookOpen,
  Cog,
  Factory,
  FileText,
  Hammer,
  LogOut,
  MessageSquare,
  TriangleAlert,
  User,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { Field, FieldGroup } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { getSupabaseClient, supabase } from '@/utils/supabase'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    if (typeof window === 'undefined') {
      return
    }

    const client = getSupabaseClient()
    const { data } = await client.auth.getSession()

    if (!data.session) {
      throw redirect({ to: '/logowanie' })
    }
  },
  loader: async () => {
    const client = getSupabaseClient()
    const { data: authData } = await client.auth.getSession()
    const userId = authData.session?.user.id ?? null

    // count issues
    const { count } = await client
      .from('issues')
      .select('*', { count: 'exact', head: true })
      .neq('status', 'closed')
      .order('created_at', { ascending: false })

    // get company name
    let company: { company_name: string | null } | null = null
    if (userId) {
      const { data } = await client
        .from('profiles')
        .select('company_name')
        .eq('id', userId)
        .maybeSingle()
      company = data
    }

    return { issuesCount: count, company, userId }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const { issuesCount, company, userId } = Route.useLoaderData()
  const navigate = useNavigate()
  // const [isSessionChecked, setIsSessionChecked] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  // useEffect(() => {
  //   let active = true

  //   const checkSession = async () => {
  //     const { data } = await supabase.auth.getSession()

  //     if (!data.session) {
  //       navigate({ to: '/logowanie' })
  //       return
  //     }

  //     if (active) {
  //       setIsSessionChecked(true)
  //     }
  //   }

  //   void checkSession()

  //   return () => {
  //     active = false
  //   }
  // }, [navigate])

  const handleSignOut = async () => {
    setIsSigningOut(true)

    const { error } = await supabase.auth.signOut()
    setIsSigningOut(false)

    if (error) {
      toast.error('Nie udało się wylogować.')
      return
    }

    navigate({ to: '/logowanie' })
  }

  const dashboardLinks = [
    { to: '/dashboard', label: 'Przegląd', icon: BookOpen },
    {
      to: '/dashboard/issues',
      label: 'Awarie',
      icon: TriangleAlert,
      count: issuesCount,
    },
    {
      to: '/dashboard/equipment',
      label: 'Maszyny',
      icon: Factory,
    },
    {
      to: '/dashboard/services',
      label: 'Serwisy',
      icon: Hammer,
    },
    {
      to: '/dashboard/questionnaire',
      label: 'Ankiety',
      icon: FileText,
      disabled: true,
      separator: true,
    },
    {
      to: '/dashboard/feedback',
      label: 'Opinie',
      icon: MessageSquare,
      disabled: true,
    },
  ]

  // if (!isSessionChecked) {
  //   return null
  // }

  return (
    <>
      {/* <DashboardHeader /> */}

      {company?.company_name === null && <DialogDemo userId={userId} />}

      <section className="px-5 mx-auto max-w-7xl mt-5">
        <div className=" flex gap-5 h-full">
          {/* SIDEBAR */}
          <aside className="bg-white w-64 rounded-xl self-start flex flex-col h-100 p-5 border border-gray-100">
            <nav className="space-y-2">
              {dashboardLinks.map((link) => {
                return (
                  <React.Fragment key={link.label}>
                    {link.separator && (
                      <div className="border-t border-gray-100 my-3" />
                    )}

                    <Link
                      to={link.to}
                      disabled={link.disabled}
                      className={cn(
                        'text-sm py-1 rounded flex items-center gap-2',
                        link.disabled && 'opacity-50 cursor-not-allowed',
                      )}
                    >
                      <link.icon size={16} />
                      <span className="hover:underline">{link.label}</span>
                      {link.disabled && (
                        <span className="text-xs ml-auto">(wkrótce)</span>
                      )}
                      {link.count && (
                        <p className="text-xs ml-auto">
                          <Badge variant="outline" className="text-[10px]">
                            {link.count}
                          </Badge>
                        </p>
                      )}
                    </Link>
                  </React.Fragment>
                )
              })}
            </nav>

            <div className="mt-auto space-y-2">
              <Link
                to="/dashboard/settings"
                className="text-sm py-1 hover:underline rounded flex items-center gap-1"
              >
                <Cog size={16} />
                Ustawienia
              </Link>
              <Link
                to="/dashboard/profile"
                className="text-sm py-1 hover:underline rounded flex items-center gap-1"
              >
                <User size={16} />
                Mój profil
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-sm py-1 hover:underline rounded flex items-center gap-1 cursor-pointer"
              >
                <LogOut size={16} />
                {isSigningOut ? 'Wylogowywanie...' : 'Wyloguj się'}
              </button>
            </div>
          </aside>

          <main className="bg-white w-full rounded-xl p-5 border border-gray-100 self-start">
            <Outlet />
          </main>
        </div>
      </section>
      <Toaster />
    </>
  )
}

export function DialogDemo({ userId }: { userId: string | null }) {
  const router = useRouter()
  const [companyName, setCompanyName] = useState('')
  const [isOpen, setIsOpen] = useState(true)

  const handleSave = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (!userId) return toast.error('Brak użytkownika w sesji.')
    if (!companyName.trim()) return toast.error('Wpisz nazwę firmy')

    const { error } = await supabase.from('profiles').upsert(
      {
        id: userId,
        company_name: companyName,
      },
      { onConflict: 'id' },
    )

    if (error) {
      toast.error('Coś poszło nie tak. Spróbuj ponownie.')
      console.error(error)
      return
    } else {
      setIsOpen(false)
      toast.success('Nazwa firmy została zapisana!')
      await router.invalidate()
    }
  }
  return (
    <Dialog defaultOpen={isOpen} onOpenChange={setIsOpen}>
      <form>
        <DialogContent
          className="sm:max-w-sm"
          showCloseButton={false}
          onPointerDownOutside={(event) => event.preventDefault()}
          onEscapeKeyDown={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Dodaj nazwę firmy</DialogTitle>
            <DialogDescription>
              Wprowadź nazwę swojej firmy, aby kontynuować.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="company_name">Nazwa firmy</Label>
              <Input
                id="company_name"
                name="company name"
                defaultValue="Moja firma"
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button type="submit" onClick={handleSave}>
              Zapisz
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

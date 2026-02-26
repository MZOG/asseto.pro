import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { supabase } from '@/utils/supabase'
import {
  Cog,
  TriangleAlert,
  BookOpen,
  Factory,
  FileText,
  MessageSquare,
  User,
  LogOut,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { cn } from '@/lib/utils'
import React, { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { SignOutButton } from 'node_modules/@clerk/tanstack-react-start/dist/client/ClerkProvider'

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
import { Field, FieldGroup } from '@/components/ui/field'
import { toast } from 'sonner'
import { useRouter } from '@tanstack/react-router'

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

    // get company name
    const { data: company } = await supabase
      .from('profiles')
      .select('company_name')
      .eq('id', 1)
      .single()
    return { issuesCount: count, equipmentCount, company }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const { issuesCount, equipmentCount, company } = Route.useLoaderData()

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
      count: equipmentCount,
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

  return (
    <>
      <DashboardHeader />

      {company?.company_name === null && <DialogDemo />}

      <section className="px-5 mx-auto max-w-7xl mt-5">
        <div className=" flex gap-5  h-full">
          {/* SIDEBAR */}
          <aside className="bg-white w-64 rounded-xl flex flex-col  h-100 p-5  border border-gray-100">
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

            <div className="mt-auto">
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
              <SignOutButton>
                <span className="text-sm py-1 hover:underline rounded flex items-center gap-1 cursor-pointer">
                  <LogOut size={16} />
                  Wyloguj się
                </span>
              </SignOutButton>
            </div>
          </aside>

          <main className="bg-white w-full rounded-xl p-5 border border-gray-100">
            <Outlet /> {/* TUTAJ RENDERUJĄ SIĘ PODSTRONY */}
          </main>
        </div>
      </section>
      <Toaster />
    </>
  )
}

export function DialogDemo() {
  const router = useRouter()
  const [companyName, setCompanyName] = useState('')
  const [isOpen, setIsOpen] = useState(true)

  const handleSave = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (!companyName.trim()) return toast.error('Wpisz nazwę firmy')

    const { error } = await supabase
      .from('profiles')
      .update({ company_name: companyName })
      .eq('id', 1)

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

import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { supabase } from '@/utils/supabase'

export const Route = createFileRoute('/dashboard/settings')({
  loader: async () => {
    const { data: authData } = await supabase.auth.getSession()
    const userId = authData.session?.user.id ?? null
    const userEmail = authData.session?.user.email ?? null

    if (!userId) {
      return { data: null, userId: null, userEmail }
    }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    return { data, userId, userEmail }
  },
  component: RouteComponent,
})

interface FormDataProps {
  phone: string
  company_name: string
}

function RouteComponent() {
  const { data, userId, userEmail } = Route.useLoaderData()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<FormDataProps>(
    data || {
      phone: '',
      company_name: '',
    },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSave = async () => {
    if (!userId) {
      toast.error('Brak użytkownika w sesji.')
      return
    }

    setIsSaving(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert(
          {
            id: userId,
            email: userEmail,
            ...formData,
          },
          { onConflict: 'id' },
        )

      if (error) throw error

      toast.success('Ustawienia zostały zapisane!')
    } catch (error) {
      console.error('Błąd podczas zapisu:', error)
      toast.error('Wystąpił błąd podczas zapisywania danych.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <p className="text-sm font-medium">Ustawienia</p>

      {/* <div className="flex items-center space-x-2 mt-5">
        <Switch
          id="notification_whatsapp"
          checked={isWhatsAppEnabled}
          onCheckedChange={setIsWhatsAppEnabled}
          disabled
        />
        <Label htmlFor="notification_whatsapp">
          Powiadomienia WhatsApp (dostępne wkrótce)
        </Label>
      </div> */}

      {/* <div className="flex items-center space-x-2 mt-5 group">
        <Switch
          id="notification_telegram"
          checked={isTelegramEnabled}
          onCheckedChange={setIsTelegramEnabled}
        />
        <Label
          htmlFor="notification_telegram"
          className={cn(isTelegramEnabled && 'text-blue-600')}
        >
          Powiadomienia Telegram
        </Label>
      </div> */}

      <div className="space-y-2 mt-5">
        <Label htmlFor="phone" className="font-normal">
          Numer telefonu
        </Label>
        <p className="text-xs text-muted-foreground">
          Dla powiadomień SMS / WhatsApp
        </p>
        <Input
          id="phone"
          name="phone"
          placeholder="np. 739907919"
          className="max-w-xs"
          defaultValue={formData.phone}
          onChange={handleChange}
        />
      </div>

      <Separator className="mt-5" />

      <div className="space-y-2 mt-5">
        <Label htmlFor="company_name" className="font-normal">
          Nazwa firmy
        </Label>
        <Input
          id="company_name"
          name="company_name"
          className="max-w-xs"
          defaultValue={data?.company_name || ''}
          onChange={handleChange}
        />
      </div>

      <Separator className="my-5" />

      <Button onClick={handleSave}>
        {isSaving ? 'Zapisywanie...' : 'Zapisz ustawienia'}
      </Button>
    </div>
  )
}

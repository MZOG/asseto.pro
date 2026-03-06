import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { supabase } from '@/utils/supabase'
import { CheckCircle2, ExternalLink, MessageSquarePlus } from 'lucide-react'
import { sendTelegramNotification } from '@/utils/telegram'
// generate telegram token
const generateToken = () =>
  Math.random().toString(36).substring(2, 10).toUpperCase()

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
      const { error } = await supabase.from('profiles').upsert(
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

  // telegram connect
  const handleConnectTelegram = async () => {
    if (!userId) return

    const paringToken = generateToken()
    const botUsername = 'asseto_notification_bot'

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ telegram_link_token: paringToken })
        .eq('id', userId)
      if (error) throw error

      window.open(`https://t.me/${botUsername}?start=${paringToken}`, '_blank')

      toast.info('Otwarto Telegrama. Kliknij START w aplikacji.')
    } catch (error) {
      toast.error('Nie udało się wygenerować linku.')
    }
  }

  // testowe wysłanie powiadomienia

  const testSend = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('telegram_chat_id')
      .eq('id', userId)
      .single()

    if (data?.telegram_chat_id) {
      try {
        await sendTelegramNotification({
          data: {
            chatId: data.telegram_chat_id,
            message: `🚨 <b>Nowe zgłoszenie usterki!</b>\n\nMaszyna: <b>Leg Press</b>\nStatus: <b>Uszkodzona</b>\n\nOpis: Ej`,
          },
        })
      } catch (err) {
        console.error('Błąd serwera:', err)
      }
    }
  }

  return (
    <div>
      <p className="text-sm font-medium">Ustawienia</p>

      <div className="my-5">
        <Button onClick={testSend} size="sm">
          Testowe powiadomienie
        </Button>
      </div>

      <div className=" mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {/* <MessageSquarePlus className="w-5 h-5 text-blue-500" /> */}
            <Label>Powiadomienia Telegram</Label>
          </div>
          {data?.telegram_chat_id ? (
            <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4" /> Połączono
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Nieaktywne</span>
          )}
        </div>

        {/* <p className="text-xs text-muted-foreground mt-2 mb-4">
          Otrzymuj natychmiastowe info o awariach maszyn prosto na swój telefon.
        </p> */}

        {data?.telegram_chat_id ? (
          <p className="text-xs text-slate-500">
            Twój profil jest sparowany. Powiadomienia będą wysyłane
            automatycznie.
          </p>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-white hover:bg-blue-50 border-blue-200 text-blue-700"
            onClick={handleConnectTelegram}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Połącz z Botem
          </Button>
        )}
      </div>

      <div className="space-y-2 mt-5">
        <Label htmlFor="phone">Numer telefonu</Label>
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
        <Label htmlFor="company_name">Nazwa firmy</Label>
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

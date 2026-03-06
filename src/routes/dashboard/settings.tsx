import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { getSupabaseServerClient, supabase } from '@/utils/supabase'
import { CheckCircle2, ExternalLink } from 'lucide-react'
import { sendTelegramNotification } from '@/utils/telegram'

export const Route = createFileRoute('/dashboard/settings')({
  loader: async ({ context }) => {
    const userId = context.user?.id ?? null
    const userEmail = context.user?.email ?? null

    if (!userId) {
      return { data: null, userId: null, userEmail }
    }

    console.log(userId)

    const client =
      typeof window === 'undefined' ? await getSupabaseServerClient() : supabase

    const { data } = await client
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
    data || { phone: '', company_name: '' },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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
          { id: userId, email: userEmail, ...formData },
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

  const handleConnectTelegram = async () => {
    if (!userId) return

    // ✅ crypto.randomUUID() zamiast Math.random() — kryptograficznie bezpieczny
    const pairingToken = crypto.randomUUID()
    const botUsername = 'asseto_notification_bot'

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ telegram_link_token: pairingToken })
        .eq('id', userId)

      if (error) throw error

      window.open(`https://t.me/${botUsername}?start=${pairingToken}`, '_blank')
      toast.info('Otwarto Telegrama. Kliknij START w aplikacji.')
    } catch {
      toast.error('Nie udało się wygenerować linku.')
    }
  }

  // ✅ Widoczny tylko w trybie dev
  const testSend = async () => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('telegram_chat_id')
      .eq('id', userId)
      .single()

    if (profile?.telegram_chat_id) {
      try {
        await sendTelegramNotification({
          data: {
            chatId: profile.telegram_chat_id,
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

      {/* ✅ Tylko w dev */}
      {import.meta.env.DEV && (
        <div className="my-5">
          <Button onClick={testSend} size="sm">
            Testowe powiadomienie
          </Button>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <Label>Powiadomienia Telegram</Label>
          {data?.telegram_chat_id ? (
            <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4" /> Połączono
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Nieaktywne</span>
          )}
        </div>

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

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/dashboard/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  // state for notification settings
  const [isTelegramEnabled, setIsTelegramEnabled] = useState(true)
  const [isWhatsAppEnabled, setIsWhatsAppEnabled] = useState(false)

  return (
    <div>
      <p className="text-sm font-medium">Ustawienia</p>

      <div className="flex items-center space-x-2 mt-5">
        <Switch
          id="notification_whatsapp"
          checked={isWhatsAppEnabled}
          onCheckedChange={setIsWhatsAppEnabled}
          disabled
        />
        <Label htmlFor="notification_whatsapp">
          Powiadomienia WhatsApp (dostępne wkrótce)
        </Label>
      </div>

      <div className="flex items-center space-x-2 mt-5 group">
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
      </div>

      <div className="space-y-2 mt-5">
        <Label htmlFor="notification_phone" className="font-normal">
          Nazwa użytkownika Telegram
        </Label>
        <Input
          id="notification_phone"
          name="notification_phone"
          placeholder="np. mrcn93"
          className="max-w-xs"
        />
      </div>

      <Separator className="mt-5" />
    </div>
  )
}

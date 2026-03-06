import { supabase } from '@/utils/supabase'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/telegram-webhook')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const message = body.message

          if (
            message?.text &&
            typeof message.text === 'string' &&
            message.text.startsWith('/start')
          ) {
            const chatId = message.chat.id.toString()
            const parts = message.text.split(' ')
            const token = parts.length > 1 ? parts[1] : null

            if (token) {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('id')
                .eq('telegram_link_token', token)
                .single()

              if (profile && !error) {
                await supabase
                  .from('profiles')
                  .update({
                    telegram_chat_id: chatId,
                    telegram_link_token: null,
                  })
                  .eq('id', profile.id)

                const botToken = process.env.TELEGRAM_BOT_TOKEN
                await fetch(
                  `https://api.telegram.org/bot${botToken}/sendMessage`,
                  {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      chat_id: chatId,
                      text: '✅ <b>Połączono!</b> Będziesz tutaj otrzymywać powiadomienia o uszkodzonych maszynach.',
                      parse_mode: 'HTML',
                    }),
                  },
                )
              }
            }
          }
          return new Response('OK', { status: 200 })
        } catch (error) {
          console.error('Webhook Error:', error)
          return new Response('Error', { status: 500 })
        }
      },
    },
  },
})

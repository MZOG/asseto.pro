import { createServerFn } from '@tanstack/react-start'

export const sendTelegramNotification = createServerFn({ method: 'POST' })
  .inputValidator((data: { chatId: string; message: string }) => data)
  .handler(async ({ data }) => {
    const token = process.env.TELEGRAM_BOT_TOKEN
    const url = `https://api.telegram.org/bot${token}/sendMessage`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: data.chatId,
        text: data.message,
        parse_mode: 'HTML', // pozwala na pogrubienia, linki itp.
      }),
    })

    return response.json()
  })

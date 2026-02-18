import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string, showDay?: boolean) {
  const date = new Date(dateString)

  const formatted = new Intl.DateTimeFormat('pl-PL', {
    weekday: showDay ? 'long' : undefined,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)

  return formatted
}

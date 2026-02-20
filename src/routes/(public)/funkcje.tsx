import ItemCard from '@/components/dashboard/ItemCard'
import { createFileRoute } from '@tanstack/react-router'
import { File, Logs, QrCode, Shapes } from 'lucide-react'

export const Route = createFileRoute('/(public)/funkcje')({
  component: RouteComponent,
})

const features = [
  {
    id: 1,
    title: 'Zarządzanie maszynami',
    icon: Shapes,
    description:
      'Dodawaj, edytuj i usuwaj maszyny w swojej fabryce. Monitoruj ich stan i historię konserwacji.',
    content: {
      features: [
        'Dodawanie nowych maszyn z szczegółowymi informacjami',
        'Edycja istniejących maszyn i aktualizacja danych',
        'Usuwanie maszyn, które nie są już używane',
        'Przeglądanie historii konserwacji i napraw dla każdej maszyny',
      ],
    },
  },
  {
    id: 2,
    title: 'Zgłaszanie awarii',
    icon: QrCode,
    description:
      'Szybko zgłaszaj awarie maszyn, dodając szczegóły i zdjęcia. Ułatwiaj komunikację z zespołem serwisowym.',
    content: {
      features: [
        'Szybkie zgłaszanie awarii z możliwością dodania zdjęć',
        'Dodawanie szczegółowych informacji o awarii, takich jak objawy i czas wystąpienia',
        'Automatyczne powiadomienia dla zespołu serwisowego o nowych zgłoszeniach',
        'Możliwość śledzenia statusu zgłoszenia i komunikacji z serwisem',
      ],
    },
  },
  {
    id: 3,
    title: 'Śledzenie napraw',
    icon: Logs,
    description:
      'Monitoruj postęp naprawy awarii, otrzymuj powiadomienia o statusie i historii napraw.',
    content: {
      features: [
        'Śledzenie postępu naprawy awarii w czasie rzeczywistym',
        'Otrzymywanie powiadomień o zmianie statusu naprawy',
        'Przeglądanie historii napraw dla każdej maszyny',
        'Analiza danych dotyczących częstotliwości awarii i efektywności napraw',
      ],
    },
  },
  {
    id: 4,
    icon: File,
    title: 'Raporty i analizy',
    description:
      'Generuj raporty dotyczące wydajności maszyn, częstotliwości awarii i efektywności napraw.',
    content: {
      features: [
        'Generowanie raportów dotyczących wydajności maszyn',
        'Analiza częstotliwości awarii i identyfikacja problematycznych obszarów',
        'Ocena efektywności napraw i serwisu',
        'Eksport danych do formatu CSV lub PDF dla dalszej analizy',
      ],
    },
  },
]

function RouteComponent() {
  return (
    <section className="px-5 mx-auto max-w-5xl">
      <div className="flex flex-col items-center justify-center max-w-md mx-auto">
        <h1 className="font-display font-bold text-4xl text-center mb-5  bg-linear-to-br from-slate-900 to-slate-500 bg-clip-text text-transparent">
          Funkcje
        </h1>
        <p className="text-center text-muted-foreground">
          Asseto oferuje wszystko, co potrzebne do zarządzania maszynami, oraz
          awariami - bez zbędnej złożoności.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
        {features.map((feature) => (
          <ItemCard key={feature.id} item={feature} />
          // <div key={index} className="border rounded-lg p-5">
          //   <h2 className="font-medium text-lg mb-2">{feature.title}</h2>
          //   <p className="text-muted-foreground">{feature.description}</p>
          // </div>
        ))}
      </div>
    </section>
  )
}

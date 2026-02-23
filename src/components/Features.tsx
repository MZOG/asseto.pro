import { MapPin, QrCode, Logs, Megaphone, CheckCheck } from 'lucide-react'
import ItemCard from './dashboard/ItemCard'

const features = [
  {
    id: 1,
    title: 'Błyskawiczne zgłoszenia',
    description:
      'Użytkownik zgłasza usterkę w 15 sekund, bez pobierania aplikacji i logowania.',
    icon: QrCode,
  },
  {
    id: 2,
    title: 'Precyzyjna lokalizacja',
    description:
      'Kod QR od razu mówi Ci, który konkretnie sprzęt wymaga uwagi. Zero pomyłek.',
    icon: MapPin,
  },
  {
    id: 3,
    title: 'Pełna historia serwisowa',
    description:
      'Wszystkie naprawy i przeglądy w jednym miejscu. Buduj bazę wiedzy o swoim sprzęcie.',
    icon: Logs,
  },
  {
    id: 4,
    title: 'Lepsza komunikacja',
    description:
      'Automatyczne powiadomienia dla serwisu i informacja zwrotna dla zgłaszającego.',
    icon: Megaphone,
  },
  {
    id: 5,
    title: 'Szybkie wdrożenie',
    description:
      'Drukujesz kody, naklejasz i gotowe. System działa natychmiast po wyjęciu z pudełka.',
    icon: CheckCheck,
  },
]

const Features = () => {
  return (
    <section className="max-w-5xl mx-auto px-5 mt-20 md:mt-30">
      <h2 className="font-display font-bold leading-12 text-4xl text-center mb-10 bg-linear-to-br from-slate-900 to-slate-500 bg-clip-text text-transparent">
        Dlaczego Asseto?
      </h2>
      <p className="text-center mb-8">
        Prosty system stworzony z myślą o codziennych potrzebach firm.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {features.map((feature) => (
          <ItemCard key={feature.id} item={feature} />
        ))}
      </div>
    </section>
  )
}

export default Features

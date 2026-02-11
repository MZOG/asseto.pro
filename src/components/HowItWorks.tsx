import { QrCode, Wrench, Pencil } from 'lucide-react'

const items = [
  {
    id: 1,
    icon: QrCode,
    title: 'Zeskanuj kod QR',
    description:
      'Znajdź kod QR na urządzeniu i użyj aparatu w telefonie. Nie potrzebujesz żadnej aplikacji.',
  },
  {
    id: 2,
    icon: Pencil,
    title: 'Opisz problem',
    description:
      'Zaznacz co nie działa lub dodaj zdjęcie. System automatycznie rozpozna, o który sprzęt chodzi.',
  },
  {
    id: 3,
    icon: Wrench,
    title: 'Błyskawiczna reakcja',
    description:
      'Zgłoszenie natychmiast trafia do osoby odpowiedzialnej, a Ty masz pewność, że pomoc jest w drodze.',
  },
]

const HowItWorks = () => {
  return (
    <section className="max-w-6xl mx-auto px-5 mt-30">
      <div className="flex gap-5">
        {items.map((item) => (
          <div key={item.id} className="flex-1 p-7 rounded-xl bg-gray-50">
            <h3 className="font-display font-bold text-xl mb-2 flex items-center gap-3">
              <item.icon strokeWidth={2} size={21} />
              {item.title}
            </h3>
            <p className=" text-gray-600 font-display">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HowItWorks

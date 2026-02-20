import { QrCode, Wrench, Pencil } from 'lucide-react'

const items = [
  {
    id: 1,
    icon: QrCode,
    title: 'Dodaj maszyny w panelu',
    description: 'Dodaj każdą maszynę w panelu administratora',
  },
  {
    id: 2,
    icon: Pencil,
    title: 'Wydrukuj kody QR',
    description: 'Wydrukuj kody QR i przyklej je na maszynach',
  },
  {
    id: 3,
    icon: Wrench,
    title: '',
    description:
      'Zgłoszenie natychmiast trafia do osoby odpowiedzialnej, a Ty masz pewność, że pomoc jest w drodze.',
  },
]

const HowItWorks = () => {
  return (
    <section className="max-w-5xl mx-auto px-5 mt-30">
      <h2 className="font-display font-bold text-4xl text-center mb-10  bg-linear-to-br from-slate-900 to-slate-500 bg-clip-text text-transparent">
        Jak to działa?
      </h2>
      <div className="flex gap-5">
        {items.map((item) => (
          <div key={item.id} className="flex-1 p-7 rounded-xl bg-white border">
            <h3 className="font-medium text-lg mb-2 flex items-center gap-3">
              {/* <item.icon strokeWidth={2} size={21} /> */}
              {item.title}
            </h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HowItWorks

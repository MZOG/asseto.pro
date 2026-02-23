import { QrCode, Wrench, Pencil, Plus, BellDot } from 'lucide-react'
import ItemCard from './dashboard/ItemCard'

const items = [
  {
    id: 1,
    icon: Plus,
    title: 'Dodaj maszyny w panelu',
    description: 'Dodaj każdą maszynę w panelu administratora',
  },
  {
    id: 2,
    icon: QrCode,
    title: 'Wydrukuj kody QR',
    description: 'Wydrukuj kody QR i przyklej je na maszynach',
  },
  {
    id: 3,
    icon: BellDot,
    title: 'Powiadomienia',
    description:
      'Zgłoszenie natychmiast trafia do osoby odpowiedzialnej, a Ty masz pewność, że pomoc jest w drodze.',
  },
]

const HowItWorks = () => {
  return (
    <section className="max-w-5xl mx-auto px-5 mt-20 md:mt-30">
      <h2 className="font-display leading-10 font-bold text-4xl text-center mb-10 bg-linear-to-br from-slate-900 to-slate-500 bg-clip-text text-transparent">
        Jak to działa?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
          // <div key={item.id} className="flex-1 p-7 rounded-xl bg-white border">
          //   <h3 className="text-xl font-smibold mb-2 flex items-center gap-3">
          //     <div className="bg-blue-50 border border-blue-100 inline-flex p-3 rounded-lg">
          //       <item.icon strokeWidth={2} className="size-6 text-blue-500" />
          //     </div>
          //     {item.title}
          //   </h3>
          //   <p>{item.description}</p>
          // </div>
        ))}
      </div>
    </section>
  )
}

export default HowItWorks

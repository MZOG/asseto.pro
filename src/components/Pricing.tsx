import { Check } from 'lucide-react'
import { PricingCard } from './PricingCard'
const packages = [
  {
    name: 'Starter',
    machines: 'do 15 maszyn',
    price: '49 PLN',
    period: ' / mies.',
    target: 'Małe studia treningowe, Crossfit.',
    highlighted: false,
  },
  {
    name: 'Pro',
    machines: 'do 50 maszyn',
    price: '149 PLN',
    period: ' / mies.',
    target: 'Standardowe siłownie, hotele.',
    highlighted: true,
  },
  {
    name: 'Business',
    machines: 'do 200 maszyn',
    price: '399 PLN',
    period: ' / mies.',
    target: 'Duże kluby, małe zakłady produkcyjne.',
    highlighted: false,
  },
  {
    name: 'Enterprise',
    machines: 'nielimitowane',
    price: 'Indywidualnie',
    period: '',
    target: 'Fabryki, sieci siłowni.',
    highlighted: false,
  },
]

const plans = [
  {
    name: 'Start',
    price: '59',
    period: 'zł / miesięcznie',
    description: 'For individuals getting started with the essentials.',
    features: ['Do 15 maszyn', 'Pomoc w konfiguracji', 'Podstawowe raporty'],
    cta: 'Wybierz',
  },
  {
    name: 'Pro',
    price: '199',
    period: 'zł / miesięcznie',
    description: 'For professionals who need more power and flexibility.',
    features: [
      'Do 50 maszyn',
      'Pomoc w konfiguracji',
      'Rozszerzone raporty',
      'Konfigurator kodów QR',
      'Telegram / WhatsApp BOT',
      'Priorytetowe wsparcie',
    ],
    highlighted: true,
    cta: 'Wybierz',
  },
  {
    name: 'Business',
    price: '399',
    period: 'zł / miesięcznie',
    description: 'For growing teams that need collaboration tools.',
    features: [
      'Do 200 maszyn',
      'Pomoc w konfiguracji',
      'Rozszerzone raporty',
      'Konfigurator kodów QR',
      'Telegram / WhatsApp BOT',
      'Priorytetowe wsparcie',
    ],
    cta: 'Wybierz',
  },
]

const Pricing = () => {
  return (
    <section className="max-w-5xl mx-auto px-5 mt-40 mb-20">
      <h2 className="font-display font-bold text-4xl text-center mb-10">
        Cennik
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <PricingCard key={plan.name} {...plan} />
        ))}
      </div>

      {/* Desktop Table */}
      {/* <div className="hidden md:block overflow-hidden rounded-xl border border-border font-display">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Pakiet
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Ilość maszyn
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Cena
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Dla kogo?
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {packages.map((pkg) => (
              <tr
                key={pkg.name}
                className={`transition-colors hover:bg-muted/30 ${
                  pkg.highlighted ? 'bg-primary/5' : ''
                }`}
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold text-lg ${
                        pkg.highlighted ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {pkg.name}
                    </span>
                    {pkg.highlighted && (
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                        Popularny
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {pkg.machines}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="font-bold text-foreground text-lg">
                    {pkg.price}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {pkg.period}
                  </span>
                </td>
                <td className="px-6 py-5 text-muted-foreground">
                  {pkg.target}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

      {/* Mobile Cards */}
      {/* <div className="md:hidden space-y-4">
        {packages.map((pkg) => (
          <div
            key={pkg.name}
            className={`rounded-xl border p-5 ${
              pkg.highlighted
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className={`font-semibold text-xl ${
                  pkg.highlighted ? 'text-primary' : 'text-foreground'
                }`}
              >
                {pkg.name}
              </span>
              {pkg.highlighted && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                  Popularny
                </span>
              )}
            </div>
            <div className="mb-3">
              <span className="font-bold text-2xl text-foreground">
                {pkg.price}
              </span>
              <span className="text-muted-foreground">{pkg.period}</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-4 w-4 text-green-500" />
                {pkg.machines}
              </div>
              <p className="text-muted-foreground pt-2 border-t border-border">
                {pkg.target}
              </p>
            </div>
          </div>
        ))}
      </div> */}
    </section>
  )
}

export default Pricing

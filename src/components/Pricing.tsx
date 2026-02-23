import { PricingCard } from './PricingCard'

const plans = [
  {
    name: 'Darmowe',
    price: '0',
    period: 'zł / miesięcznie',
    description: 'For individuals getting started with the essentials.',
    features: [
      'Do 10 maszyn',
      'Powiadomienia Web',
      'Brak raportów',
      'Brak eksportów',
    ],
    cta: 'Wybierz',
    disabled: false,
  },
  {
    name: 'Pro',
    price: '149',
    period: 'zł / miesięcznie',
    description: 'For professionals who need more power and flexibility.',
    features: [
      'Nielimitowane maszyny',
      'Pomoc w konfiguracji',
      'Rozszerzone raporty',
      'Konfigurator kodów QR',
      'Telegram / WhatsApp BOT',
      'Priorytetowe wsparcie',
    ],
    highlighted: true,
    cta: 'Wybierz',
    disabled: false,
  },
  {
    name: 'Business',
    price: 'Zadzwoń',
    period: 'zł / miesięcznie',
    description: 'For growing teams that need collaboration tools.',
    features: [
      'Multi lokalizacje',
      'Pomoc w konfiguracji',
      'Rozszerzone raporty',
      'Konfigurator kodów QR',
      'Telegram / WhatsApp BOT',
      'Priorytetowe wsparcie',
      'Integracja z innymi systemami',
    ],
    cta: 'Wybierz',
    disabled: true,
  },
]

const Pricing = () => {
  return (
    <section className="max-w-5xl mx-auto px-5 mt-20 md:mt-40 mb-20">
      <h2 className="font-display font-bold text-4xl text-center mb-10 bg-linear-to-br from-slate-900 to-slate-500 bg-clip-text text-transparent">
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

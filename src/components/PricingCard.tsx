import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface PricingCardProps {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  highlighted?: boolean
  cta: string
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  highlighted = false,
  cta,
}: PricingCardProps) {
  return (
    <div className={cn('relative flex flex-col rounded-xl border p-6 lg:p-8')}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">
          Asseto<span className="text-blue-600">{name}</span>
        </h3>
        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight text-card-foreground">
            {price}
          </span>
          <span className="text-sm text-muted-foreground">{period}</span>
        </div>

        {/* <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p> */}
      </div>

      <ul className="mb-8 flex flex-1 flex-col gap-3" role="list">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check
              className={cn('mt-0.5 h-4 w-4 shrink-0 text-blue-600')}
              aria-hidden="true"
            />
            <span className="text-sm text-card-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <Button variant="secondary" className="cursor-pointer" size="lg">
        {cta}
      </Button>
    </div>
  )
}

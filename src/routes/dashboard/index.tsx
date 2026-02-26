import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

const monthlyData = [
  { month: 'Sty', value: 0 },
  { month: 'Lut', value: 2 },
  { month: 'Mar', value: 10 },
  { month: 'Kwi', value: 0 },
  { month: 'Maj', value: 0 },
  { month: 'Cze', value: 23 },
  { month: 'Lip', value: 0 },
  { month: 'Sie', value: 0 },
  { month: 'Wrz', value: 0 },
  { month: 'Paź', value: 0 },
  { month: 'Lis', value: 0 },
  { month: 'Gru', value: 0 },
]
const maxValue = Math.max(...monthlyData.map((d) => d.value))

const serviceMachines = [
  { name: 'Hack Squat', date: '25 Luty 2026' },
  { name: 'Maszyna 2', date: '28 Luty 2026' },
]

function RouteComponent() {
  return (
    <div>
      <h1 className="font-medium text-sm">Przegląd</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* AWARIE */}
        <div>
          <p className="mt-5 mb-3 text-sm">Awarie</p>

          <div className="grid grid-cols-1 gap-5">
            <Card
              title="Aktywne awarie"
              value={1}
              className="bg-amber-50 border border-amber-200 text-amber-700"
            />

            <Card
              title="Zakończone awarie"
              value={0}
              className="bg-green-50 border border-green-200 text-green-700"
            />
          </div>
        </div>

        {/* MASZYNY */}
        <div>
          <p className="mt-5 mb-3 text-sm">Maszyny</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card title="Ilość maszyn" value={2} className="border" />

            <Card title="Sprawne maszyny" value={1} className="border" />
            <Card
              title="Maszyny w konserwacji"
              value={1}
              className="bg-yellow-50 border border-yellow-200 text-yellow-700"
            />
            <Card
              title="Uszkodzone maszyny"
              value={1}
              className="bg-red-50 border border-red-200 text-red-700"
            />
          </div>
        </div>
      </div>

      <Separator className="my-5" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className=" mb-3 text-sm">Serwisy w tym tygodniu</p>
          <p className="text-sm font-medium">Brak serwisów w tym tygodniu.</p>
        </div>
        <div>
          <p className="mb-3 text-sm">Serwisy w tym miesiącu</p>
          <div>
            {serviceMachines.map((machine) => (
              <div
                key={machine.name}
                className="flex items-center justify-between mb-2 border p-2 rounded-md bg-amber-50 border-amber-200 text-amber-700"
              >
                <span className="text-sm">{machine.name}</span>
                <span className="text-xs text-muted-foreground font-medium">
                  {machine.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Separator className="my-5" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="mb-3 text-sm">Trendy miesięczne</p>

          <div className="flex flex-col gap-2">
            {monthlyData.map((item) => {
              const percentage =
                maxValue > 0 ? (item.value / maxValue) * 100 : 0
              return (
                <MonthlyTrendItem
                  key={item.month}
                  month={item.month}
                  value={item.value}
                  percentage={percentage}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

const MonthlyTrendItem = ({
  month,
  value,
  percentage,
}: {
  month: string
  value: number
  percentage: number
}) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-8 text-right">
        {month}
      </span>
      <div className="flex-1 h-6 bg-muted/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="text-xs font-medium w-8">{value}</span>
    </div>
  )
}

const Card = ({
  title,
  value,
  className,
}: {
  title: string
  value: number
  className?: string
}) => {
  return (
    <div className={cn('bg-white rounded-lg p-4', className)}>
      <p className="text-sm">{title}</p>
      <p className="font-semibold text-xl mt-1">{value}</p>
    </div>
  )
}

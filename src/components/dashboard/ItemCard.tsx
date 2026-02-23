import { CheckCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'

interface ItemCardProps {
  item: {
    id: number
    title: string
    description: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    content?: {
      features: string[]
    }
  }
}

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <div key={item.id} className="bg-white border p-7 rounded-xl">
      <div className="space-y-3">
        <div className="bg-blue-50 border border-blue-100 inline-flex p-2 md:p-3 rounded-lg">
          <item.icon className="size-5 md:size-6 text-blue-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 font-display">
          {item.title}
        </h3>
        <p className="text-gray-600  font-display md:max-w-sm md:text-balance">
          {item.description}
        </p>

        {item.content?.features && (
          <Dialog>
            <DialogTrigger className="cursor-pointer hover:underline text-sm font-medium">
              Więcej informacji
            </DialogTrigger>
            <DialogContent className="md:min-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <item.icon className="size-6 text-blue-500 mr-2" />
                  {item.title}
                </DialogTitle>
                <DialogDescription className="text-primary space-y-10 text-left">
                  {item.description}
                </DialogDescription>
                <div className="text-sm text-left">
                  {item.content.features.map((feature, index) => (
                    <div key={index} className="mt-3">
                      <p className="flex items-center gap-2 text-bal">
                        <CheckCircle className="size-5 text-blue-500" />
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}

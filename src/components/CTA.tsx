import { Button } from './ui/button'

export default function CTA() {
  return (
    <div className="mx-auto max-w-xl">
      <h2 className="font-display font-bold text-4xl text-center mb-5">
        Gotowy, aby zacząć?
      </h2>
      <p className="text-center">Załóż konto firmy w kilka minut. Bez opłat.</p>
      <div className="flex justify-center">
        <Button className="rounded-full mt-5" size="lg">
          Utwórz konto
        </Button>
      </div>
    </div>
  )
}

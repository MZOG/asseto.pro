import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/feedback')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <div className="space-y-2">
        <Label htmlFor="message">Zgłoś błąd / sugestię</Label>
        <Textarea
          id="message"
          name="message"
          required
          placeholder="Opisz swój problem lub sugestię..."
          className="min-h-30 mt-5"
        />
        <Button className="mt-2">Wyślij</Button>
      </div>
    </div>
  )
}

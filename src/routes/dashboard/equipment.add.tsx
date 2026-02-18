import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/utils/supabase';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react';

export const Route = createFileRoute('/dashboard/equipment/add')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    serial_number: '',
    status: 'working',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('assets').insert(form);
    setLoading(false);

    if (error) {
      console.error(error);
      return;
    }

    navigate({ to: '/dashboard/equipment' });
  }


  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">
        Dodaj nowy sprzęt
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Nazwa sprzętu</Label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="np. Bieżnia Technogym"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="serial_number">
            Numer seryjny
          </Label>
          <Input
            id="serial_number"
            name="serial_number"
            value={form.serial_number}
            onChange={handleChange}
            placeholder="SN-12345"
          />
        </div>

        <div className="pt-2 flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? 'Zapisywanie...' : 'Dodaj sprzęt'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              navigate({ to: '/dashboard/equipment' })
            }
          >
            Anuluj
          </Button>
        </div>
      </form>
    </div>
  )
}

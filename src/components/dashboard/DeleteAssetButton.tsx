import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { supabase } from '@/utils/supabase'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { Button } from '@/components/ui/button'

export function DeleteAssetButton({ id }: { id: string }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)

    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id)

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    navigate({ to: '/dashboard/equipment' })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          Usuń maszynę
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Usunąć maszynę?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Ta operacja jest nieodwracalna. Maszyna zostanie
            trwale usunięta z systemu.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Anuluj
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Usuwanie...' : 'Usuń'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// src/app/panel/maszyny/[id]/asset-delete-button.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function AssetDeleteButton({ assetId }: { assetId: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    const supabase = createClient();

    // Usuń zdjęcie z Storage jeśli istnieje
    await supabase.storage
      .from("asset-images")
      .remove([
        `${assetId}/main.jpg`,
        `${assetId}/main.png`,
        `${assetId}/main.webp`,
      ]);

    const { error } = await supabase.from("assets").delete().eq("id", assetId);

    if (error) {
      toast.error("Nie udało się usunąć maszyny.");
      setDeleting(false);
      return;
    }

    toast.success("Maszyna usunięta.");
    router.push("/panel/maszyny");
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-gray-400 hover:text-red-500">
          <Trash2 size={15} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Usuń maszynę</DialogTitle>
          <DialogDescription>
            Ta operacja jest nieodwracalna. Wszystkie awarie i dane maszyny
            zostaną usunięte.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={deleting}
          >
            Anuluj
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Loader2 size={14} className="animate-spin mr-1.5" />
                Usuwanie...
              </>
            ) : (
              "Usuń maszynę"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

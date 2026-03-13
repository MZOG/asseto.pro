// src/app/panel/maszyny/dodaj/add-asset-form.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function AddAssetForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [planLoaded, setPlanLoaded] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("profiles")
      .select("plan")
      .single()
      .then(({ data }) => {
        setIsPro(data?.plan === "pro");
        setPlanLoaded(true);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nazwa maszyny jest wymagana.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Brak sesji. Zaloguj się ponownie.");
      setLoading(false);
      return;
    }

    if (!isPro) {
      const { count } = await supabase
        .from("assets")
        .select("id", { count: "exact", head: true })
        .eq("owner_id", user.id);

      if ((count ?? 0) >= 10) {
        toast.error("Osiągnąłeś limit 10 maszyn. Przejdź na plan Pro.");
        setLoading(false);
        return;
      }
    }

    const { data: asset, error: insertError } = await supabase
      .from("assets")
      .insert({
        name: name.trim(),
        serial_number: serialNumber.trim() || null,
        owner_id: user.id,
        status: "working",
      })
      .select("id")
      .single();

    if (insertError || !asset) {
      setError("Nie udało się dodać maszyny. Spróbuj ponownie.");
      setLoading(false);
      return;
    }

    // Redirect na stronę maszyny — tam QR jest już widoczny
    router.push(`/panel/maszyny/${asset.id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      {error && (
        <Alert className="bg-red-50 border-red-200 py-2.5">
          <AlertCircle size={14} className="text-red-500" />
          <AlertDescription className="text-xs text-red-600 ml-1">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-gray-700 text-sm font-medium">
          Nazwa maszyny <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          placeholder="np. Tokarka CNC #3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-blue-500 focus-visible:border-blue-500 h-10"
        />
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="serial_number"
          className="text-gray-700 text-sm font-medium"
        >
          Numer seryjny{" "}
          <span className="text-gray-400 font-normal">(opcjonalnie)</span>
        </Label>
        <Input
          id="serial_number"
          placeholder="np. SN-2024-001"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-blue-500 focus-visible:border-blue-500 h-10"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Anuluj
        </Button>
        <Button
          type="submit"
          disabled={loading || !planLoaded}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin mr-2" />
              Dodawanie...
            </>
          ) : (
            "Dodaj maszynę"
          )}
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import PageHeader from "@/components/panel/page-header";

export default function NoweHasloPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Hasło musi mieć co najmniej 8 znaków.");
      return;
    }

    if (password !== confirm) {
      toast.error("Hasła nie są identyczne.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error("Nie udało się zmienić hasła.");
      setLoading(false);
      return;
    }

    toast.success("Hasło zostało zmienione.");
    router.push("/panel/profil");
  };

  return (
    <section className="max-w-sm">
      <PageHeader title="Nowe hasło" />

      <div className="bg-white border border-gray-200 rounded-xl p-5 mt-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">Nowe hasło</Label>
            <Input
              id="password"
              type="password"
              placeholder="Minimum 8 znaków"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Powtórz hasło</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="Powtórz nowe hasło"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin mr-1.5" />
                Zapisywanie...
              </>
            ) : (
              "Zmień hasło"
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScanLine, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function UstawHasloPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Hasło musi mieć co najmniej 8 znaków.");
      return;
    }

    if (password !== confirm) {
      setError("Hasła nie są identyczne.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("Nie udało się zmienić hasła. Spróbuj ponownie.");
      setLoading(false);
      return;
    }

    toast.success("Hasło zostało zmienione.");
    router.push("/panel");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center">
            <ScanLine size={18} className="text-white" />
          </div>
          <span className="text-gray-900 font-semibold text-lg tracking-tight">
            Asseto
          </span>
        </div>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-900 text-xl font-semibold text-center">
              Nowe hasło
            </CardTitle>
            <CardDescription className="text-gray-500 text-sm text-center">
              Ustaw nowe hasło do swojego konta
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert className="bg-red-50 border-red-200 py-2.5">
                  <AlertCircle size={14} className="text-red-500" />
                  <AlertDescription className="text-xs text-red-600 ml-1">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-gray-700 text-sm font-medium"
                >
                  Nowe hasło
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="min. 8 znaków"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="confirm"
                  className="text-gray-700 text-sm font-medium"
                >
                  Potwierdź hasło
                </Label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="Powtórz nowe hasło"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className="h-10"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin mr-2" />
                    Zapisywanie...
                  </>
                ) : (
                  "Ustaw nowe hasło"
                )}
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}

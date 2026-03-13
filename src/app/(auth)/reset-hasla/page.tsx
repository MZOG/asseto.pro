"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ScanLine, AlertCircle } from "lucide-react";

export default function ResetHaslaPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/panel/ustawienia/nowe-haslo`,
    });

    if (error) {
      setError("Coś poszło nie tak. Spróbuj ponownie.");
      setLoading(false);
      return;
    }

    router.push(`/email?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center">
            <ScanLine size={18} className="text-white" />
          </div>
          <span className="text-gray-900 font-semibold text-lg tracking-tight">
            asseto
          </span>
        </div>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-gray-900 text-xl font-semibold text-center">
              Reset hasła
            </CardTitle>
            <CardDescription className="text-gray-500 text-sm text-center">
              Wyślemy Ci link do ustawienia nowego hasła
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleReset}>
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
                  htmlFor="email"
                  className="text-gray-700 text-sm font-medium"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jan@firma.pl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-blue-500 focus-visible:border-blue-500 h-10"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-5 mt-5">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-10 transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin mr-2" />
                    Wysyłanie...
                  </>
                ) : (
                  "Resetuj hasło"
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Pamiętasz hasło?{" "}
                <Link
                  href="/logowanie"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Zaloguj się
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-gray-400 text-xs mt-6">
          © {new Date().getFullYear()} Asseto. Wszelkie prawa zastrzeżone.
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
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
import { Loader2, ScanLine, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 8) {
      setError("Hasło musi mieć co najmniej 8 znaków.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
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
              Załóż konto
            </CardTitle>
            <CardDescription className="text-gray-500 text-sm text-center">
              Zacznij zarządzać swoimi maszynami
            </CardDescription>
          </CardHeader>

          {success ? (
            <CardContent className="py-6">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                  <CheckCircle2 size={22} className="text-green-600" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium text-sm">
                    Sprawdź skrzynkę
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Wysłaliśmy link aktywacyjny na{" "}
                    <span className="text-blue-600 font-medium">{email}</span>
                  </p>
                </div>
                <Link
                  href="/logowanie"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors mt-2"
                >
                  Wróć do logowania →
                </Link>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleRegister}>
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

                <div className="space-y-1.5">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 text-sm font-medium"
                  >
                    Hasło
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="min. 8 znaków"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-blue-500 focus-visible:border-blue-500 h-10"
                  />
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3 mt-5 pt-5">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-10 transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 size={15} className="animate-spin mr-2" />
                      Rejestracja...
                    </>
                  ) : (
                    "Zarejestruj się"
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Masz już konto?{" "}
                  <Link
                    href="/logowanie"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Zaloguj się
                  </Link>
                </p>
              </CardFooter>
            </form>
          )}
        </Card>

        <p className="text-center text-gray-400 text-xs mt-6">
          © {new Date().getFullYear()} Asseto. Wszelkie prawa zastrzeżone.
        </p>
      </div>
    </div>
  );
}

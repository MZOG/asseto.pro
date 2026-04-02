"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
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
import { Loader2, ScanQrCode, AlertCircle, ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("auth");

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("demo") === "true") {
      setEmail("demo@asseto.pro");
      setPassword("demo123");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(t("loginError"));
      setLoading(false);
      return;
    }

    router.push("/panel"); // routing
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center">
            <ScanQrCode size={18} className="text-white" />
          </div>
          <span className="text-gray-900 font-semibold text-lg tracking-tight">
            Asseto
          </span>
        </div>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-gray-900 text-xl font-semibold text-center">
              {t("login")}
            </CardTitle>
            <CardDescription className="text-gray-500 text-sm text-center">
              {t("loginDescription")}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin} className="">
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
                  placeholder={t("emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-blue-500 focus-visible:border-blue-500 h-10"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 text-sm font-medium"
                  >
                    {t("password")}
                  </Label>
                  <Link
                    href="/reset-hasla"
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline underline-offset-2 transition-colors"
                  >
                    {t("forgotPassword")}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
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
                    Logowanie...
                  </>
                ) : (
                  t("loginButton")
                )}
              </Button>

              <p className=" text-gray-500 text-center">
                {t("noAccount")}{" "}
                <Link
                  href="/rejestracja"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {t("registerButton")}
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-5 flex justify-center">
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft />
              {t("backToHome")}
            </Link>
          </Button>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          © {new Date().getFullYear()} {t("copy")}
        </p>
      </div>
    </div>
  );
}

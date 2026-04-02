import { Link } from "@/i18n/routing";
import { ScanQrCode, Mail, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  const t = await getTranslations("auth");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center">
            <ScanQrCode size={18} className="text-white" />
          </div>
          <span className="text-gray-900 font-semibold text-lg tracking-tight">
            Asseto
          </span>
        </div>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col items-center text-center gap-4">
              {/* Icon */}
              <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                <Mail size={24} className="text-blue-600" />
              </div>

              {/* Text */}
              <div className="space-y-1.5">
                <h2 className="text-gray-900 font-semibold text-lg">
                  {t("checkMail")}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {t("checkMailDescription")}
                </p>
                {email && (
                  <p className="text-blue-600 font-medium text-sm">{email}</p>
                )}
              </div>

              {/* Note */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 w-full">
                <p className="text-gray-500 text-xs leading-relaxed">
                  {t.rich("checkEmailSpam", {
                    strong: (chunks) => (
                      <span className="text-gray-700 font-medium">
                        {chunks}
                      </span>
                    ),
                  })}
                  <span className="block">
                    {t.rich("checkMailExpiry", {
                      strong: (chunks) => (
                        <span className="text-gray-700 font-medium">
                          {chunks}
                        </span>
                      ),
                    })}
                  </span>
                </p>
              </div>

              {/* Back link */}
              <Link
                href="/logowanie"
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors mt-1"
              >
                <ArrowLeft size={13} />
                {t("checkMailBack")}
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-gray-400 text-xs mt-6">
          © {new Date().getFullYear()} {t("copy")}
        </p>
      </div>
    </div>
  );
}

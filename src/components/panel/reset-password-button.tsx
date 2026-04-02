"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";

export default function ResetPasswordButton({ email }: { email: string }) {
  const t = useTranslations("panel.profile.resetPassword");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // TODO: not sure about this
      redirectTo: `${window.location.origin}/auth/callback?next=/ustaw-haslo`,
    });
    if (error) toast.error(t("error"));
    else {
      setSent(true);
      toast.success(t("success"));
    }
    setLoading(false);
  };

  return (
    <Button onClick={handleReset} disabled={loading || sent} variant="outline">
      {loading ? (
        <>
          <Loader2 size={14} className="animate-spin mr-1.5" />
          {t("sending")}
        </>
      ) : sent ? (
        <>
          <Mail size={14} className="mr-1.5" />
          {t("sent")}
        </>
      ) : (
        <>
          <Mail size={14} className="mr-1.5" />
          {t("send")}
        </>
      )}
    </Button>
  );
}

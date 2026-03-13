"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordButton({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/ustaw-haslo`,
    });

    if (error) {
      toast.error("Nie udało się wysłać e-maila.");
    } else {
      setSent(true);
      toast.success("Link do zmiany hasła został wysłany.");
    }

    setLoading(false);
  };

  return (
    <Button onClick={handleReset} disabled={loading || sent} variant="outline">
      {loading ? (
        <>
          <Loader2 size={14} className="animate-spin mr-1.5" />
          Wysyłanie...
        </>
      ) : sent ? (
        <>
          <Mail size={14} className="mr-1.5" />
          Link wysłany
        </>
      ) : (
        <>
          <Mail size={14} className="mr-1.5" />
          Wyślij link do zmiany hasła
        </>
      )}
    </Button>
  );
}

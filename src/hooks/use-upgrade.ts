"use client";

import { useState } from "react";
import { toast } from "sonner";

const stripeCheckout = `/api/stripe/checkout`;
export function useUpgrade() {
  const [loading, setLoading] = useState(false);

  // funkcja asynchroniczna
  const upgrade = async () => {
    setLoading(true); // loader na true
    const res = await fetch(stripeCheckout, {
      method: "POST",
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      toast.error("Nie udało się uruchomić płatności");
      setLoading(false);
    }
  };

  return { upgrade, loading };
}

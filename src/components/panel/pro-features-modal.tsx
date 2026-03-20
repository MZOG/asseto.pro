"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUpgrade } from "@/hooks/use-upgrade";
import { Check, Zap, Loader2 } from "lucide-react";

const features = [
  "Nielimitowane maszyny",
  "Powiadomienia e-mail przy nowej awarii",
  "Powiadomienia Telegram",
  "Edycja etykiet kodu QR",
  "Powiadomienia e-mail do serwisanta",
  "Panel serwisanta z dostępem przez link",
  "Zarządzanie serwisami i przeglądami",
  "Przypomnienia e-mail o zbliżającym się serwisie",
  "Raporty i eksport danych",
  "Priorytetowe wsparcie",
];

export function ProFeaturesModal({ text }: { text?: string }) {
  const { upgrade, loading } = useUpgrade();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="asseto">
          <Zap size={14} />
          {text ? text : "Odblokuj w planie Pro"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              <Zap size={11} /> Pro
            </span>
            Co zawiera plan Pro?
          </DialogTitle>
        </DialogHeader>

        <ul className="space-y-2.5 my-2">
          {features.map((f) => (
            <li
              key={f}
              className="flex items-center gap-2.5 text-sm text-gray-700"
            >
              <Check size={14} className="text-blue-600 shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        <div className="pt-2 border-t border-gray-100">
          <p className="text-center text-lg font-bold text-gray-900 mb-3">
            149 zł{" "}
            <span className="text-sm font-normal text-gray-400">/ miesiąc</span>
          </p>
          <Button
            onClick={upgrade}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin mr-1.5" />
                Przekierowywanie...
              </>
            ) : (
              <>
                <Zap size={14} className="mr-1.5" />
                Przejdź na Pro
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

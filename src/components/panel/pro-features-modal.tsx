"use client";

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
import { useTranslations } from "next-intl";

export function ProFeaturesModal({
  children,
  text,
}: {
  children?: React.ReactNode;
  text?: string;
}) {
  const t = useTranslations("panel.proModal");
  const { upgrade, loading } = useUpgrade();
  const features = t.raw("features") as string[];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ?? (
          <Button variant="asseto">
            <Zap size={14} />
            {text ?? t("defaultText")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              <Zap size={11} /> Pro
            </span>
            {t("title")}
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
            {t("price")}
            <span className="text-sm font-normal text-gray-400">
              {" "}
              {t("period")}
            </span>
          </p>
          <Button
            onClick={upgrade}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin mr-1.5" />
                {t("redirecting")}
              </>
            ) : (
              <>
                <Zap size={14} className="mr-1.5" />
                {t("upgradeButton")}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

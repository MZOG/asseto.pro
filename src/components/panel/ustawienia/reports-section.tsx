"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ProFeaturesModal } from "@/components/panel/pro-features-modal";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  userId: string | null;
  reportIssues: boolean;
  reportServices: boolean;
  isPro: boolean;
}

export function ReportsSettings({
  userId,
  reportIssues,
  reportServices,
  isPro,
}: Props) {
  const [issues, setIssues] = useState(reportIssues);
  const [services, setServices] = useState(reportServices);

  const handleChange = async (
    key: "report_issues" | "report_services",
    value: boolean,
  ) => {
    if (key === "report_issues") setIssues(value);
    else setServices(value);

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ [key]: value })
      .eq("id", userId);

    if (error) {
      toast.error("Nie udało się zapisać.");
      if (key === "report_issues") setIssues(!value);
      else setServices(!value);
    } else {
      toast.success("Zapisano.");
    }
  };

  return (
    <div>
      <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
        Raporty tygodniowe
      </h2>
      <p className="text-xs text-gray-400 mb-4">
        Raport wysyłany jest co poniedziałek rano na Twój adres e-mail.
      </p>

      {!isPro ? (
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
          <Lock size={13} className="text-gray-400 shrink-0" />
          <p className="text-xs text-gray-500 flex-1">
            Raporty tygodniowe dostępne w planie Pro.
          </p>
          <ProFeaturesModal>
            <Button variant="default">
              <Lock size={14} />
              Odblokuj w planie Pro
            </Button>
          </ProFeaturesModal>
        </div>
      ) : (
        <div className="space-y-4 bg-white border border-gray-200 rounded-xl p-5 max-w-lg">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium text-gray-900">
                Raport awarii
              </Label>
              <p className="text-xs text-gray-400 mt-0.5">
                Podsumowanie awarii z ostatniego tygodnia
              </p>
            </div>
            <Switch
              checked={issues}
              onCheckedChange={(v) => handleChange("report_issues", v)}
            />
          </div>
          <div className="border-t border-gray-100" />
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium text-gray-900">
                Raport serwisów
              </Label>
              <p className="text-xs text-gray-400 mt-0.5">
                Wykonane serwisy i zbliżające się terminy
              </p>
            </div>
            <Switch
              checked={services}
              onCheckedChange={(v) => handleChange("report_services", v)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

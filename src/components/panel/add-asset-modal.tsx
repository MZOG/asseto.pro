// src/components/panel/add-asset-modal.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  userId: string;
}

export default function AddAssetModal({ userId }: Props) {
  const t = useTranslations("panel.addAssetModal");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError(t("nameRequired"));
      return;
    }
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data, error: dbError } = await supabase
      .from("assets")
      .insert({
        name: name.trim(),
        serial_number: serialNumber.trim() || null,
        owner_id: userId,
        status: "working",
      })
      .select("id")
      .single();

    if (dbError || !data) {
      toast.error(t("error"));
      setLoading(false);
      return;
    }

    toast.success(t("success"));
    setOpen(false);
    setName("");
    setSerialNumber("");
    setLoading(false);
    router.push(`/panel/maszyny/${data.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus size={14} />
          {t("trigger")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">
              {t("name")} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder={t("namePlaceholder")}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              className={
                error ? "border-red-400 focus-visible:ring-red-400" : ""
              }
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="serial">{t("serialNumber")}</Label>
            <Input
              id="serial"
              placeholder={t("serialNumberPlaceholder")}
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin mr-1.5" />
                {t("adding")}
              </>
            ) : (
              t("add")
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, MessageSquarePlus, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";

export default function FeedbackButton() {
  const t = useTranslations("panel.feedback");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error(t("errorEmpty"));
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase.from("feedback").insert({
      message: message.trim(),
      user_id: user?.id ?? null,
      user_email: user?.email ?? null,
    });
    if (error) {
      toast.error(t("errorSend"));
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setMessage("");
      setSent(false);
    }, 300);
  };

  return (
    <div className="fixed right-0 top-9/10 -translate-y-1/2 z-50">
      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!v) handleClose();
          else setOpen(true);
        }}
      >
        <DialogTrigger asChild>
          <button className="bg-white border cursor-pointer border-gray-200 text-gray-600 hover:text-blue-600 rounded-l-lg px-2 py-3 flex flex-col items-center gap-1.5 group">
            <MessageSquarePlus size={16} className="transition-transform" />
            <span
              className="text-[13px] font-medium tracking-wide"
              style={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                transform: "rotate(180deg)",
              }}
            >
              Feedback
            </span>
          </button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
          </DialogHeader>

          {sent ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                <CheckCircle2 size={22} className="text-green-600" />
              </div>
              <div>
                <p className="text-gray-900 font-medium text-sm">
                  {t("successTitle")}
                </p>
                <p className="text-gray-500 text-xs mt-1">{t("successDesc")}</p>
              </div>
              <Button variant="outline" onClick={handleClose}>
                {t("close")}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">{t("description")}</p>
              <Textarea
                placeholder={t("placeholder")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="resize-none"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                >
                  {t("cancel")}
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 size={13} className="animate-spin mr-1.5" />
                      {t("sending")}
                    </>
                  ) : (
                    t("send")
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function KontaktPage() {
  const t = useTranslations("contactPage");
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors])
      setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = t("errors.nameRequired");
    if (!form.email.trim()) newErrors.email = t("errors.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = t("errors.emailInvalid");
    if (!form.message.trim()) newErrors.message = t("errors.messageRequired");
    else if (form.message.trim().length < 10)
      newErrors.message = t("errors.messageTooShort");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setLoading(true);
    const res = await fetch("/api/kontakt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setServerError(data.error ?? t("errorDefault"));
      setLoading(false);
      return;
    }
    setSent(true);
    setForm({ name: "", company: "", email: "", phone: "", message: "" });
    setLoading(false);
  };

  return (
    <div className="pt-14 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14 text-center">
          <span className="text-xs font-semibold uppercase text-blue-600 mb-3 block">
            {t("badge")}
          </span>
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-gray-500 text-base md:max-w-xl md:mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-6">
              {t("contactInfo")}
            </h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">
                    {t("emailLabel")}
                  </p>
                  <a
                    href="mailto:marcin@asseto.pro"
                    className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
                  >
                    marcin@asseto.pro
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">
                    {t("phoneLabel")}
                  </p>
                  <a
                    href="tel:+48739907919"
                    className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
                  >
                    +48 739 907 919
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <MessageSquare size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">
                    {t("responseTimeLabel")}
                  </p>
                  <p className="text-gray-700 font-medium">
                    {t("responseTime")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-5">
              {t("sendMessage")}
            </h2>

            {sent && (
              <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4 mb-5">
                <CheckCircle2
                  size={18}
                  className="text-green-600 shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    {t("successTitle")}
                  </p>
                  <p className="text-xs text-green-700 mt-0.5">
                    {t("successDesc")}
                  </p>
                </div>
              </div>
            )}

            {serverError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-5">
                <p className="text-sm text-red-700">{serverError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1  gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">
                    {t("name")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder={t("namePlaceholder")}
                    value={form.name}
                    onChange={handleChange}
                    className={
                      errors.name
                        ? "border-red-400 focus-visible:ring-red-400"
                        : ""
                    }
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="company">{t("company")}</Label>
                  <Input
                    id="company"
                    name="company"
                    placeholder={t("companyPlaceholder")}
                    value={form.company}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1  gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">
                    {t("email")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    value={form.email}
                    onChange={handleChange}
                    className={
                      errors.email
                        ? "border-red-400 focus-visible:ring-red-400"
                        : ""
                    }
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">{t("phone")}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder={t("phonePlaceholder")}
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">
                  {t("message")} <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder={t("messagePlaceholder")}
                  value={form.message}
                  onChange={handleChange}
                  className={`resize-none h-30 ${errors.message ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                />
                {errors.message && (
                  <p className="text-xs text-red-500">{errors.message}</p>
                )}
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                data-umami-event="Contact form send"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin mr-1.5" />
                    {t("sending")}
                  </>
                ) : (
                  t("send")
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

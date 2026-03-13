"use client";

import { useState } from "react";
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
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Imię i nazwisko jest wymagane.";
    if (!form.email.trim()) {
      newErrors.email = "Adres e-mail jest wymagany.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Podaj prawidłowy adres e-mail.";
    }
    if (!form.message.trim()) {
      newErrors.message = "Wiadomość jest wymagana.";
    } else if (form.message.trim().length < 10) {
      newErrors.message = "Wiadomość musi mieć co najmniej 10 znaków.";
    }
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
      setServerError(data.error ?? "Nie udało się wysłać wiadomości.");
      setLoading(false);
      return;
    }

    setSent(true);
    setForm({ name: "", company: "", email: "", phone: "", message: "" });
    setLoading(false);
  };

  return (
    <div className="pt-5 mb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header — wycentrowany od md */}
        <div className="mb-14 text-left md:text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3 block">
            Kontakt
          </span>
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">
            Skontaktuj się z nami
          </h1>
          <p className="text-gray-500 text-base md:max-w-md md:mx-auto">
            Masz pytania? Chętnie pomożemy. Odpowiadamy w ciągu 24 godzin.
          </p>
        </div>

        {/* Grid — dane po lewej, formularz po prawej */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Lewa — dane kontaktowe */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-6">
              Dane kontaktowe
            </h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">E-mail</p>
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
                  <p className="text-xs text-gray-400 mb-1">Telefon</p>
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
                  <p className="text-xs text-gray-400 mb-1">Czas odpowiedzi</p>
                  <p className="text-gray-700 font-medium">Do 24 godzin</p>
                </div>
              </div>
            </div>
          </div>

          {/* Prawa — formularz */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-5">
              Wyślij wiadomość
            </h2>

            {sent && (
              <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4 mb-5">
                <CheckCircle2
                  size={18}
                  className="text-green-600 shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Wiadomość wysłana!
                  </p>
                  <p className="text-xs text-green-700 mt-0.5">
                    Odezwiemy się w ciągu 24 godzin.
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">
                    Imię i nazwisko <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Jan Kowalski"
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
                  <Label htmlFor="company">Nazwa firmy</Label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="Firma Sp. z o.o."
                    value={form.company}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">
                    Adres e-mail <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="jan@firma.pl"
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
                  <Label htmlFor="phone">Numer telefonu</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+48 000 000 000"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message">
                  Wiadomość <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="W czym możemy pomóc?"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  className={`resize-none ${errors.message ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                />
                {errors.message && (
                  <p className="text-xs text-red-500">{errors.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin mr-1.5" />
                    Wysyłanie...
                  </>
                ) : (
                  "Wyślij wiadomość"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

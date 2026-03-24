import type { Metadata } from "next";
import Link from "next/link";
import {
  QrCode,
  Smartphone,
  Bell,
  Clock,
  Wrench,
  ShieldCheck,
  TriangleAlert,
  TrendingDown,
  Phone,
  Dumbbell,
  Package,
  Trees,
  ArrowRight,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Asseto dla firm",
  description:
    "Asseto to system do zgłaszania usterek przez kod QR. Idealne dla siłowni, placów zabaw, magazynów i obiektów sportowych. Bez aplikacji, bez rejestracji. Zacznij za darmo.",
  keywords: [
    "zarządzanie usterkami",
    "system zgłoszeń",
    "kod QR usterki",
    "siłownia usterki",
    "plac zabaw zgłoszenia",
    "magazyn awarie",
  ],
  openGraph: {
    title: "Zarządzaj usterkami przez kod QR - Asseto",
    description:
      "Każdy może zgłosić usterkę w 30 sekund. Ty reagujesz zanim problem urośnie. Bez aplikacji, bez rejestracji.",
    images: [
      {
        url: "https://asseto.pro/api/og?title=Zarządzaj usterkami przez kod QR&description=Każdy może zgłosić usterkę w 30 sekund. Ty reagujesz zanim problem urośnie. Bez aplikacji, bez rejestracji.",
        width: 1200,
        height: 630,
      },
    ],
    url: "https://asseto.pro/dla-firm",
    siteName: "Asseto",
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [
      "/api/og?title=Asseto dla firm&description=Każdy może zgłosić usterkę w 30 sekund. Ty reagujesz zanim problem urośnie. Bez aplikacji, bez rejestracji.",
    ],
  },
};

const problems = [
  {
    icon: TriangleAlert,
    title: "Usterki są niezauważane latami",
    desc: "Użytkownicy widzą problem, ale nie wiedzą jak go zgłosić. Odkładają to na później. Uszkodzony sprzęt stoi tygodniami.",
  },
  {
    icon: Phone,
    title: "Telefony i karteczki nie działają",
    desc: "Numery się zmieniają, karteczki giną, maile trafiają do spamu. Informacja o usterce nie dociera do właściwej osoby.",
  },
  {
    icon: TrendingDown,
    title: "Reagujesz za późno",
    desc: "Dowiadujesz się o problemie gdy jest już poważny — albo gdy ktoś się skaleczy. Naprawa kosztuje wtedy wielokrotnie więcej.",
  },
];

const steps = [
  {
    number: "01",
    icon: QrCode,
    title: "Naklejka na urządzeniu",
    desc: "Generujesz kod QR dla każdego urządzenia i drukujesz naklejkę. Zajmuje to 2 minuty.",
  },
  {
    number: "02",
    icon: Smartphone,
    title: "Skan i zgłoszenie",
    desc: "Każdy kto zauważy problem skanuje kod telefonem, opisuje usterkę i opcjonalnie dodaje zdjęcie. Bez aplikacji, bez rejestracji.",
  },
  {
    number: "03",
    icon: Bell,
    title: "Ty reagujesz",
    desc: "Dostajesz e-mail z opisem problemu, zdjęciem i lokalizacją. Zmieniasz status w panelu i zamykasz zgłoszenie gdy naprawione.",
  },
];

const industries = [
  {
    icon: Trees,
    title: "Place zabaw i siłownie plenerowe",
    desc: "Uszkodzona huśtawka, obluzowany drążek, zepsuta ławka — każda usterka może być niebezpieczna. Asseto skraca czas od zgłoszenia do naprawy.",
    tags: ["Parki", "Osiedla", "Gminy"],
  },
  {
    icon: Dumbbell,
    title: "Siłownie i kluby fitness",
    desc: "Zepsuty bieżnik, rower stacjonarny który skrzypi, maszyna z luzem — członkowie widzą problemy, ale rzadko je zgłaszają. Kod QR to zmienia.",
    tags: ["Siłownie", "CrossFit", "Aquaparki"],
  },
  {
    icon: Package,
    title: "Magazyny i logistyka",
    desc: "Wózek widłowy, rampa, brama — awaria w magazynie zatrzymuje pracę. Szybkie zgłoszenie przez QR pozwala zareagować zanim dojdzie do przestoju.",
    tags: ["Magazyny", "Zakłady", "Hale"],
  },
];

const stats = [
  { value: "30 sek", label: "Tyle zajmuje wysłanie zgłoszenia" },
  { value: "0", label: "Aplikacji do zainstalowania" },
  { value: "100%", label: "Działa na każdym smartfonie" },
  { value: "24/7", label: "Zgłoszenia o każdej porze" },
];

const benefits = [
  "Wiesz o problemach zanim zgłosi je inspekcja",
  "Pełna historia awarii dla każdego urządzenia",
  "Powiadomienie e-mail przy każdym nowym zgłoszeniu",
  "Zdjęcie usterki bezpośrednio w zgłoszeniu",
  "Jeden panel dla wszystkich urządzeń i lokalizacji",
  "Możliwość wysłania e-mail do serwisanta jednym kliknięciem",
];

export default function DlaFirmPage() {
  return (
    <div className="bg-zinc-50">
      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-size-[40px_40px] opacity-30" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-xs font-medium text-gray-500 mb-8 ">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Działa bez aplikacji i rejestracji
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-[1.08] tracking-tight mb-6 text-balance">
            Twoi klienci widzą usterki.
            <br />
            <span className="text-blue-600">Ty dowiadujesz się za późno.</span>
          </h1>

          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Asseto to system zgłaszania usterek przez kod QR. Naklejka na
            urządzeniu, skan telefonem, powiadomienie do Ciebie. Koniec z
            usterkami które leżą tygodniami.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700! text-white rounded-xl px-8 shadow-lg shadow-blue-200 h-12 text-base"
            >
              <Link href="/rejestracja">
                Zacznij za darmo
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-xl h-12 text-base px-8"
            >
              <Link href="/cennik">Zobacz cennik</Link>
            </Button>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            Bez karty kredytowej · Plan darmowy do 10 urządzeń
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-3 block">
              Problem
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dlaczego usterki są zgłaszane za późno?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Ludzie zauważają problemy, ale nie mają prostego sposobu żeby to
              zgłosić. Efekt? Ty dowiadujesz się gdy jest już za późno.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {problems.map((p) => (
              <div
                key={p.title}
                className="bg-red-50 border border-red-100 rounded-2xl p-6"
              >
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <p.icon size={20} className="text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROZWIĄZANIE ──────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3 block">
              Rozwiązanie
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Asseto działa w 3 krokach
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Żadnych szkoleń, żadnych aplikacji. Wystarczy smartfon i naklejka.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {steps.map((s) => (
              <div
                key={s.title}
                className="relative bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-200 transition-all"
              >
                <span className="absolute top-5 right-5 text-2xl font-bold text-gray-100">
                  {s.number}
                </span>
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <s.icon size={20} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATYSTYKI ───────────────────────────────────────── */}
      <section className="py-16 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">
                {s.value}
              </p>
              <p className="text-sm text-blue-200">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BRANŻE ───────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3 block">
              Dla kogo
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Działa wszędzie tam gdzie jest sprzęt
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Jeśli masz urządzenia których używają inni ludzie — Asseto jest
              dla Ciebie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {industries.map((ind) => (
              <div
                key={ind.title}
                className="bg-zinc-50 border border-gray-200 rounded-2xl p-6 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
              >
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center mb-4 ">
                  <ind.icon size={20} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {ind.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  {ind.desc}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ind.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KORZYŚCI ─────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3 block">
                Dlaczego Asseto
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Wszystko czego potrzebujesz do zarządzania usterkami
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Prosty panel, powiadomienia e-mail i historia awarii — bez
                wdrożeń, bez szkoleń, bez IT.
              </p>
              <ul className="space-y-3">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle2
                      size={17}
                      className="text-blue-600 shrink-0 mt-0.5"
                    />
                    <span className="text-sm text-gray-700">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mockup panelu */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                <div className="w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center">
                  <Zap size={11} className="text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  Panel Asseto
                </span>
                <span className="ml-auto text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                  3 nowe
                </span>
              </div>
              {[
                {
                  name: "Bieżnia #3",
                  loc: "Strefa cardio",
                  time: "5 min temu",
                  status: "Nowe",
                },
                {
                  name: "Drążek zewnętrzny",
                  loc: "Hala B",
                  time: "2 godz. temu",
                  status: "W serwisie",
                },
                {
                  name: "Wózek widłowy #2",
                  loc: "Magazyn główny",
                  time: "Wczoraj",
                  status: "Zamknięte",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between py-3 ${i < 2 ? "border-b border-gray-100" : ""}`}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {item.loc} · {item.time}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      item.status === "Nowe"
                        ? "bg-red-100 text-red-600"
                        : item.status === "W serwisie"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <ShieldCheck size={13} className="text-green-500" />
                  Wszystkie urządzenia monitorowane
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA KOŃCOWE ──────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <QrCode size={28} className="text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Zacznij zarządzać usterkami dziś
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Pierwsze 10 urządzeń za darmo. Bez karty kredytowej. Konfiguracja
            zajmuje 5 minut.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-10 h-12 text-base shadow-lg shadow-blue-200"
          >
            <Link href="/rejestracja">
              Załóż darmowe konto
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
          <p className="text-xs text-gray-400 mt-4">
            Masz pytania?{" "}
            <Link
              href="/kontakt"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Napisz do nas
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

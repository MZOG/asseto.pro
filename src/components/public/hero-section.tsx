import { LogIn, QrCode, Zap, Shield, BarChart3 } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import DashboardImage from "../../../public/dashboard.png";

const badges = [
  { icon: Zap, label: "Błyskawiczne zgłoszenia" },
  { icon: Shield, label: "Bez instalacji" },
  { icon: BarChart3, label: "Pełna historia" },
];

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="relative max-w-6xl px-5 mx-auto pt-10 pb-16">
        {/* Badge górny */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full ">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Teraz dostępne w wersji beta
          </span>
        </div>

        {/* Nagłówek */}
        <h1 className="text-center text-4xl md:text-5xl font-semibold text-gray-900 leading-[1.1] tracking-tight max-w-3xl mx-auto text-balance">
          Zarządzaj usterkami przez{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-blue-600">kod QR</span>
            <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-100 z-0 rounded" />
          </span>
        </h1>

        <p className="text-center text-gray-500 text-lg mt-6 max-w-xl mx-auto leading-relaxed">
          Pracownik skanuje kod, opisuje problem - Ty reagujesz.{" "}
          <span className="block">Żadnych telefonów, żadnych arkuszy.</span>
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700! text-white rounded-lg px-5 shadow-lg shadow-blue-200"
          >
            <Link href="/rejestracja">Wypróbuj za darmo</Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="rounded-lg">
            <Link href="/logowanie">
              <LogIn size={16} className="mr-1.5" />
              Zaloguj się
            </Link>
          </Button>
        </div>

        {/* Mini badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          {badges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 text-xs text-gray-400"
            >
              <Icon size={13} className="text-gray-400" />
              {label}
            </div>
          ))}
        </div>

        {/* Obrazek */}
        <div className="mt-16 relative">
          {/* Ramka z gradientem */}
          <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-2xl shadow-gray-300/50">
            {/* Pasek tytułowy jak okno przeglądarki */}
            <div className="bg-gray-100 border-b border-gray-200 px-4 py-2.5 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-400 max-w-xs mx-auto text-center">
                  app.asseto.pl/panel
                </div>
              </div>
            </div>
            <Image
              src={DashboardImage}
              alt="Asseto — panel zarządzania awariami"
              className="w-full"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

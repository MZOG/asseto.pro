import HowItWorks from "@/components/public/how-it-works";
import Hero from "@/components/public/hero-section";
import ScanningSteps from "@/components/public/scanning-steps";
import CtaSection from "@/components/public/cta-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Asseto - Zarządzaj usterkami przez kod QR",
  },
  description:
    "Asseto to prosty system do zgłaszania i zarządzania usterkami oparty o kody QR. Bez aplikacji, bez rejestracji. Działa wszędzie — siłownia, hotel, zakład produkcyjny.",
  openGraph: {
    title: "Asseto - Zarządzaj usterkami przez kod QR",
    description:
      "Prosty system zgłaszania usterek przez kod QR. Bez aplikacji, bez rejestracji.",
    images: [
      {
        url: "https://asseto.pro/api/og?title=Zarządzaj usterkami przez kod QR&description=Prosty system zgłaszania usterek przez kod QR. Bez aplikacji, bez rejestracji.",
        width: 1200,
        height: 630,
      },
    ],
    url: "https://asseto.pro",
    siteName: "Asseto",
    locale: "pl_PL",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <ScanningSteps />
      <CtaSection />
    </>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Skontaktuj się z nami - odpowiadamy w ciągu 24 godzin. Napisz e-mail lub wypełnij formularz kontaktowy.",
  openGraph: {
    title: "Kontakt - Asseto",
    description:
      "Masz pytania? Napisz do nas na marcin@asseto.pro lub wypełnij formularz.",
    images: [
      {
        url: "https://asseto.pro/api/og?title=Skontaktuj się z nami&description=Masz pytania? Chętnie pomożemy. Odpowiadamy w ciągu 24 godzin.",
        width: 1200,
        height: 630,
      },
    ],
    url: "https://asseto.pro/kontakt",
    siteName: "Asseto",
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [
      "/api/og?title=Kontakt&description=Masz pytania? Napisz do nas na marcin@asseto.pro lub wypełnij formularz.",
    ],
  },
};

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

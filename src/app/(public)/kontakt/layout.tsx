import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Skontaktuj się z nami - odpowiadamy w ciągu 24 godzin. Napisz e-mail lub wypełnij formularz kontaktowy.",
  openGraph: {
    title: "Kontakt - Asseto",
    description:
      "Masz pytania? Napisz do nas na marcin@asseto.pro lub wypełnij formularz.",
    url: "https://asseto.pro/kontakt",
    siteName: "Asseto",
    locale: "pl_PL",
    type: "website",
  },
};

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://asseto.pro"),
  title: {
    default: "Asseto - Zarządzaj usterkami przez kod QR",
    template: "%s - Asseto",
  },
  description:
    "Prosty system do zgłaszania i zarządzania usterkami oparty o kody QR.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    siteName: "Asseto",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@asseto_pro",
    creator: "@asseto_pro",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className={`${geistSans.className} antialiased bg-zinc-50`}>
        {children}

        <Script
          strategy="afterInteractive"
          src="https://cloud.umami.is/script.js"
          data-website-id="c7f2ec7f-015b-439a-b613-2d22e4e96b6f"
        />
      </body>
    </html>
  );
}

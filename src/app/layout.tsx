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
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="c7f2ec7f-015b-439a-b613-2d22e4e96b6f"
        ></Script>
      </body>
    </html>
  );
}

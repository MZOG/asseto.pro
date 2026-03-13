import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zarządzaj awariami szybko i wygodnie",
  description:
    "Szybkie zgłaszanie awarii przez kod QR, łatwe zarządzanie awariami, serwisami.",
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
      </body>
    </html>
  );
}

// src/app/[locale]/(auth)/rejestracja/layout.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generateSeo } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.resetPassword" });
  return generateSeo({
    title: t("title"),
    description: t("description"),
    locale,
    pathnameKey: "/reset-hasla",
  });
}

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

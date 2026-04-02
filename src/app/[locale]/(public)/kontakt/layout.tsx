import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generateSeo } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  return generateSeo({
    title: t("title"),
    description: t("description"),
    locale,
    pathnameKey: "/kontakt",
  });
}

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import HowItWorks from "@/components/public/how-it-works";
import Hero from "@/components/public/hero-section";
import ScanningSteps from "@/components/public/scanning-steps";
import CtaSection from "@/components/public/cta-section";
import BlogSection from "@/components/public/blog-section";

import { getTranslations } from "next-intl/server";
import { generateSeo } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.index" });

  return generateSeo({
    title: t("title"),
    description: t("description"),
    locale,
    pathnameKey: "/",
    absolute: true,
  });
}

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <ScanningSteps />
      <BlogSection />
      <CtaSection />
    </>
  );
}

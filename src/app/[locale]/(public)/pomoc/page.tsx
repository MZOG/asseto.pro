import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { generateSeo } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "helpPage" });
  return generateSeo({
    title: t("title"),
    description: t("notFound"),
    locale,
    pathnameKey: "/pomoc",
  });
}

export default async function PomocPage() {
  const t = await getTranslations("helpPage");
  const faqs = t.raw("faqs") as { q: string; a: string }[];

  return (
    <div className="pt-14 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12 text-center">
          <span className="text-xs font-semibold uppercase text-blue-600 mb-3 block">
            {t("badge")}
          </span>
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-gray-500 text-base">
            {t("notFound")}{" "}
            <Link
              href="/kontakt"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {t("contact")}
            </Link>
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="bg-white border border-gray-200 rounded-xl px-5 data-[state=open]:border-blue-200"
            >
              <AccordionTrigger className="text-sm font-medium text-gray-900 hover:no-underline py-4 text-left">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-500 leading-relaxed pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

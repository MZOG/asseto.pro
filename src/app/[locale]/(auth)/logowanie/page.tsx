import { Suspense } from "react";
import LoginForm from "@/components/public/login-form";
import {getTranslations} from "next-intl/server";
import {generateSeo} from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo.login' })
  return generateSeo({ title: t('title'), description: t('description'), locale, pathnameKey: '/logowanie' })
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

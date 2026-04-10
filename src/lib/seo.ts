// src/lib/seo.ts
import { Metadata } from "next";
import { routing } from "@/i18n/routing";

const BASE_URL = "https://asseto.pro";

const localeMap: Record<string, string> = {
  pl: "pl_PL",
  en: "en_US",
  de: "de_DE",
};

// Klucz = neutralna ścieżka, wartość = tłumaczenia per locale
// Dodawaj tu nowe ścieżki gdy rozszerzasz routing
const pathnames: Record<string, Partial<Record<string, string>>> = {
  "/": {},
  "/cennik": { pl: "/cennik", en: "/pricing", de: "/preise", fr: "/tarifs" },
  "/blog": {},
  "/kontakt": {
    pl: "/kontakt",
    en: "/contact",
    de: "/kontakt",
  },
  "/pomoc": { pl: "/pomoc", en: "/help", de: "/hilfe", fr: "/aide" },
  "/dla-firm": {
    pl: "/dla-firm",
    en: "/for-business",
    de: "/fuer-unternehmen",
  },
  "/polityka-prywatnosci": {
    pl: "/polityka-prywatnosci",
    en: "/privacy-policy",
    de: "/datenschutz",
  },
  "/regulamin": {
    pl: "/regulamin",
    en: "/terms",
    de: "/agb",
  },
  "/logowanie": {
    pl: "/logowanie",
    en: "/login",
    de: "/anmelden",
  },
  "/rejestracja": {
    pl: "/rejestracja",
    en: "/register",
    de: "/registrieren",
  },
  "/panel": {
    pl: "/panel",
    en: "/dashboard",
    de: "/dashboard",
  },
};

function getLocalizedPath(key: string, locale: string): string {
  const map = pathnames[key];
  if (!map || Object.keys(map).length === 0) return key;
  return map[locale] ?? key;
}

interface SeoProps {
  title: string;
  description: string;
  locale: string;
  pathnameKey?: string;
  absolute?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  pathname?: string;
}

export function generateSeo({
  title,
  description,
  locale,
  pathnameKey = "/",
  absolute = false,
  type = "website",
  publishedTime,
  pathname,
}: SeoProps): Metadata {
  const ogLocale = localeMap[locale] ?? "pl_PL";
  const isDefault = locale === routing.defaultLocale;
  const localizedPath = pathname ?? getLocalizedPath(pathnameKey, locale);

  const url = isDefault
    ? `${BASE_URL}${localizedPath}`
    : `${BASE_URL}/${locale}${localizedPath}`;

  const ogImageUrl = `${BASE_URL}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;

  // Alternate links dla wszystkich obsługiwanych języków
  const languages = Object.fromEntries(
    routing.locales.map((l) => {
      const lPath = getLocalizedPath(pathnameKey, l);
      const lUrl =
        l === routing.defaultLocale
          ? `${BASE_URL}${lPath}`
          : `${BASE_URL}/${l}${lPath}`;
      return [l, lUrl];
    }),
  );

  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      url,
      siteName: "Asseto",
      locale: ogLocale,
      type,
      ...(publishedTime && { publishedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

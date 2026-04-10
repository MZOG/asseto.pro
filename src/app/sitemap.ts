import { routing } from "@/i18n/routing";
import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const BASE_URL = "https://asseto.pro";

const pathnames: Record<string, Partial<Record<string, string>>> = {
  "/": {},
  "/cennik": { pl: "/cennik", en: "/pricing", de: "/preise" },
  "/blog": {},
  "/pomoc": { pl: "/pomoc", en: "/help", de: "/hilfe" },
  "/kontakt": { pl: "/kontakt", en: "/contact", de: "/kontakt" },
  "/dla-firm": {
    pl: "/dla-firm",
    en: "/for-business",
    de: "/fuer-unternehmen",
  },
};

function getLocalizedPath(key: string, locale: string): string {
  const map = pathnames[key];
  if (!map || Object.keys(map).length === 0) return key;
  return map[locale] ?? key;
}

function getUrl(locale: string, path: string): string {
  return locale === routing.defaultLocale
    ? `${BASE_URL}${path}`
    : `${BASE_URL}/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  const staticPages = [
    { key: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { key: "/cennik", priority: 0.9, changeFrequency: "monthly" as const },
    { key: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
    { key: "/pomoc", priority: 0.7, changeFrequency: "monthly" as const },
    { key: "/kontakt", priority: 0.6, changeFrequency: "yearly" as const },
    { key: "/dla-firm", priority: 0.8, changeFrequency: "monthly" as const },
  ];

  for (const page of staticPages) {
    for (const locale of routing.locales) {
      const localizedPath = getLocalizedPath(page.key, locale);
      entries.push({
        url: getUrl(locale, localizedPath),
        priority: page.priority,
        changeFrequency: page.changeFrequency,
      });
    }
  }

  for (const locale of routing.locales) {
    const posts = getAllPosts(locale);
    for (const post of posts) {
      entries.push({
        url: getUrl(locale, `/blog/${post.slug}`),
        lastModified: new Date(post.date),
        priority: 0.7,
        changeFrequency: "monthly" as const,
      });
    }
  }

  return entries;
}

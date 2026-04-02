import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { getAllPosts, getAllCategories } from "@/lib/blog";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { generateSeo } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blogPage" });
  return generateSeo({
    title: t("title"),
    description: t("description"),
    locale,
    pathnameKey: "/blog",
  });
}

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function BlogPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blogPage" });

  const categoryParam = t("categoryParam");
  const kategoria = (await searchParams)[categoryParam];
  const allPosts = getAllPosts(locale);
  const categories = getAllCategories(locale);
  const posts = kategoria
    ? allPosts.filter((p) => p.category === kategoria)
    : allPosts;

  return (
    <div className="pt-14 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <span className="text-xs font-semibold uppercase text-blue-600 mb-3 block">
            Blog
          </span>
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">
            {t("heading")}
          </h1>
          <p className="text-gray-500 text-base max-w-xl mx-auto text-center">
            {t("subheading")}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href="/blog"
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              !kategoria
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            {t("all")} ({allPosts.length})
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={{ pathname: "/blog", query: { [categoryParam]: cat } }}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                kategoria === cat
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {cat} ({allPosts.filter((p) => p.category === cat).length})
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-400 text-sm">{t("empty")}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-blue-200 transition-all"
              >
                {post.image ? (
                  <div className="relative w-full h-44 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                    />
                  </div>
                ) : (
                  <div className="w-full h-44 bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                    <span className="text-4xl">📋</span>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={10} />
                      {post.readingTime}
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">
                    {post.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar size={10} />
                      {new Date(post.date).toLocaleDateString(
                        locale === "en" ? "en-US" : "pl-PL",
                        { day: "numeric", month: "short", year: "numeric" },
                      )}
                    </div>
                    <span className="text-xs font-medium text-blue-600 flex items-center gap-1">
                      {t("read")}
                      <ArrowRight
                        size={11}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

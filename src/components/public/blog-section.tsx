import { Link } from "@/i18n/routing";
import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import { getAllPosts } from "@/lib/blog";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export default async function BlogSection() {
  const locale = await getLocale();
  const t = await getTranslations("landing.blog");
  const posts = getAllPosts(locale).slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-zinc-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-semibold uppercase text-blue-600 mb-3 block">
              Blog
            </span>
            <h2 className="text-3xl font-semibold text-gray-900">
              {t("title")}
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {t("allArticles")} <ArrowRight size={14} />
          </Link>
        </div>

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
                <div className="w-full h-44 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
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
                    {t("read")}{" "}
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

        <div className="flex justify-center mt-8 sm:hidden">
          <Link
            href="/blog"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1.5"
          >
            {t("allArticles")} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

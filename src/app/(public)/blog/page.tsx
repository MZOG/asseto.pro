import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getAllCategories } from "@/lib/blog";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artykuły o zarządzaniu usterkami, utrzymaniu sprzętu i systemach QR dla firm i obiektów.",
  openGraph: {
    title: "Blog - Asseto",
    description:
      "Artykuły o zarządzaniu usterkami, utrzymaniu sprzętu i systemach QR.",
    images: [
      {
        url: "/api/og?title=Blog&description=Artykuły o zarządzaniu usterkami i utrzymaniu sprzętu.",
        width: 1200,
        height: 630,
      },
    ],
  },
};

interface Props {
  searchParams: Promise<{ kategoria?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const { kategoria } = await searchParams;
  const allPosts = getAllPosts();
  const categories = getAllCategories();
  const posts = kategoria
    ? allPosts.filter((p) => p.category === kategoria)
    : allPosts;

  return (
    <div className="pt-14 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3 block">
            Blog
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Wiedza o zarządzaniu usterkami
          </h1>
          <p className="text-gray-500 text-base max-w-xl mx-auto text-center">
            Praktyczne porady, case study i wskazówki dla zarządców obiektów i
            sprzętu.
          </p>
        </div>

        {/* Kategorie */}
        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href="/blog"
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              !kategoria
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            Wszystkie ({allPosts.length})
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/blog?kategoria=${encodeURIComponent(cat)}`}
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

        {/* Lista postów */}
        {posts.length === 0 ? (
          <p className="text-gray-400 text-sm">
            Brak artykułów w tej kategorii.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-blue-200  transition-all"
              >
                {/* Zdjęcie */}
                {post.image ? (
                  <div className="relative w-full h-44 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      priority
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                    />
                  </div>
                ) : (
                  <div className="w-full h-44 bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                    <span className="text-4xl">📋</span>
                  </div>
                )}

                {/* Treść */}
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
                      {new Date(post.date).toLocaleDateString("pl-PL", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <span className="text-xs font-medium text-blue-600 flex items-center gap-1">
                      Czytaj{" "}
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

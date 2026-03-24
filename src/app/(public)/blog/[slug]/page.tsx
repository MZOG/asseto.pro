import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react";
import Image from "next/image";
import remarkGfm from "remark-gfm";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.description)}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [`/api/og?title=${post.title}&description=${post.description}`],
    },
  };
}

const components = {
  h1: (props: any) => (
    <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2" {...props} />
  ),
  p: (props: any) => (
    <p className="text-gray-600 leading-relaxed mb-4" {...props} />
  ),
  ul: (props: any) => (
    <ul
      className="list-disc list-inside space-y-2 mb-4 text-gray-600"
      {...props}
    />
  ),
  ol: (props: any) => (
    <ol
      className="list-decimal list-inside space-y-2 mb-4 text-gray-600"
      {...props}
    />
  ),
  li: (props: any) => <li className="leading-relaxed" {...props} />,
  strong: (props: any) => (
    <strong className="font-semibold text-gray-900" {...props} />
  ),
  a: (props: any) => (
    <a
      className="text-blue-600 hover:text-blue-700 underline underline-offset-2"
      {...props}
    />
  ),
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-blue-200 pl-4 py-1 my-4 text-gray-500 italic"
      {...props}
    />
  ),
  code: (props: any) => (
    <code
      className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono"
      {...props}
    />
  ),
  pre: (props: any) => (
    <pre
      className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto mb-4 text-sm"
      {...props}
    />
  ),
  hr: () => <hr className="border-gray-200 my-8" />,
  table: (props: any) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm border-collapse" {...props} />
    </div>
  ),
  thead: (props: any) => <thead className="bg-gray-50" {...props} />,
  th: (props: any) => (
    <th
      className="text-left px-4 py-2.5 font-semibold text-gray-700 border border-gray-200 text-xs uppercase tracking-wider"
      {...props}
    />
  ),
  td: (props: any) => (
    <td
      className="px-4 py-2.5 text-gray-600 border border-gray-200"
      {...props}
    />
  ),
  tr: (props: any) => (
    <tr
      className="even:bg-gray-50 hover:bg-blue-50/30 transition-colors"
      {...props}
    />
  ),
  // CallToAction: () => (
  //   <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 my-6 text-center">
  //     <p className="text-gray-700 font-medium mb-3">Wypróbuj Asseto za darmo</p>
  //     <a
  //       href="/rejestracja"
  //       className="inline-block bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
  //     >
  //       Zacznij teraz →
  //     </a>
  //   </div>
  // ),
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = allPosts[currentIndex + 1] ?? null;
  const nextPost = allPosts[currentIndex - 1] ?? null;

  return (
    <div className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          Wróć do bloga
        </Link>

        {/* Obrazek główny */}
        {post.image && (
          <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
            />
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
              {post.category}
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar size={11} />
              {new Date(post.date).toLocaleDateString("pl-PL", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={11} />
              {post.readingTime}
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            {post.description}
          </p>

          {post.author && (
            <div className="flex items-center gap-2 mt-6 pt-6 border-t border-gray-100">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {post.author[0]}
              </div>
              <span className="text-sm text-gray-600 font-medium">
                {post.author}
              </span>
            </div>
          )}
        </div>

        {/* Treść */}
        <article className="prose-custom">
          <MDXRemote
            source={post.content}
            components={components}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
              },
            }}
          />
        </article>

        {/* CTA */}
        <div className="mt-12 bg-blue-600 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            Wypróbuj Asseto za darmo
          </h3>
          <p className="text-blue-200 text-sm mb-5">
            Pierwsze 10 urządzeń bez opłat. Konfiguracja zajmuje 5 minut.
          </p>
          <Link
            href="/rejestracja"
            className="inline-block bg-white text-blue-600 font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Zacznij za darmo →
          </Link>
        </div>

        {/* Nawigacja między postami */}
        {(prevPost || nextPost) && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevPost && (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-200 transition-all"
              >
                <p className="text-xs text-gray-400 mb-1">← Poprzedni</p>
                <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {prevPost.title}
                </p>
              </Link>
            )}
            {nextPost && (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-200 transition-all sm:text-right"
              >
                <p className="text-xs text-gray-400 mb-1">Następny →</p>
                <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {nextPost.title}
                </p>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

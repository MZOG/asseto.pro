import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  author?: string;
  readingTime: string;
  content: string;
  image?: string | null;
  published?: boolean;
}

export function getAllPosts(locale = "pl"): BlogPost[] {
  const dir = path.join(BLOG_DIR, locale);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(".mdx", "");
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      const rt = readingTime(content);
      return {
        slug,
        locale,
        title: data.title ?? "",
        description: data.description ?? "",
        date: data.date ?? "",
        category: data.category ?? "",
        author: data.author ?? "Marcin Zogrodnik",
        image: data.image ?? null,
        published: data.published ?? false,
        readingTime: rt.text.replace("min read", "min czytania"),
        content,
      };
    })
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string, locale = "pl"): BlogPost | null {
  const filePath = path.join(BLOG_DIR, locale, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const rt = readingTime(content);

  const post = {
    slug,
    locale,
    title: data.title ?? "",
    description: data.description ?? "",
    date: data.date ?? "",
    category: data.category ?? "",
    author: data.author ?? "Marcin Zogrodnik",
    image: data.image ?? null,
    published: data.published ?? false,
    readingTime: rt.text.replace("min read", "min czytania"),
    content,
  };

  if (!post.published) return null;
  return post;
}

export function getAllCategories(locale = "pl"): string[] {
  const posts = getAllPosts(locale);
  return [...new Set(posts.map((p) => p.category))];
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter((p) => p.category === category);
}

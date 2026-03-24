import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const baseUrl = "https://asseto.pro";

  const staticPages = [
    { url: baseUrl, priority: 1.0, changeFrequency: "weekly" },
    { url: `${baseUrl}/cennik`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${baseUrl}/blog`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${baseUrl}/pomoc`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${baseUrl}/kontakt`, priority: 0.6, changeFrequency: "yearly" },
    { url: `${baseUrl}/dla-firm`, priority: 0.8, changeFrequency: "monthly" },
  ] satisfies MetadataRoute.Sitemap;

  const blogPages = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  return [...staticPages, ...blogPages];
}

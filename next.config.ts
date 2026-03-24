import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  devIndicators: false,
  // images: {
  //   domains: ["app.asseto.pro", "asseto.pro"],
  // },
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "asseto.pro",
      },
    ],
  },
};

export default nextConfig;

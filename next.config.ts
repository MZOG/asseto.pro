import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  devIndicators: false,
  images: {
    domains: ["app.asseto.pro", "asseto.pro"],
  },
};

export default nextConfig;

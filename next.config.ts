import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin({
  requestConfig: "./src/i18n/request.ts",
  middleware: "./src/proxy.ts", // ← wskaż plik ręcznie
});

const nextConfig: NextConfig = {
  reactCompiler: true,
  devIndicators: false,
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

export default withNextIntl(nextConfig);

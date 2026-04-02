import { ScanQrCode } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import type { ComponentProps } from "react";

type Href = ComponentProps<typeof Link>["href"];

export default async function Footer() {
  const t = await getTranslations("footer");
  const links = t.raw("links") as { href: string; label: string }[];

  return (
    <footer className="border-t border-gray-200 bg-white py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center">
            <ScanQrCode size={14} className="text-white" />
          </div>
          <span className="text-gray-900 font-medium tracking-tight">
            Asseto
          </span>
        </Link>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href as Href}
              className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Asseto
        </p>
      </div>
    </footer>
  );
}

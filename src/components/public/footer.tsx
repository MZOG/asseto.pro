// src/components/public/footer.tsx
import { ScanLine } from "lucide-react";
import Link from "next/link";

const links = [
  { href: "/cennik", label: "Cennik" },
  { href: "/pomoc", label: "Pomoc" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/polityka-prywatnosci", label: "Polityka prywatności" },
  { href: "/regulamin", label: "Regulamin" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center">
            <ScanLine size={14} className="text-white" />
          </div>
          <span className="text-gray-900 font-medium tracking-tight">
            Asseto
          </span>
        </Link>

        {/* Linki */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Asseto
        </p>
      </div>
    </footer>
  );
}

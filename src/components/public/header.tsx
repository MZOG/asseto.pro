"use client";

import { ScanLine, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/cennik", label: "Cennik" },
  { href: "/pomoc", label: "Pomoc" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
    });
  }, []);

  return (
    <header className="bg-white/10 backdrop-blur-md fixed top-0 w-full z-30">
      <div className="max-w-6xl px-5 mx-auto py-3.5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-sm flex items-center justify-center">
              <ScanLine size={16} className="text-white" />
            </div>
            <span className="text-gray-900 font-medium text-lg tracking-tight">
              Asseto
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm  hover:text-gray-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <Link
                href="/panel"
                className="text-sm  hover:text-gray-900 transition-colors"
              >
                Panel
              </Link>
            ) : (
              <div className="flex items-center gap-5">
                <Link
                  href="/logowanie"
                  className="text-sm  hover:text-gray-900 transition-colors"
                >
                  Zaloguj się
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-5 py-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block text-sm text-gray-600 hover:text-gray-900 py-2 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2 border-t border-gray-100 mt-2">
            {isLoggedIn ? (
              <Button
                asChild
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
              >
                <Link href="/panel" onClick={() => setMenuOpen(false)}>
                  Panel
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/logowanie" onClick={() => setMenuOpen(false)}>
                    Zaloguj się
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                >
                  <Link href="/rejestracja" onClick={() => setMenuOpen(false)}>
                    Wypróbuj za darmo
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

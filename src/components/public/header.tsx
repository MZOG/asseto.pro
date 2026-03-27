"use client";
import { useTranslations } from "next-intl";
import { ComponentProps, useState } from "react";
import { ScanQrCode, Menu, Zap, LogIn } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
  DrawerTitle,
} from "@/components/ui/drawer";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import LanguageSwitcher from "../language-switcher";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);

  const t = useTranslations("nav");

  type Href = ComponentProps<typeof Link>["href"];

  const links: { href: Href; label: string }[] = [
    { href: "/cennik", label: t("pricing") },
    { href: "/pomoc", label: t("help") },
    { href: "/blog", label: t("blog") },
    { href: "/kontakt", label: t("contact") },
  ];

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
    });
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-md fixed top-0 w-full z-30 border-b border-gray-100">
      <div className="max-w-6xl px-5 mx-auto py-3.5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-sm flex items-center justify-center">
              <ScanQrCode size={16} className="text-white" />
            </div>
            <span className="text-gray-900 font-medium text-lg tracking-tight">
              Asseto
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <Button asChild variant="ghost">
                <Link href="/panel">{t("dashboard")}</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/logowanie">{t("login")}</Link>
                </Button>
              </>
            )}

            <LanguageSwitcher />
          </div>

          {/* Mobile — Drawer */}
          <div className="md:hidden">
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <button className="text-gray-600 hover:text-gray-900 p-1">
                  <Menu size={22} />
                </button>
              </DrawerTrigger>
              <DrawerContent>
                <VisuallyHidden>
                  <DrawerTitle>Menu nawigacji</DrawerTitle>
                </VisuallyHidden>
                <div className="px-6 py-6 space-y-1">
                  {/* Linki */}
                  {links.map((link) => (
                    <DrawerClose asChild key={link.label}>
                      <Link
                        href={link.href}
                        className="flex items-center text-base text-gray-700 hover:text-gray-900 py-3 border-b border-gray-100 last:border-0 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </DrawerClose>
                  ))}

                  {/* CTA */}
                  <div className="pt-4 flex flex-col gap-2">
                    {isLoggedIn ? (
                      <DrawerClose asChild>
                        <Button
                          asChild
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Link href="/panel">Panel</Link>
                        </Button>
                      </DrawerClose>
                    ) : (
                      <>
                        <DrawerClose asChild>
                          <Button asChild variant="outline" className="w-full">
                            <Link href="/logowanie">
                              <LogIn size={15} className="mr-1.5" />
                              Zaloguj się
                            </Link>
                          </Button>
                        </DrawerClose>
                        <DrawerClose asChild>
                          <Button
                            asChild
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Link href="/rejestracja">
                              <Zap size={15} className="mr-1.5" />
                              Wypróbuj za darmo
                            </Link>
                          </Button>
                        </DrawerClose>
                      </>
                    )}
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </header>
  );
}

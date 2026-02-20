'use client'

import React from 'react'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { QrCode, Menu, ChevronDown } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

export default function Header() {
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <header className="border-b fixed top-0 w-full z-30 bg-gray-50/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="font-semibold flex items-center gap-1.5 text-foreground leading-none"
        >
          {/* <QrCode className="h-5 w-5" /> */}
          asseto
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 font-display">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/funkcje"
                    className="inline-flex h-9 items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    Funkcje
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/cennik"
                    className="inline-flex h-9 items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    Cennik
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/kontakt"
                    className="inline-flex h-9 items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    Kontakt
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/login"
                    className="inline-flex h-9 items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    Zaloguj się
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile hamburger */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent transition-colors"
              aria-label="Otworz menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-75 bg-background p-0">
            <SheetHeader className="p-5 pb-0">
              <SheetTitle>
                <Link
                  to="/"
                  onClick={() => setSheetOpen(false)}
                  className="font-semibold flex items-center gap-1.5 text-foreground"
                >
                  Asseto
                </Link>
              </SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col px-3 py-4">
              <MobileLink href="/funkcje" onClick={() => setSheetOpen(false)}>
                Funkcje
              </MobileLink>

              {/* Branze collapsible */}

              <MobileLink href="/cennik" onClick={() => setSheetOpen(false)}>
                Cennik
              </MobileLink>
              <MobileLink href="/kontakt" onClick={() => setSheetOpen(false)}>
                Kontakt
              </MobileLink>

              <div className="mx-2 my-3 h-px bg-border" />

              <MobileLink href="/login" onClick={() => setSheetOpen(false)}>
                Zaloguj sie
              </MobileLink>

              <div className="px-2 pt-1">
                <Link
                  to="/signup"
                  onClick={() => setSheetOpen(false)}
                  className="flex items-center justify-center bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors w-full"
                >
                  Zacznij za darmo
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
    >
      {children}
    </Link>
  )
}


'use client'

import React from 'react'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { QrCode, Menu, ChevronDown } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
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

const branzeLinks = [
  { href: '/branze/silownie', label: 'Siłownie', soon: false },
  { href: '/branze/hotelarstwo', label: 'Hotele', soon: true },
  { href: '/branze/biura', label: 'Biura', soon: true },
  { href: '/branze/przemysl', label: 'Przemysł', soon: true },
]

const mozliwosciLinks = [
  {
    href: '/mozliwosci/generator-kodow-qr',
    label: 'Generator kodów QR',
    soon: false,
  },
  {
    href: '/mozliwosci/formularz-zgloszeniowy',
    label: 'Formularz zgłoszeniowy',
    soon: false,
  },
  { href: '/mozliwosci/powiadomienia', label: 'Powiadomienia', soon: false },
  {
    href: '/mozliwosci/historia-napraw',
    label: 'Historia napraw (logbook)',
    soon: false,
  },
]

export default function Header() {
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <header className="bg-white fixed top-0 w-full z-30">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-4">
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
              {/* Branze dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 px-3 text-sm font-medium text-foreground bg-transparent hover:bg-accent">
                  Branze
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-1 p-2 shadow-none">
                    {branzeLinks.map((link) => (
                      <li key={link.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={link.soon ? '#' : link.href}
                            className={cn(
                              'flex flex-row items-center select-none rounded-md px-3 py-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground',
                              link.soon && 'cursor-not-allowed opacity-50',
                            )}
                          >
                            {link.label}{' '}
                            {link.soon && (
                              <span className="text-xs text-muted-foreground">
                                (wkrótce)
                              </span>
                            )}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 px-3 text-sm font-medium text-foreground bg-transparent hover:bg-accent">
                  Możliwości
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-70 gap-1 p-2">
                    {mozliwosciLinks.map((link) => (
                      <li key={link.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={link.soon ? '#' : link.href}
                            className={cn(
                              'flex flex-row items-center select-none rounded-md px-3 py-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground',
                              link.soon && 'cursor-not-allowed opacity-50',
                            )}
                          >
                            {link.label}{' '}
                            {link.soon && (
                              <span className="text-xs text-muted-foreground">
                                (wkrótce)
                              </span>
                            )}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
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
                    to="/auth/login"
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
                  <QrCode className="h-5 w-5" />
                  Machino
                </Link>
              </SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col px-3 py-4">
              <MobileLink href="/faq" onClick={() => setSheetOpen(false)}>
                Jak to dziala?
              </MobileLink>

              {/* Branze collapsible */}
              <MobileBranzeMenu onNavigate={() => setSheetOpen(false)} />

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
                  to="/auth/signup"
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

function MobileBranzeMenu({ onNavigate }: { onNavigate: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors">
        Branze
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-3 border-l border-border pl-3 py-1">
          <Link
            to="/branze"
            onClick={onNavigate}
            className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            Wszystkie branze
          </Link>
          {branzeLinks.map((link) => (
            <Link
              to={link.href}
              href={link.href}
              onClick={onNavigate}
              className="flex items-center rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// import {
//   SignedIn,
//   SignedOut,
//   SignInButton,
//   SignUpButton,
//   UserButton,
// } from '@clerk/tanstack-react-start'
// import { Link } from '@tanstack/react-router'
// import { QrCode } from 'lucide-react'

// export default function Header() {
//   return (
//     <>
//       <header>
//         <div className="max-w-4xl mx-auto flex items-center justify-between px-5 py-7">
//           <Link to="/" className="font-semibold flex gap-1">
//             <QrCode className="mb-1" />
//             Machino
//           </Link>
//           <div className="flex gap-5 items-center text-[15px]">
//             <Link to="/faq">Jak to działa?</Link>
//             <Link to="/branze">Branże</Link>
//             <Link to="/cennik">Cennik</Link>
//             <Link to="/kontakt">Kontakt</Link>
//             <SignedOut>
//               <SignInButton mode="modal">
//                 <button className="text-sm font-medium">Zaloguj się</button>
//               </SignInButton>
//               <SignUpButton mode="modal">
//                 <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
//                   Zacznij za darmo
//                 </button>
//               </SignUpButton>
//             </SignedOut>

//             <SignedIn>
//               <Link to="/dashboard">Panel</Link>
//             </SignedIn>
//           </div>
//         </div>
//       </header>
//     </>
//   )
// }

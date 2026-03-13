"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  Factory,
  TriangleAlert,
  Cog,
  LogOut,
  ScanLine,
  Zap,
  ChevronRight,
  Wrench,
  CheckCheck,
  HelpCircle,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const topLinks = [
  { href: "/panel", label: "Przegląd", icon: BookOpen },
  { href: "/panel/maszyny", label: "Maszyny", icon: Factory },
];

const awarieSubLinks = [
  { href: "/panel/awarie", label: "Aktywne", icon: TriangleAlert },
  { href: "/panel/awarie/serwis", label: "W serwisie", icon: Wrench },
  { href: "/panel/awarie/zamkniete", label: "Zamknięte", icon: CheckCheck },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [plan, setPlan] = useState<"free" | "pro">("free");

  const awarieOpen = pathname.startsWith("/panel/awarie");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data?.plan === "pro") setPlan("pro");
        });
    });
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/logowanie");
    router.refresh();
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center">
              <ScanLine size={12} className="text-white" />
            </div>
            <span className="font-medium">Asseto</span>
          </div>
          {plan === "pro" ? (
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-semibold px-1.5 py-0.5 rounded-sm">
              <Zap size={10} /> Pro
            </span>
          ) : (
            <Link href="/cennik">
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-xs font-semibold px-1.5 py-0.5 rounded-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
                Free
              </span>
            </Link>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Przegląd</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/panel">
                    <BookOpen size={16} /> Przegląd
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Awarie</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {[
                {
                  href: "/panel/awarie",
                  label: "Aktywne",
                  icon: TriangleAlert,
                },
                {
                  href: "/panel/awarie/serwis",
                  label: "W serwisie",
                  icon: Wrench,
                },
                {
                  href: "/panel/awarie/zamkniete",
                  label: "Zamknięte",
                  icon: CheckCheck,
                },
              ].map((link) => (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton asChild isActive={pathname === link.href}>
                    <Link href={link.href}>
                      <link.icon size={16} /> {link.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Sprzęt</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/panel/maszyny">
                    <Factory size={16} /> Maszyny
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Pomoc</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/panel/pomoc/awarie">
                    <HelpCircle size={16} /> Awarie Q&A
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/panel/pomoc/maszyny">
                    <HelpCircle size={16} /> Maszyny Q&A
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="px-3 pb-3">
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="text-sm text-gray-500 leading-relaxed">
            👋 Jesteśmy w fazie testów. Mogą pojawić się błędy, dziękujemy za
            cierpliwość!
          </p>
        </div>
      </div>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/panel/profil">
                <UserCircle size={16} /> Mój profil
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/panel/ustawienia">
                <Cog size={16} /> Ustawienia
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <LogOut size={16} /> Wyloguj się
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

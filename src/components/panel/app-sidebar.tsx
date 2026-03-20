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
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  Factory,
  TriangleAlert,
  Cog,
  LogOut,
  ScanLine,
  Zap,
  Wrench,
  CheckCheck,
  HelpCircle,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const [companyName, setCompanyName] = useState<string>();
  const [counts, setCounts] = useState({
    broken: 0,
    critical: 0,
    maintenance: 0,
    closed: 0,
    assets: 0,
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;

      Promise.all([
        supabase
          .from("profiles")
          .select("plan, company_name")
          .eq("id", user.id)
          .single(),
        supabase
          .from("issues")
          .select("id, assets!inner(owner_id)", { count: "exact", head: true })
          .eq("assets.owner_id", user.id)
          .eq("status", "broken"),
        supabase
          .from("issues")
          .select("id, assets!inner(owner_id)", { count: "exact", head: true })
          .eq("assets.owner_id", user.id)
          .eq("status", "broken")
          .eq("priority", "critical"),
        supabase
          .from("issues")
          .select("id, assets!inner(owner_id)", { count: "exact", head: true })
          .eq("assets.owner_id", user.id)
          .eq("status", "maintenance"),
        supabase
          .from("issues")
          .select("id, assets!inner(owner_id)", { count: "exact", head: true })
          .eq("assets.owner_id", user.id)
          .eq("status", "closed"),
        supabase
          .from("assets")
          .select("id", { count: "exact", head: true })
          .eq("owner_id", user.id),
      ]).then(([profile, broken, critical, maintenance, closed, assets]) => {
        setCompanyName(profile.data?.company_name || "Asseto");
        if (profile.data?.plan === "pro") setPlan("pro");
        setCounts({
          broken: broken.count ?? 0,
          critical: critical.count ?? 0,
          maintenance: maintenance.count ?? 0,
          closed: closed.count ?? 0,
          assets: assets.count ?? 0,
        });
      });
    });
  }, []);

  const Badge = ({
    count,
    critical = false,
  }: {
    count: number;
    critical?: boolean;
  }) => (
    <span
      className={`ml-auto text-xs font-medium px-1.5 py-0.5 rounded-md min-w-5 text-center ${
        critical ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
      }`}
    >
      {count}
    </span>
  );

  const handleNavClick = () => setOpenMobile(false);

  const handleSignOut = async () => {
    setOpenMobile(false);
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
            <span className="font-medium text-sm">
              {companyName ?? "Asseto"}
            </span>
          </div>
          {plan === "pro" ? (
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-semibold px-1.5 py-0.5 rounded-sm">
              <Zap size={10} /> Pro
            </span>
          ) : (
            <Link href="/cennik" onClick={handleNavClick}>
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
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/panel"}
                  className="text-sm"
                >
                  <Link href="/panel" onClick={handleNavClick}>
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
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/panel/awarie"}
                  className="text-sm"
                >
                  <Link href="/panel/awarie" onClick={handleNavClick}>
                    <TriangleAlert size={16} /> Aktywne
                    <Badge
                      count={counts.broken}
                      critical={counts.critical > 0}
                    />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/panel/awarie/serwis"}
                  className="text-sm"
                >
                  <Link href="/panel/awarie/serwis" onClick={handleNavClick}>
                    <Wrench size={16} /> W serwisie
                    <Badge count={counts.maintenance} />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/panel/awarie/zamkniete"}
                  className="text-sm"
                >
                  <Link href="/panel/awarie/zamkniete" onClick={handleNavClick}>
                    <CheckCheck size={16} /> Zamknięte
                    <Badge count={counts.closed} />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Sprzęt</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/panel/maszyny")}
                  className="text-sm"
                >
                  <Link href="/panel/maszyny" onClick={handleNavClick}>
                    <Factory size={16} /> Maszyny
                    <Badge count={counts.assets} />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Serwis</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/panel/serwisy")}
                  className="text-sm"
                >
                  <Link href="/panel/serwisy" onClick={handleNavClick}>
                    <Wrench size={16} /> Serwisy
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
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/panel/pomoc/awarie"}
                  className="text-sm"
                >
                  <Link href="/panel/pomoc/awarie" onClick={handleNavClick}>
                    <HelpCircle size={16} /> Awarie Q&A
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/panel/pomoc/maszyny"}
                  className="text-sm"
                >
                  <Link href="/panel/pomoc/maszyny" onClick={handleNavClick}>
                    <HelpCircle size={16} /> Maszyny Q&A
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/panel/profil"}
              className="text-sm"
            >
              <Link href="/panel/profil" onClick={handleNavClick}>
                <UserCircle size={16} /> Mój profil
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/panel/ustawienia"}
              className="text-sm"
            >
              <Link href="/panel/ustawienia" onClick={handleNavClick}>
                <Cog size={16} /> Ustawienia
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} className="text-sm">
              <LogOut size={16} /> Wyloguj się
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

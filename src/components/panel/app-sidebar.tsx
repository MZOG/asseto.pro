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
  ScanQrCode,
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
import { isPro } from "@/lib/utils/plan";
import { useTranslations } from "next-intl";

export function AppSidebar() {
  const t = useTranslations("panel.sidebar");
  const router = useRouter();
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const [plan, setPlan] = useState<string>("free");
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
        setPlan(profile.data?.plan ?? "free");
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
      className={`ml-auto text-xs font-medium px-1.5 py-0.5 rounded-md min-w-5 text-center ${critical ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}
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
              <ScanQrCode size={12} className="text-white" />
            </div>
            <span className="font-medium text-sm">Asseto</span>
          </div>
          {isPro(plan) ? (
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-semibold px-1.5 py-0.5 rounded-sm">
              <Zap size={10} /> {plan}
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
          <SidebarGroupLabel>{t("overview")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.endsWith("/panel")}
                  className="text-sm"
                >
                  <Link href="/panel" onClick={handleNavClick}>
                    <BookOpen size={16} /> {t("overview")}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t("issues")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={
                    pathname.endsWith("/panel/awarie") ||
                    pathname.endsWith("/dashboard/issues")
                  }
                  className="text-sm"
                >
                  <Link href="/panel/awarie" onClick={handleNavClick}>
                    <TriangleAlert size={16} /> {t("active")}
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
                  isActive={
                    pathname.includes("/awarie/serwis") ||
                    pathname.includes("/issues/service")
                  }
                  className="text-sm"
                >
                  <Link href="/panel/awarie/serwis" onClick={handleNavClick}>
                    <Wrench size={16} /> {t("inService")}
                    <Badge count={counts.maintenance} />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={
                    pathname.includes("/awarie/zamkniete") ||
                    pathname.includes("/issues/closed")
                  }
                  className="text-sm"
                >
                  <Link href="/panel/awarie/zamkniete" onClick={handleNavClick}>
                    <CheckCheck size={16} /> {t("closed")}
                    <Badge count={counts.closed} />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t("equipment")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={
                    pathname.includes("/panel/maszyny") ||
                    pathname.includes("/dashboard/assets")
                  }
                  className="text-sm"
                >
                  <Link href="/panel/maszyny" onClick={handleNavClick}>
                    <Factory size={16} /> {t("assets")}
                    <Badge count={counts.assets} />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t("service")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={
                    pathname.includes("/panel/serwisy") ||
                    pathname.includes("/dashboard/services")
                  }
                  className="text-sm"
                >
                  <Link href="/panel/serwisy" onClick={handleNavClick}>
                    <Wrench size={16} /> {t("services")}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t("help")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={
                    pathname.includes("/pomoc/awarie") ||
                    pathname.includes("/help/issues")
                  }
                  className="text-sm"
                >
                  <Link href="/panel/pomoc/awarie" onClick={handleNavClick}>
                    <HelpCircle size={16} /> {t("issuesQA")}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={
                    pathname.includes("/pomoc/maszyny") ||
                    pathname.includes("/help/assets")
                  }
                  className="text-sm"
                >
                  <Link href="/panel/pomoc/maszyny" onClick={handleNavClick}>
                    <HelpCircle size={16} /> {t("assetsQA")}
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
              isActive={
                pathname.includes("/profil") || pathname.includes("/profile")
              }
              className="text-sm"
            >
              <Link href="/panel/profil" onClick={handleNavClick}>
                <UserCircle size={16} /> {t("profile")}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={
                pathname.includes("/ustawienia") ||
                pathname.includes("/settings")
              }
              className="text-sm"
            >
              <Link href="/panel/ustawienia" onClick={handleNavClick}>
                <Cog size={16} /> {t("settings")}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} className="text-sm">
              <LogOut size={16} /> {t("logout")}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

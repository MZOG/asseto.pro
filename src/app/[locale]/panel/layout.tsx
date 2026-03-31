import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/panel/app-sidebar";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Toaster } from "@/components/ui/sonner";
import FeedbackButton from "@/components/panel/feedback-button";
import LanguageSwitcher from "@/components/public/language-switcher";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = (await headers()).get("x-user-id");
  if (!userId) redirect("/logowanie");

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full bg-white">
        <div className="px-3 py-2 border-b flex justify-between">
          <SidebarTrigger />
          <LanguageSwitcher />
        </div>
        <div className="p-5">{children}</div>
        <Toaster />
        <FeedbackButton />
      </main>
    </SidebarProvider>
  );
}

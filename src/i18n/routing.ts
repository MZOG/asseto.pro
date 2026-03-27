// src/i18n/routing.ts
import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["pl", "en"],
  defaultLocale: "pl",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/cennik": { pl: "/cennik", en: "/pricing" },
    "/blog": "/blog",
    "/kontakt": { pl: "/kontakt", en: "/contact" },
    "/pomoc": { pl: "/pomoc", en: "/help" },
    "/dla-firm": { pl: "/dla-firm", en: "/for-business" },
    "/polityka-prywatnosci": {
      pl: "/polityka-prywatnosci",
      en: "/privacy-policy",
    },
    "/regulamin": { pl: "/regulamin", en: "/terms" },
    "/logowanie": { pl: "/logowanie", en: "/login" },
    "/rejestracja": { pl: "/rejestracja", en: "/register" },
    "/reset-hasla": { pl: "/reset-hasla", en: "/reset-password" },
    "/panel": { pl: "/panel", en: "/dashboard" },
    "/panel/maszyny": { pl: "/panel/maszyny", en: "/dashboard/assets" },
    "/panel/maszyny/dodaj": {
      pl: "/panel/maszyny/dodaj",
      en: "/dashboard/assets/add",
    },
    "/panel/awarie": { pl: "/panel/awarie", en: "/dashboard/issues" },
    "/panel/serwisy": { pl: "/panel/serwisy", en: "/dashboard/services" },
    "/panel/ustawienia": { pl: "/panel/ustawienia", en: "/dashboard/settings" },
    "/panel/profil": { pl: "/panel/profil", en: "/dashboard/profile" },
  },
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

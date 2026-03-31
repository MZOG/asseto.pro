// src/i18n/routing.ts
import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["pl", "en", "de"],
  defaultLocale: "pl",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/cennik": { pl: "/cennik", en: "/pricing", de: "/preise" },
    "/blog": { pl: "/blog", en: "/blog", de: "/blog" },
    "/kontakt": { pl: "/kontakt", en: "/contact", de: "/kontakt" },
    "/pomoc": { pl: "/pomoc", en: "/help", de: "/hilfe" },
    "/dla-firm": {
      pl: "/dla-firm",
      en: "/for-business",
      de: "/fuer-unternehmen",
    },
    "/polityka-prywatnosci": {
      pl: "/polityka-prywatnosci",
      en: "/privacy-policy",
    },
    "/regulamin": { pl: "/regulamin", en: "/terms" },
    "/logowanie": { pl: "/logowanie", en: "/login" },
    "/rejestracja": { pl: "/rejestracja", en: "/register" },
    "/reset-hasla": { pl: "/reset-hasla", en: "/reset-password" },
    "/ustaw-haslo": { pl: "/ustaw-haslo", en: "/set-passwrod" },
    "/email": { pl: "/email", en: "/email" },

    // panel
    "/panel": { pl: "/panel", en: "/dashboard" },
    "/panel/maszyny": { pl: "/panel/maszyny", en: "/dashboard/assets" },
    "/panel/maszyny/dodaj": {
      pl: "/panel/maszyny/dodaj",
      en: "/dashboard/assets/add",
    },
    "/panel/maszyny/[id]": {
      pl: "/panel/maszyny/[id]",
      en: "/dashboard/assets/[id]",
    },

    "/panel/awarie": { pl: "/panel/awarie", en: "/dashboard/issues" },
    "/panel/awarie/[id]": {
      pl: "/panel/awarie/[id]",
      en: "/dashboard/issues/[id]",
    },

    "/panel/serwisy": { pl: "/panel/serwisy", en: "/dashboard/services" },
    "/panel/serwisy/[assetId]": {
      pl: "/panel/serwisy/[assetId]",
      en: "/dashboard/services/[assetId]",
    },

    "/panel/ustawienia": { pl: "/panel/ustawienia", en: "/dashboard/settings" },
    "/panel/profil": { pl: "/panel/profil", en: "/dashboard/profile" },
  },
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

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
      de: "/datenschutz",
    },
    "/regulamin": { pl: "/regulamin", en: "/terms", de: "/agb" },
    "/logowanie": { pl: "/logowanie", en: "/login", de: "/anmelden" },
    "/rejestracja": {
      pl: "/rejestracja",
      en: "/register",
      de: "/registrieren",
    },
    "/reset-hasla": {
      pl: "/reset-hasla",
      en: "/reset-password",
      de: "/passwort-zuruecksetzen",
    },
    "/ustaw-haslo": {
      pl: "/ustaw-haslo",
      en: "/set-password",
      de: "/passwort-festlegen",
    },
    "/email": { pl: "/email", en: "/email", de: "/email" },

    "/blog/[slug]": {
      pl: "/blog/[slug]",
      en: "/blog/[slug]",
      de: "/blog/[slug]",
    },
    "/report/[id]": {
      pl: "/report/[id]",
      en: "/report/[id]",
      de: "/report/[id]",
    },

    "/panel": { pl: "/panel", en: "/dashboard", de: "/dashboard" },
    "/panel/maszyny": {
      pl: "/panel/maszyny",
      en: "/dashboard/assets",
      de: "/dashboard/geraete",
    },
    "/panel/maszyny/dodaj": {
      pl: "/panel/maszyny/dodaj",
      en: "/dashboard/assets/add",
      de: "/dashboard/geraete/hinzufuegen",
    },
    "/panel/maszyny/[id]": {
      pl: "/panel/maszyny/[id]",
      en: "/dashboard/assets/[id]",
      de: "/dashboard/geraete/[id]",
    },

    "/panel/awarie": {
      pl: "/panel/awarie",
      en: "/dashboard/issues",
      de: "/dashboard/stoerungen",
    },
    "/panel/awarie/[id]": {
      pl: "/panel/awarie/[id]",
      en: "/dashboard/issues/[id]",
      de: "/dashboard/stoerungen/[id]",
    },

    "/panel/serwisy": {
      pl: "/panel/serwisy",
      en: "/dashboard/services",
      de: "/dashboard/wartungen",
    },
    "/panel/serwisy/[assetId]": {
      pl: "/panel/serwisy/[assetId]",
      en: "/dashboard/services/[assetId]",
      de: "/dashboard/wartungen/[assetId]",
    },

    "/panel/ustawienia": {
      pl: "/panel/ustawienia",
      en: "/dashboard/settings",
      de: "/dashboard/einstellungen",
    },
    "/panel/profil": {
      pl: "/panel/profil",
      en: "/dashboard/profile",
      de: "/dashboard/profil",
    },

    "/panel/pomoc/awarie": {
      pl: "/panel/pomoc/awarie",
      en: "/dashboard/help/issues",
      de: "/dashboard/hilfe/stoerungen",
    },
    "/panel/pomoc/maszyny": {
      pl: "/panel/pomoc/maszyny",
      en: "/dashboard/help/assets",
      de: "/dashboard/hilfe/geraete",
    },
  },
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

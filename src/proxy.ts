// src/proxy.ts
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

const authPaths = ["/panel", "/dashboard"];
const guestOnlyPaths = [
  "/logowanie",
  "/rejestracja",
  "/login",
  "/register",
  "/reset-hasla",
  "/reset-password",
];

export default async function proxy(request: NextRequest) {
  // Krok 1: next-intl obsługuje locale routing
  const response = handleI18nRouting(request);

  // Krok 2: Supabase auth
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Usuń prefix locale z pathname żeby sprawdzić auth
  const { pathname } = request.nextUrl;
  const pathnameWithoutLocale = pathname.replace(/^\/(pl|en)/, "") || "/";

  const requiresAuth = authPaths.some((p) =>
    pathnameWithoutLocale.startsWith(p),
  );
  const isGuestOnly = guestOnlyPaths.some((p) =>
    pathnameWithoutLocale.startsWith(p),
  );

  const locale = pathname.split("/")[1];

  if (requiresAuth && !user) {
    const loginPath = locale === "en" ? "/en/login" : "/pl/logowanie";
    return NextResponse.redirect(
      new URL(`${loginPath}?next=${pathname}`, request.url),
    );
  }

  if (isGuestOnly && user) {
    const dashboardPath = locale === "en" ? "/en/dashboard" : "/pl/panel";
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  // Krok 3: inject user headers
  if (user) {
    response.headers.set("x-user-id", user.id);
    response.headers.set("x-user-email", user.email ?? "");
  }

  return response;
}

export const config = {
  matcher: "/((?!api|_next|_vercel|auth/callback|.*\\..*).*)",
};

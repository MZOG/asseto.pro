import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";
  const isAppSubdomain = hostname.startsWith("app.");
  const rootDomain = new URL(process.env.NEXT_PUBLIC_APP_URL!).hostname;

  // app.asseto.pro/* → rewrite do /panel/*
  if (isAppSubdomain && !request.nextUrl.pathname.startsWith("/panel")) {
    const url = request.nextUrl.clone();
    url.pathname = "/panel" + request.nextUrl.pathname;
    return NextResponse.rewrite(url);
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Niezalogowany próbuje wejść na /panel → logowanie na głównej domenie
  if (!user && request.nextUrl.pathname.startsWith("/panel")) {
    return NextResponse.redirect(
      new URL("/logowanie", `https://${rootDomain}`),
    );
  }

  // Zalogowany na stronie logowania/rejestracji → panel na subdomenie
  if (
    user &&
    (request.nextUrl.pathname.startsWith("/logowanie") ||
      request.nextUrl.pathname.startsWith("/rejestracja"))
  ) {
    return NextResponse.redirect(
      new URL("/panel", `https://app.${rootDomain}`),
    );
  }

  if (user) {
    supabaseResponse.headers.set("x-user-id", user.id);
    supabaseResponse.headers.set("x-user-email", user.email ?? "");
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

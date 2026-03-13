import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  if (request.nextUrl.searchParams.has("code")) {
    const code = request.nextUrl.searchParams.get("code")!;
    const redirectTo =
      request.nextUrl.searchParams.get("next") ?? "/panel/profil";

    const url = request.nextUrl.clone();
    url.pathname = "/auth/callback";
    url.searchParams.set("code", code);
    url.searchParams.set("next", redirectTo);
    return NextResponse.redirect(url);
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

  if (!user && request.nextUrl.pathname.startsWith("/panel")) {
    return NextResponse.redirect(new URL("/logowanie", request.url));
  }

  if (
    user &&
    (request.nextUrl.pathname.startsWith("/logowanie") ||
      request.nextUrl.pathname.startsWith("/rejestracja"))
  ) {
    return NextResponse.redirect(new URL("/panel", request.url));
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

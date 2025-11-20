import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  AUTH_FORGOT_PASSWORD,
  AUTH_LOGIN,
  AUTH_RESET_PASSWORD,
  AUTH_SIGNUP,
  DASHBOARD,
  PRICING,
  SETTINGS,
  USER_PROFILE,
} from "./constants/navigation";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // IMPORTANT: Always refresh the session
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  const pathname = request.nextUrl.pathname;

  // Protected routes (add more if needed, e.g., '/dashboard')
  const protectedPaths = [DASHBOARD, PRICING, SETTINGS, USER_PROFILE];

  // Public paths (auth pages)
  const authPaths = [
    AUTH_LOGIN,
    AUTH_SIGNUP,
    AUTH_FORGOT_PASSWORD,
    AUTH_RESET_PASSWORD,
  ];

  if (protectedPaths.some((path) => pathname.startsWith(path)) && !user) {
    // Not logged in → redirect to login
    const url = new URL(AUTH_LOGIN, request.url);
    return NextResponse.redirect(url);
  }

  // Optional: If logged in and trying to access login/signup, redirect to home
  if (authPaths.includes(pathname) && user) {
    const url = new URL(DASHBOARD, request.url);
    return NextResponse.redirect(url);
  }

  return response;
}

// Run middleware on relevant paths (exclude static/assets)
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

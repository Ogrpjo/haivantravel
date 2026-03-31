import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  const isRoot = pathname === "/";
  const isLoginPage = pathname === "/login";
  const isDashboardRoute =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isAdminRoute = pathname.startsWith("/admin");

  // Allow Next.js internals and static assets through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/assets")
  ) {
    return NextResponse.next();
  }

  // Redirect root to /login
  if (isRoot) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Protect dashboard (and optional /admin) when not authenticated
  if (!token && (isDashboardRoute || isAdminRoute)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in and visiting /login, go to /dashboard
  if (token && isLoginPage) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*", "/admin/:path*"],
};
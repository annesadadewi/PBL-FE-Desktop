import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Jika token kosong atau "undefined", jangan lakukan redirect ke dashboard
  const isAuthenticated = Boolean(token && token !== "undefined" && token !== "null");

  // Jika sudah login dan mencoba ke halaman login (/), alihkan ke dashboard
  if (isAuthenticated && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Jika belum login dan mencoba ke dashboard, alihkan ke login
  if (!isAuthenticated && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
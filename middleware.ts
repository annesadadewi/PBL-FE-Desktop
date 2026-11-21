import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_PATHS = ["/auth", "/login"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const hasValidToken = Boolean(token && token !== "undefined" && token !== "null");
  const isAuthPage = AUTH_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/"));

  // 1. Jika sudah login tapi coba buka halaman auth/login atau root "/", alihkan ke /dashboard
  if (hasValidToken && (pathname === "/" || isAuthPage)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. Jika root "/" dan belum login, alihkan ke /auth
  if (!hasValidToken && pathname === "/") {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // 3. Jika BELUM login dan coba buka halaman APAPUN selain auth, paksa balik ke halaman /auth
  if (!hasValidToken && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  /*
   * Matcher ini mengunci SEMUA rute (termasuk /dashboard, /kelas-saya, /kehadiran, /penilaian, /evaluator, dll)
   * kecuali file sistem Next.js, gambar, dan API.
   */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

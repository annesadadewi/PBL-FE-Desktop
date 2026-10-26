import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const hasValidToken = Boolean(token && token !== "undefined" && token !== "null");

  // 1. Jika sudah login tapi coba buka halaman login ("/"), alihkan ke /dashboard
  if (hasValidToken && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. Jika BELUM login dan coba buka halaman APAPUN selain "/", paksa balik ke halaman login
  if (!hasValidToken && pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  /*
   * Matcher ini mengunci SEMUA rute (termasuk /kelas-saya, /kehadiran, /penilaian, /evaluator, dll)
   * kecuali file sistem Next.js, gambar, dan API.
   */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
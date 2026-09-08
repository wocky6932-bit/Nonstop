import { NextResponse, type NextRequest } from "next/server";
import { getMiddlewareSession } from "@/lib/middleware-auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = getMiddlewareSession(request);

  // Routes protégées pour les admins
  if (pathname.startsWith("/admin")) {
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }

    if (!session.isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // Routes protégées pour les profils utilisateurs
  if (pathname.startsWith("/profile")) {
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  // Rediriger du login vers l'accueil si déjà connecté
  if (pathname === "/auth/login" && session) {
    const url = request.nextUrl.clone();
    url.pathname = session.isAdmin ? "/admin" : "/profile";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};


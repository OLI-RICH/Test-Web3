import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const isLoginPage = req.nextUrl.pathname === "/admin/login";
    
    // Si pas de token et pas sur la page login, rediriger vers login
    if (!token && isAdminRoute && !isLoginPage) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    
    // Si token mais pas admin, rediriger vers home
    if (token && token.role !== "ADMIN" && isAdminRoute && !isLoginPage) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    // Si déjà connecté admin et sur login, rediriger vers dashboard
    if (token && token.role === "ADMIN" && isLoginPage) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // Laisser le middleware gérer l'autorisation
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};

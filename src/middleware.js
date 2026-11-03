import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Private routes: if there is no session cookie, go to /login (and come back afterwards).
// A logged-in user always has the cookie, so reloading a private route never bounces to login.
export function middleware(request) {
  if (!getSessionCookie(request)) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/add-studio", "/my-listings", "/my-bookings", "/dashboard", "/wishlist", "/studios/edit/:path*"],
};

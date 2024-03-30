import { NextResponse, NextRequest } from "next/server";
import auth from "./utils/firebase";

/** Middleware that runs for every protected route */
export const middleware = async (request: NextRequest) => {
  /** Paths that can be accessed without requiring login */
  const publicPaths = ["/about", "/login", "/signup"];

  /** Paths that are related to authentication, such as login and signup */
  const authPaths = ["/login", "/signup"];

  /** Paths that require at least a user token to access */
  const userPaths = ["/:userid/profile"];

  /** Paths that require at least an admin token to access */
  const adminPaths = ["/dashboard"];

  /** URL path */
  const path = request.nextUrl.pathname;

  // Get token and claims
  const { token, claims } = auth.currentUser
    ? await auth.currentUser.getIdTokenResult()
    : { token: null, claims: null };

  // If user is not logged in, non-public paths are redirected to Login
  if (!publicPaths.includes(path) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is logged in, auth paths are redirected to About
  if (authPaths.includes(path) && token) {
    return NextResponse.redirect(new URL("/about", request.url));
  }

  // If user is logged in but not an admin, admin paths are redirected to About
  if (adminPaths.includes(path) && !claims?.admin) {
    return NextResponse.redirect(new URL("/about", request.url));
  }
};

export const config = {
  /** Paths that are handled by the middleware */
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

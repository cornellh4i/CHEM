import { NextResponse, NextRequest } from "next/server";
import auth from "./utils/firebase";

/**
 * Takes a URL path and converts it into a matching regex
 * @param path is the URL path
 * @returns the matching regex
 * @example "/users/:userid/posts/:postid" becomes `/users/${wild}/posts/${wild}`
 */
const regex = (path: string): RegExp => {
  // Replace each :parameterName with a ([^/]+) capturing group
  const regexPattern = path.replace(/:[^/]+/g, "([^/]+)");

  // Escape slashes
  const regexEscaped = regexPattern.replace(/\//g, "\\/");

  // Construct regex and ensure match from start to end
  const regexPath = new RegExp("^" + regexEscaped + "$");

  return new RegExp(regexPath);
};

/**
 * Takes a URL path and checks if it matches any route in routes
 * @param path is the URL path
 * @param routes is an array of routes to check against
 * @returns whether path matches any route in routes
 * @example "/users/asdf" matches ["/users/:userid"]
 */
const match = (path: string, routes: string[]): boolean => {
  return routes.some((route) => regex(route).test(path));
};

/** Routes related to authentication */
const authPaths = [
  "/login",
  "/signup",
  "/verify",
  "/password/forgot",
  "/password/reset/:oobcode",
];

/** Users can access */
const userPaths = ["/posts"];

/** Users can access only in certain conditions; admins can access */
const userRestrictedPaths = ["/users/:userid", "/posts/:postid"];

/** Admins can access */
const adminPaths = ["/dashboard", "/users", "/website"];

/** Anyone can access */
const publicPaths = ["/", "about"];

/** Middleware that runs for every protected route */
export const middleware = async (request: NextRequest) => {
  /** URL path */
  const path = request.nextUrl.pathname;

  // Get token and claims
  const { token, claims } = auth.currentUser
    ? await auth.currentUser.getIdTokenResult()
    : { token: null, claims: null };

  switch (true) {
    // Auth paths
    case match(path, authPaths):
      // If user is logged in, redirect to About
      if (token) {
        return NextResponse.redirect(new URL("/about", request.url));
      }
      // Everyone else can access
      break;

    // User paths
    case match(path, userPaths):
      // If user is not logged in, redirect to Login
      if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      // Everyone else can access
      break;

    // User restricted paths
    case match(path, userRestrictedPaths):
      // If user is not logged in, redirect to Login
      if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      // If user token and trying to access a user profile, check for access
      else if (token && claims?.user && match(path, ["/users/:userid"])) {
        console.log("check for access");
      }
      // If user token and trying to access a post, check for access
      else if (token && claims?.user && match(path, ["/posts/:postid"])) {
        console.log("check for access");
      }
      // Everyone else can access
      break;

    // Admin paths
    case match(path, adminPaths):
      // If user is not logged in, redirect to Login
      if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      // If user is logged in but not admin, redirect to About
      else if (token && !claims?.admin) {
        return NextResponse.redirect(new URL("/about", request.url));
      }
      // Everyone else can access
      break;

    // Public paths
    case match(path, publicPaths):
      // Everyone else can access
      break;

    // Default case
    default:
      // Everyone else can access
      break;
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

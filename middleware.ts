import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// List of public routes that don't require authentication
const publicRoutes = ["/", "/login", "/register", "/forgot-password"]

export function middleware(request: NextRequest) {
  // Check if the requested path is a public route
  const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname === route)

  // Get the authentication token from cookies
  const token = request.cookies.get("auth-token")?.value

  // If the route is not public and there's no token, redirect to login
  if (!isPublicRoute && !token) {
    const loginUrl = new URL("/login", request.url)
    // Add the original URL as a redirect parameter
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If trying to access login/register while already authenticated, redirect to dashboard
  if ((request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register") && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
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
}

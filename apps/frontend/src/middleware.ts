import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Next.js Middleware for route protection
 *
 * This provides server-side route protection based on JWT token presence.
 * For role-based protection, use the withAuth HOC in addition to this.
 *
 * Protected routes:
 * - /admin/* - Admin-only pages (requires JWT, role check done client-side)
 * - Any other protected routes can be added to the matcher
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt')?.value;
  const path = request.nextUrl.pathname;

  // List of paths that require authentication
  const protectedPaths = [
    '/admin',
    '/admin_panel',
    '/profile',
    '/settings',
    '/bands',
    '/stats',
    '/members',
    '/reservation',
    '/my-reservations',
  ];

  // Check if current path is protected
  const isProtectedPath = protectedPaths.some((protectedPath) => path.startsWith(protectedPath));

  // Redirect to login if accessing protected path without token
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', path); // Preserve intended destination
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

/**
 * Configure which routes this middleware should run on
 * Use negative lookahead to exclude API routes, static files, etc.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|login).*)',
  ],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get tokens from request headers (from client-side cookies if any) 
  // or we'll check this on the client side via AuthGuard
  
  // Define protected routes that require authentication and verification
  const protectedRoutes = [
    '/dashboard',
    '/profile', 
    '/consultations',
    '/bookings',
    '/payments',
    '/settings'
  ];

  // Define routes that unverified practitioners shouldn't access
  const verificationRequiredRoutes = [
    '/dashboard',
    '/consultations',
    '/bookings',
    '/payments'
  ];

  // Check if the current path requires authentication
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // For now, let the AuthGuard component handle the verification logic
  // This middleware can be enhanced later for server-side checks
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}

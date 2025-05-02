import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Get pathname of request
  const path = request.nextUrl.pathname;

  // Redirect /admin to /admin/dashboard
  if (path === '/admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // Redirect /user to /user/dashboard
  if (path === '/user') {
    return NextResponse.redirect(new URL('/user/dashboard', request.url));
  }

  // Define protected routes
  const adminRoutes = ['/admin'];
  const userRoutes = ['/user'];
  const authRoutes = ['/login', '/signup', '/forgot-password'];

  // Check if the route is protected
  const isAdminRoute = adminRoutes.some(route => path.startsWith(route));
  const isUserRoute = userRoutes.some(route => path.startsWith(route));
  const isAuthRoute = authRoutes.some(route => path.includes(route));

  // If no token and trying to access protected routes
  if (!token && (isAdminRoute || isUserRoute)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If has token and trying to access auth routes
  if (token && isAuthRoute) {
    // Redirect based on user role
    if (token.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/user/dashboard', request.url));
  }

  // Protect admin routes from non-admin users
  if (token && isAdminRoute && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/user/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/user',
    '/user/:path*',
    '/login',
    '/signup',
    '/forgot-password',
  ],
}; 
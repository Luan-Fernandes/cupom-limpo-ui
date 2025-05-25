import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/perfil', '/notas'];
const transientRoutes = ['/cadcompleto', '/completecad'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  const justRegistered = request.cookies.get('justRegistered')?.value;
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !token) {
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  const isAuthPage = pathname === '/login' || pathname === '/register';
  if (token && isAuthPage) {
    const dashboardUrl = new URL('/', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  const isTransient = transientRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isTransient) {
    if (!justRegistered) {
      const dashboardUrl = new URL('/', request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    const response = NextResponse.next();
    response.cookies.set('justRegistered', '', {
      maxAge: 0,
      path: '/', 
      sameSite: 'lax' 
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/perfil/:path*',
    '/notas/:path*',
    '/cadcompleto/:path*',
    '/completecad/:path*',
    '/login',
    '/register',
  ],
};
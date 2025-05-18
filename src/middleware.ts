import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Rotas } from './types/TypesResponse';

const protectedRoutes = ['/dashboard', '/perfil', '/notas'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  const isAuthPage = pathname === '/login' || pathname === '/register';
  if (token && isAuthPage) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/perfil/:path*',
    '/notas/:path*',
    Rotas.login,
    Rotas.cadastrar,
    Rotas.loginPass,
    Rotas.cadcompleto
  ],
};

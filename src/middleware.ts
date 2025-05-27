import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Rotas } from './types/TypesResponse';

const protectedRoutes = [Rotas.minhasNotas, Rotas.ondeComprei];
const transientRoutes = [Rotas.cadcompleto, Rotas.completecad, Rotas.loginPass];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  const justRegistered = request.cookies.get('justRegistered')?.value;
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !token) {
    const loginUrl = new URL(Rotas.home, request.url);
    return NextResponse.redirect(loginUrl);
  }

  const isAuthPage = pathname === Rotas.login || pathname === Rotas.cadastrar;
  if (token && isAuthPage) {
    const dashboardUrl = new URL(Rotas.home, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  const isTransient = transientRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isTransient) {
    if (!justRegistered) {
      const dashboardUrl = new URL(Rotas.home, request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    const response = NextResponse.next();
    response.cookies.set('justRegistered', '', {
      maxAge: 0,
      path: Rotas.home, 
      sameSite: 'lax' 
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    `/${Rotas.home}/:path*`,
    `/${Rotas.minhasNotas}/:path*`,
    `/${Rotas.ondeComprei}/:path*`,
    `/${Rotas.cadastrar}/:path*`,
    `/${Rotas.login}/:path*`,
    `/${Rotas.cadcompleto}/:path*`,
    `/${Rotas.completecad}/:path*`,
    `/${Rotas.loginPass}/:path*`,
  ],
};
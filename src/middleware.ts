import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

type CookieToSet = { name: string; value: string; options?: Partial<ResponseCookie> }

export async function middleware(request: NextRequest) {
  const handleI18nRouting = createMiddleware(routing);
  let response = await handleI18nRouting(request);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname;
  const locale = routing.locales.find((entry) => pathname === `/${entry}` || pathname.startsWith(`/${entry}/`));
  const pathWithoutLocale = locale ? pathname.slice(locale.length + 1) || '/' : pathname;

  const protectedRoutes = ['/dashboard', '/list-car']
  const isProtected = protectedRoutes.some(route => pathWithoutLocale.startsWith(route))

  if (isProtected && !user) {
    const redirectUrl = request.nextUrl.clone()
    const loginPath = locale ? `/${locale}/auth/login` : '/en/auth/login';
    redirectUrl.pathname = loginPath;
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: '/((?!api|_next|.*\\..*).*)'
}

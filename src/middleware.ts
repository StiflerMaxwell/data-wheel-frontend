import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const { data: { session } } = await supabase.auth.getSession();
  const path = req.nextUrl.pathname;

  // 保护dashboard路由，未登录用户重定向到登录页
  if (path.startsWith('/dashboard') && !session) {
    const redirectUrl = new URL('/sign-in', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // 已登录用户访问登录页，重定向到dashboard
  if (path === '/sign-in' && session) {
    const redirectUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // 根路径重定向到dashboard
  if (path === '/' || path === '') {
    const redirectUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}; 
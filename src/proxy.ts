import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isAdmin = pathname === '/admin' || 
                  pathname.startsWith('/admin/') || 
                  pathname.includes('/admin') || 
                  pathname.startsWith('/api/admin');

  if (isAdmin) {
    const adminSession = request.cookies.get('admin_session');
    
    if (!adminSession || adminSession.value !== 'authenticated') {
      // Not authenticated
      if (pathname.startsWith('/api/')) {
        return new NextResponse(JSON.stringify({ success: false, message: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      // Redirect to login page for browser navigation
      // Extract locale from the pathname, default to 'en'
      const match = pathname.match(/^\/(en|ne)\//);
      const locale = match ? match[1] : 'en';
      
      const loginUrl = new URL(`/${locale}/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)']
};

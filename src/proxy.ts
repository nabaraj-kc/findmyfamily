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
    const basicAuth = request.headers.get('authorization');
    const adminPassword = process.env.ADMIN_PASSWORD || 'findmyfamily2026';
    
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');
      
      if (user === 'admin' && pwd === adminPassword) {
        if (pathname.startsWith('/api/')) {
          return NextResponse.next();
        }
        return intlMiddleware(request);
      }
    }
    
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)']
};

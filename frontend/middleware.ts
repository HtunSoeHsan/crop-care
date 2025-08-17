import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value || 
                req.headers.get('authorization')?.replace('Bearer ', '');

  const protectedPaths = ['/dashboard', '/scan', '/profile'];
  const adminPaths = ['/admin'];

  // Check if accessing protected paths without token
  if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path)) && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Check admin access
  if (adminPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      if (!response.ok) {
        return NextResponse.redirect(new URL('/login', req.url));
      }

      const userData = await response.json();
      if (userData.data?.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
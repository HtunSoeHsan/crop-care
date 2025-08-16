import { NextRequest, NextFetchEvent, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value || 
                req.headers.get('authorization')?.replace('Bearer ', '');
  console.log("token:", token)
  const protectedPaths = ['/dashboard','/scan', '/profile'];

  if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path)) && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}
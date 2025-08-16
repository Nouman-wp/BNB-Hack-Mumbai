import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get session from cookie
  const session = request.cookies.get('siwe_session');

  // Check if the request is for a protected route
  if (request.nextUrl.pathname.startsWith('/submit') && !session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/submit/:path*'],
};

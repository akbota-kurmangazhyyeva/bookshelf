import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Check if the path is one we want to protect
  const isProtectedPath = ['/dashboard', '/profile'].some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    // Check if token is expired
    const tokenExpiration = token.exp as number;
    if (Date.now() >= tokenExpiration * 1000) {
      // Token is expired, attempt to refresh
      try {
        const response = await fetch('https://walrus-app-7iw6c.ondigitalocean.app/auth/refresh-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: token.refreshToken }),
        });
        if (!response.ok) {
          throw new Error('Token refresh failed');
        }
        const newToken = await response.json();
        // Update the token in the response
        const nextResponse = NextResponse.next();
        nextResponse.cookies.set('next-auth.session-token', newToken.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        });
        return nextResponse;
      } catch (error) {
        console.error('Token refresh failed:', error);
        return NextResponse.redirect(new URL('/auth/signin', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};

import { type NextRequest, NextResponse } from 'next/server';
import { rootDomain } from '@/lib/utils';
import { cookies } from 'next/headers'
// import { decrypt } from '@/lib/session'

// 1. Specify protected and public routes
const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/signup', '/']

function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];

  // Local development environment
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    // Try to extract subdomain from the full URL
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
    if (fullUrlMatch && fullUrlMatch[1]) {
      return fullUrlMatch[1];
    }

    // Fallback to host header approach
    if (hostname.includes('.localhost')) {
      return hostname.split('.')[0];
    }

    return null;
  }

  // Production environment
  const rootDomainFormatted = rootDomain.split(':')[0];

  // Handle preview deployment URLs (tenant---branch-name.vercel.app)
  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    const parts = hostname.split('---');
    return parts.length > 0 ? parts[0] : null;
  }

  // Regular subdomain detection
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, '') : null;
}

export async function proxy(request: NextRequest) {

  // // 2. Check if the current route is protected or public
  // const path = request.nextUrl.pathname
  // const isProtectedRoute = protectedRoutes.includes(path)
  // const isPublicRoute = publicRoutes.includes(path)
  //
  // // 3. Decrypt the session from the cookie
  // const cookie = (await cookies()).get('session')?.value
  // const session = await decrypt(cookie)
  //
  // const { pathname } = request.nextUrl;
  // const subdomain = extractSubdomain(request);
  //
  // if (subdomain) {
  //   // Block access to admin page from subdomains
  //   if (pathname.startsWith('/admin')) {
  //     return NextResponse.redirect(new URL('/', request.url));
  //   }
  //
  //   // For the root path on a subdomain, rewrite to the subdomain page
  //   if (pathname === '/') {
  //     return NextResponse.rewrite(new URL(`/s/${subdomain}`, request.url));
  //   }
  // }

  // On the root domain, allow normal access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|[\\w-]+\\.\\w+).*)'
  ]
};

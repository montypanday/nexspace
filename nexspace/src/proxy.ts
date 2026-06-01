import { NextRequest, NextResponse } from "next/server";
import authConfig from "./auth.config"
import NextAuth from "next-auth"

// Use only one of the two proxy options below
// 1. Use proxy directly
// export const { auth: proxy } = NextAuth(authConfig)

// 2. Wrapped proxy option
const { auth } = NextAuth(authConfig)
export const proxy = auth(async function proxy(req: NextRequest) {
  const isLoggedIn = !!req.auth
  const isOnAuth = req.nextUrl.pathname.startsWith('/api/auth/signin')

  if (!isLoggedIn && !isOnAuth) {
    return NextResponse.redirect(new URL('/api/auth/signin', req.nextUrl))
  }

  if (isLoggedIn && isOnAuth) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }

  return NextResponse.next()
  // Your custom proxy logic goes here
})
export const config = {
  matcher: [
    // Exclude API routes, static files, image optimizations, and .png files
    '/((?!api|_next/static|_next/image|.*\\.png$).*)'
  ]
};
import { NextRequest, NextResponse } from 'next/server'
 
export default function middleware (request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  if (!accessToken || !refreshToken) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  NextResponse.next()
}

export const config = {
  matcher: [
    '/home/campaign', 
    '/home/campaign/:path*', 
    '/home/farmer'
  ],
}
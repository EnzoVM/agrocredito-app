import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { generateAccessTokenService, verifyAccessTokenService } from './services/auth.service'
 
export default async function middleware (request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  const url = request.nextUrl.clone()

  if (!accessToken || !refreshToken) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    NextResponse.redirect(url)
  }

  const { isValid: isAccessTokenValid } = await verifyAccessTokenService({ accessToken: accessToken! })

  if (isAccessTokenValid) {
    NextResponse.next()
  }

  const { isLoged, tokens } = await generateAccessTokenService({ refreshToken: refreshToken! })

  if (isLoged) {
    request.cookies.set('accessToken', tokens.accessToken)
    request.cookies.set('refreshToken', tokens.refreshToken)
    url.pathname = '/'
    NextResponse.redirect(url)
  }

  url.pathname = '/login'
  NextResponse.redirect(url)
}

export const config = {
  matcher: ['/home', '/home/:path*', '/'],
}
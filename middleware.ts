import { NextRequest, NextResponse } from 'next/server'
import { generateAccessTokenService, verifyAccessTokenService } from './services/auth.service'
 
export default async function middleware (request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  if (!accessToken || !refreshToken) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  const { isValid: isAccessTokenValid } = await verifyAccessTokenService({ accessToken: accessToken! })

  if (isAccessTokenValid) {
    NextResponse.next()
    return
  }

  const { isLoged } = await generateAccessTokenService({ refreshToken: refreshToken! })

  if (isLoged) {
    NextResponse.next()
    return
  }

  const url = request.nextUrl.clone()
  url.pathname = '/login'
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/home', '/home/:path*', '/'],
}
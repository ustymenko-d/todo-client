import { NextRequest, NextResponse } from 'next/server'
import verifyToken from './utils/tokens'
import clearAuthCookies from './utils/clearAuthCookies'

export async function middleware(request: NextRequest) {
	const { nextUrl, cookies } = request
	const { pathname, searchParams } = nextUrl
	const tokens = getTokens(cookies)

	if (needsResetToken(pathname, searchParams)) return redirectTo('/', request)
	if (isStartPage(pathname)) return handleStartPage(tokens, request)
	if (!tokens.accessToken) return handleNoAccessToken(request)
	if (!verifyToken(tokens.accessToken))
		return handleInvalidToken(tokens, request)

	const response = NextResponse.next()
	response.headers.set('Cache-Control', 'no-store')
	return response
}

const getTokens = (cookies: NextRequest['cookies']) => ({
	accessToken: cookies.get('access_token')?.value,
	refreshToken: cookies.get('refresh_token')?.value,
	wasRefreshed: cookies.get('refreshed')?.value === 'true',
})

const needsResetToken = (pathname: string, searchParams: URLSearchParams) =>
	pathname === '/auth/reset-password' && !searchParams.get('resetToken')

const isStartPage = (pathname: string) =>
	pathname === '/' || pathname.startsWith('/auth')

const handleStartPage = (
	tokens: ReturnType<typeof getTokens>,
	request: NextRequest
) => {
	if (verifyToken(tokens.accessToken)) return redirectTo('/home', request)
	if (tokens.refreshToken && !tokens.wasRefreshed) return refreshTokens(request)

	const response = NextResponse.next()
	response.headers.set('Cache-Control', 'no-store')
	return clearAuthCookies(response)
}

const handleNoAccessToken = (request: NextRequest) => {
	const response = redirectTo('/', request)
	return clearAuthCookies(response)
}

const handleInvalidToken = (
	tokens: ReturnType<typeof getTokens>,
	request: NextRequest
) => {
	if (tokens.refreshToken && !tokens.wasRefreshed) return refreshTokens(request)

	const response = redirectTo('/', request)
	return clearAuthCookies(response)
}

const refreshTokens = (request: NextRequest) => {
	const refreshUrl = new URL('/api/auth/tokens/refresh-tokens', request.url)
	refreshUrl.searchParams.set('redirect', request.nextUrl.pathname)
	return NextResponse.redirect(refreshUrl)
}

const redirectTo = (url: string, request: NextRequest) =>
	NextResponse.redirect(new URL(url, request.url))

export const config = {
	matcher: ['/', '/auth/:path*', '/home', '/table', '/settings'],
}

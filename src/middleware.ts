import { NextRequest, NextResponse } from 'next/server'
import { getTokens, refreshTokens, verifyToken } from './utils/tokens'
import clearAuthCookies from './utils/clearAuthCookies'

export async function middleware(request: NextRequest) {
	if (shouldBypassMiddleware(request))
		return finalizeResponse(NextResponse.next())

	return handlePageRouting(request)
}

const shouldBypassMiddleware = (request: NextRequest) => {
	const { pathname, searchParams } = request.nextUrl
	return (
		(pathname === '/verification' && searchParams.has('verificationToken')) ||
		(pathname === '/auth/reset-password' && !searchParams.has('resetToken'))
	)
}

const handlePageRouting = (request: NextRequest) => {
	const tokens = getTokens(request.cookies)
	const { pathname } = request.nextUrl

	if (isStartPage(pathname) && tokens.accessToken && tokens.refreshToken)
		return finalizeResponse(redirectTo('/home', request))

	if (!tokens.accessToken) {
		return isStartPage(pathname)
			? finalizeResponse(NextResponse.next(), true)
			: finalizeResponse(redirectTo('/', request), true)
	}

	if (!verifyToken(tokens.accessToken))
		return handleInvalidToken(tokens, request)
}

const isStartPage = (pathname: string) =>
	pathname === '/' || pathname.startsWith('/auth')

const handleInvalidToken = (
	tokens: ReturnType<typeof getTokens>,
	request: NextRequest
) => {
	const { accessToken, refreshToken, wasRefreshed } = tokens

	return accessToken && refreshToken && !wasRefreshed
		? refreshTokens(request)
		: finalizeResponse(redirectTo('/', request), true)
}

const redirectTo = (url: string, request: NextRequest) =>
	NextResponse.redirect(new URL(url, request.url))

const finalizeResponse = (response: NextResponse, clearCookies = false) => {
	response.headers.set('Cache-Control', 'no-store')
	if (clearCookies) return clearAuthCookies(response)
	return response
}

export const config = {
	matcher: [
		'/',
		'/auth/:path*',
		'/verification',
		'/home',
		'/table',
		'/folders',
		'/settings',
	],
}

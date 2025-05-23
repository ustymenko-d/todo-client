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
	const bypassConditions: Record<string, string> = {
		'/auth/reset-password': 'resetToken',
		'/verification': 'verificationToken',
	}

	return bypassConditions[pathname]
		? searchParams.has(bypassConditions[pathname])
		: false
}

const handlePageRouting = (request: NextRequest) => {
	const tokens = getTokens(request.cookies)
	const { accessToken, refreshToken } = tokens
	const { pathname } = request.nextUrl

	if (isStartPage(pathname) && accessToken && refreshToken)
		return redirectTo('/home', request)

	if (!accessToken) {
		return isStartPage(pathname)
			? finalizeResponse(NextResponse.next(), true)
			: finalizeResponse(redirectTo('/', request), true)
	}

	if (!verifyToken(tokens.accessToken))
		return handleInvalidToken(tokens, request)
}

const isStartPage = (pathname: string) =>
	pathname === '/' || pathname === '/auth'

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

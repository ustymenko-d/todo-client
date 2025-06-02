import { NextRequest, NextResponse } from 'next/server'

import { PUBLIC_PATHS_REQUIRING_TOKENS } from './const'
import isStartPage from './utils/isStartPage'
import { getTokens, verifyToken } from './utils/tokens'

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

const redirectTo = (url: string, request: NextRequest) =>
	NextResponse.redirect(new URL(url, request.url))

export const middleware = async (request: NextRequest) => {
	const { pathname, searchParams } = request.nextUrl
	const { accessToken, refreshToken } = getTokens(request.cookies)
	const isAccessValid = verifyToken(accessToken)

	const isAuthorized = isAccessValid || (accessToken && refreshToken)

	const tokenParam = PUBLIC_PATHS_REQUIRING_TOKENS[pathname]
	if (tokenParam) {
		return searchParams.has(tokenParam)
			? NextResponse.next()
			: redirectTo('/', request)
	}

	if (isStartPage(pathname)) {
		if (isAuthorized) {
			return redirectTo('/home', request)
		}
		return NextResponse.next()
	}

	if (!isAuthorized) {
		return redirectTo('/', request)
	}

	return NextResponse.next()
}

// export async function middleware(request: NextRequest) {
// 	if (shouldBypassMiddleware(request))
// 		return finalizeResponse(NextResponse.next())

// 	return handlePageRouting(request)
// }

// const shouldBypassMiddleware = (request: NextRequest) => {
// 	const { pathname, searchParams } = request.nextUrl
// 	const bypassConditions: Record<string, string> = {
// 		'/auth/reset-password': 'resetToken',
// 		'/verification': 'verificationToken',
// 	}

// 	return bypassConditions[pathname]
// 		? searchParams.has(bypassConditions[pathname])
// 		: false
// }

// const handlePageRouting = (request: NextRequest) => {
// 	const tokens = getTokens(request.cookies)
// 	const { accessToken, refreshToken } = tokens
// 	const { pathname } = request.nextUrl

// 	if (isStartPage(pathname) && accessToken && refreshToken)
// 		return redirectTo('/home', request)

// 	if (!accessToken) {
// 		return isStartPage(pathname)
// 			? finalizeResponse(NextResponse.next(), true)
// 			: finalizeResponse(redirectTo('/', request), true)
// 	}

// 	if (!verifyToken(tokens.accessToken))
// 		return handleInvalidToken(tokens, request)
// }

// const handleInvalidToken = (
// 	tokens: ReturnType<typeof getTokens>,
// 	request: NextRequest
// ) => {
// 	const { accessToken, refreshToken, wasRefreshed } = tokens

// 	return accessToken && refreshToken && !wasRefreshed
// 		? refreshTokens(request)
// 		: finalizeResponse(redirectTo('/', request), true)
// }

// const redirectTo = (url: string, request: NextRequest) =>
// 	NextResponse.redirect(new URL(url, request.url))

// const finalizeResponse = (response: NextResponse, clearCookies = false) => {
// 	response.headers.set('Cache-Control', 'no-store')
// 	if (clearCookies) return clearAuthCookies(response)
// 	return response
// }

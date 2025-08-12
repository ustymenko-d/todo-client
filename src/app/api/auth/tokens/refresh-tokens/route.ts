import { NextResponse } from 'next/server'

import { handleRequest } from '@/api/Axios'

export const GET = async (): Promise<NextResponse> =>
	handleRequest('/auth/tokens/refresh-tokens', 'get', undefined)

// export const GET = async (request: NextRequest): Promise<NextResponse> => {
// 	const redirectUrl = getRedirectUrl(request)
// 	const cookie = request.headers.get('cookie') || ''

// 	console.log('[Refresh] Starting token refresh...')
// 	console.log('[Refresh] Redirecting to:', redirectUrl.toString())
// 	console.log('Sent Cookie:', cookie)

// 	try {
// 		const response = await handleRequest(
// 			'/auth/tokens/refresh-tokens',
// 			'get',
// 			undefined,
// 			{
// 				skipRefresh: true,
// 				headers: {
// 					Cookie: cookie,
// 				},
// 			}
// 		)

// 		const setCookie = response.headers.get('set-cookie')

// 		if (setCookie) return buildRedirectResponse(setCookie, redirectUrl)
// 	} catch (error) {
// 		console.error('[Refresh] Token refresh failed:', {
// 			error,
// 			requestUrl: request.nextUrl.href,
// 		})
// 	}

// 	return buildFallbackResponse(request)
// }

// const getRedirectUrl = (request: NextRequest) => {
// 	const redirectPath = request.nextUrl.searchParams.get('redirect') || '/'
// 	return new URL(redirectPath, request.nextUrl.origin)
// }

// const buildRedirectResponse = (
// 	setCookieHeader: string,
// 	url: URL
// ): NextResponse => {
// 	const response = NextResponse.redirect(url)

// 	clearAuthCookies(response)

// 	const cookies = splitCookiesString(setCookieHeader)

// 	cookies.forEach((rawCookie) => {
// 		const { name, value, ...options } = parse(rawCookie)[0]
// 		response.cookies.set(name, value, parseCookieOptions(options))
// 	})

// 	response.cookies.set('refreshed', 'true', {
// 		httpOnly: true,
// 		path: '/',
// 		sameSite: 'lax',
// 		maxAge: 60 * 5,
// 	})

// 	return response
// }

// const parseCookieOptions = (options: {
// 	httpOnly?: boolean
// 	secure?: boolean
// 	path?: string
// 	maxAge?: number
// 	sameSite?: string
// 	partitioned?: boolean
// }) => ({
// 	httpOnly: options.httpOnly,
// 	secure: options.secure,
// 	path: options.path || '/',
// 	maxAge: options.maxAge,
// 	sameSite: parseSameSite(options.sameSite),
// 	partitioned: options.partitioned,
// })

// const parseSameSite = (
// 	sameSite?: string
// ): 'lax' | 'strict' | 'none' | undefined => {
// 	const validSameSite = {
// 		lax: 'lax' as const,
// 		strict: 'strict' as const,
// 		none: 'none' as const,
// 	}

// 	return (
// 		validSameSite[sameSite?.toLowerCase() as keyof typeof validSameSite] ??
// 		undefined
// 	)
// }

// const buildFallbackResponse = (request: NextRequest): NextResponse => {
// 	const clearUrl = new URL(
// 		'/api/auth/cookies/clear-auth-cookies',
// 		request.nextUrl.origin
// 	)

// 	console.warn(
// 		'[Refresh] Redirected to fallback, tokens cleared. Fallback URL:',
// 		clearUrl.toString()
// 	)

// 	return NextResponse.redirect(clearUrl)
// }

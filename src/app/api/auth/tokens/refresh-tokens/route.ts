import { NextRequest, NextResponse } from 'next/server'
import { handleRequest } from '@/services/requestHandler'
import { splitCookiesString, parse } from 'set-cookie-parser'
import clearAuthCookies from '@/utils/clearAuthCookies'

export const GET = async (request: NextRequest): Promise<NextResponse> => {
	const redirectUrl = getRedirectUrl(request)
	const cookie = request.headers.get('cookie') || ''

	logRefreshAttempt(redirectUrl)

	try {
		const response = await handleRequest(
			'/auth/tokens/refresh-tokens',
			'get',
			undefined,
			{
				skipRefresh: true,
				headers: {
					Cookie: cookie,
				},
			}
		)

		const setCookie = response.headers.get('set-cookie')

		if (setCookie) return buildRedirectResponse(setCookie, redirectUrl)
	} catch (error) {
		console.error('[Refresh] Token refresh failed:', {
			error,
			requestUrl: request.nextUrl.href,
		})
	}

	return buildFallbackResponse(request)
}

const getRedirectUrl = (request: NextRequest) => {
	const redirectPath = request.nextUrl.searchParams.get('redirect') || '/home'
	return new URL(redirectPath, request.nextUrl.origin)
}

const logRefreshAttempt = (redirectUrl: URL) => {
	console.log('[Refresh] Starting token refresh...')
	console.log('[Refresh] Redirecting to:', redirectUrl.toString())
}

const buildRedirectResponse = (
	setCookieHeader: string,
	url: URL
): NextResponse => {
	const response = NextResponse.redirect(url)

	clearAuthCookies(response)

	const cookies = splitCookiesString(setCookieHeader)

	cookies.forEach((rawCookie) => {
		const { name, value, ...options } = parse(rawCookie)[0]
		response.cookies.set(name, value, parseCookieOptions(options))
	})

	response.cookies.set('refreshed', 'true', {
		httpOnly: true,
		path: '/',
		sameSite: 'lax',
		maxAge: 30,
	})

	return response
}

const parseCookieOptions = (options: {
	httpOnly?: boolean
	secure?: boolean
	path?: string
	maxAge?: number
	sameSite?: string
}) => ({
	httpOnly: options.httpOnly,
	secure: options.secure,
	path: options.path || '/',
	maxAge: options.maxAge,
	sameSite: parseSameSite(options.sameSite),
})

const parseSameSite = (
	sameSite?: string
): 'lax' | 'strict' | 'none' | undefined => {
	const validSameSite = {
		lax: 'lax' as const,
		strict: 'strict' as const,
		none: 'none' as const,
	}

	return (
		validSameSite[sameSite?.toLowerCase() as keyof typeof validSameSite] ??
		undefined
	)
}

const buildFallbackResponse = (request: NextRequest): NextResponse => {
	const fallbackUrl = new URL('/', request.nextUrl.origin)
	const response = NextResponse.redirect(fallbackUrl)

	clearAuthCookies(response)
	console.warn('[Refresh] Redirected to fallback, tokens cleared.')

	return response
}

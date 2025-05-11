import { NextRequest, NextResponse } from 'next/server'
import { handleRequest } from '@/services/requestHandler'
import { splitCookiesString, parse } from 'set-cookie-parser'

export const GET = async (request: NextRequest): Promise<NextResponse> => {
	const redirectPath = request.nextUrl.searchParams.get('redirect') || '/home'
	const redirectUrl = new URL(redirectPath, request.nextUrl.origin)

	console.log('[Refresh] Starting token refresh...')
	console.log('[Refresh] Redirecting to:', redirectUrl.toString())

	try {
		const response = await handleRequest('/auth/tokens/refresh-tokens', 'get', {
			skipRefresh: true,
		})

		const setCookie = response.headers.get('set-cookie')

		if (setCookie) {
			console.log('[Refresh] Tokens refreshed successfully')
			return buildRedirectResponse(redirectUrl, setCookie)
		}
	} catch (error) {
		console.error('[Refresh] Token refresh failed:', {
			error,
			requestUrl: request.nextUrl.href,
		})
	}

	return buildFallbackResponse(request)
}

const buildRedirectResponse = (
	url: URL,
	setCookieHeader: string
): NextResponse => {
	const response = NextResponse.redirect(url)
	const cookies = splitCookiesString(setCookieHeader)

	for (const rawCookie of cookies) {
		const { name, value, ...options } = parse(rawCookie)[0]

		let sameSite: 'lax' | 'strict' | 'none' | undefined
		switch ((options.sameSite || '').toLowerCase()) {
			case 'lax':
				sameSite = 'lax'
				break
			case 'strict':
				sameSite = 'strict'
				break
			case 'none':
				sameSite = 'none'
				break
			default:
				sameSite = undefined
		}

		response.cookies.set(name, value, {
			httpOnly: options.httpOnly,
			sameSite,
			path: options.path || '/',
			maxAge: options.maxAge,
			secure: options.secure,
		})
	}

	response.cookies.set('refreshed', 'true', {
		httpOnly: true,
		path: '/',
		sameSite: 'lax',
		maxAge: 60,
	})

	return response
}

const buildFallbackResponse = (request: NextRequest): NextResponse => {
	const fallbackUrl = new URL('/', request.nextUrl.origin)
	const response = NextResponse.redirect(fallbackUrl)

	response.cookies.set('access_token', '', { maxAge: 0, path: '/' })
	response.cookies.set('refresh_token', '', { maxAge: 0, path: '/' })
	response.cookies.set('refreshed', '', { maxAge: 0, path: '/' })
	console.warn('[Refresh] Redirected to fallback, tokens cleared.')

	return response
}

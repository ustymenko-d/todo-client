import { NextRequest, NextResponse } from 'next/server'
import RequestHandler from '@/utils/RequestHandler'

export const GET = async (request: NextRequest): Promise<NextResponse> => {
	const redirectBackTo = getRedirectPath(request)
	const redirectUrl = buildRedirectUrl(request, redirectBackTo)

	try {
		const response = await RequestHandler.request(
			'/auth/tokens/refresh-tokens',
			'get',
			{ skipRefresh: true }
		)

		const setCookie = response.headers.get('set-cookie')

		if (setCookie) return buildRedirectResponse(redirectUrl, setCookie)
	} catch (error) {
		console.error('[Token refresh failed]', {
			error,
			requestUrl: request.nextUrl.href,
		})
	}

	return buildFallbackResponse(request)
}

const getRedirectPath = (request: NextRequest): string =>
	request.nextUrl.searchParams.get('redirect') || '/dashboard'

const buildRedirectUrl = (request: NextRequest, path: string): URL => {
	const url = new URL(path, request.nextUrl.origin)
	url.searchParams.set('refreshed', 'true')
	return url
}

const buildRedirectResponse = (url: URL, setCookie: string): NextResponse => {
	const response = NextResponse.redirect(url)
	response.headers.set('set-cookie', setCookie)
	return response
}

const buildFallbackResponse = (request: NextRequest): NextResponse => {
	const fallbackUrl = new URL('/', request.nextUrl.origin)
	const response = NextResponse.redirect(fallbackUrl)

	response.cookies.set('access_token', '', { maxAge: 0, path: '/' })
	response.cookies.set('refresh_token', '', { maxAge: 0, path: '/' })

	return response
}

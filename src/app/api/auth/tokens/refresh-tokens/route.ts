import RequestHandler from '@/utils/RequestHandler'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest): Promise<NextResponse> {
	const redirectBackTo =
		request.nextUrl.searchParams.get('redirect') || '/dashboard'
	const redirectUrl = new URL(redirectBackTo, request.nextUrl.origin)
	redirectUrl.searchParams.set('refreshed', 'true')

	try {
		const response = await RequestHandler.request(
			'/auth/tokens/refresh-tokens',
			'get',
			{ skipRefresh: true }
		)

		const setCookie = response.headers.get('set-cookie')

		if (setCookie) {
			const redirectResponse = NextResponse.redirect(redirectUrl)
			redirectResponse.headers.set('set-cookie', setCookie)
			return redirectResponse
		}
	} catch (error) {
		console.error('Token refresh failed:', error)
	}

	const fallbackUrl = new URL('/', request.nextUrl.origin).toString()
	const errorResponse = NextResponse.redirect(fallbackUrl)
	errorResponse.cookies.set('access_token', '', { maxAge: 0, path: '/' })
	errorResponse.cookies.set('refresh_token', '', { maxAge: 0, path: '/' })
	return errorResponse
}

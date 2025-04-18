import RequestHandler from '@/utils/RequestHandler'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest): Promise<NextResponse> {
	const redirectBackTo =
		req.nextUrl.searchParams.get('redirect') || '/dashboard'
	const redirectBackToUrl = new URL(
		redirectBackTo,
		req.nextUrl.origin
	).toString()

	const response = await RequestHandler.request(
		'/auth/tokens/refresh-tokens',
		'get',
		{
			skipRefresh: true,
		}
	)

	const setCookie = response.headers.get('set-cookie')

	if (setCookie) {
		const redirectResponse = NextResponse.redirect(redirectBackToUrl)
		redirectResponse.headers.set('set-cookie', setCookie)
		return redirectResponse
	}

	const fallbackUrl = new URL('/', req.nextUrl.origin).toString()
	const errorResponse = NextResponse.redirect(fallbackUrl)
	errorResponse.cookies.set('access_token', '', { maxAge: 0, path: '/' })
	errorResponse.cookies.set('refresh_token', '', { maxAge: 0, path: '/' })
	return errorResponse
}

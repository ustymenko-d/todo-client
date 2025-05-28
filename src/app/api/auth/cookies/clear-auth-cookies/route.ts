import { NextRequest, NextResponse } from 'next/server'

import { handleRequest } from '@/services/requestHandler'

// export const GET = async (): Promise<NextResponse> =>
// 	handleRequest('/auth/cookies/clear-auth-cookies', 'get', undefined, {
// 		skipRefresh: true,
// 	})

export const GET = async (request: NextRequest): Promise<NextResponse> => {
	try {
		await handleRequest('/auth/cookies/clear-auth-cookies', 'get', undefined, {
			skipRefresh: true,
		})

		console.log(
			"[ClearCookiesAPI] Successfully called backend. Redirecting to: '/'"
		)
	} catch (error) {
		console.error(
			'[ClearCookiesAPI] Failed to call backend clear route:',
			error
		)
	}

	return NextResponse.redirect(new URL('/', request.nextUrl.origin))
}

import { NextResponse } from 'next/server'

const clearAuthCookies = (response: NextResponse): NextResponse => {
	;['access_token', 'refresh_token', 'refreshed'].forEach((cookie) =>
		response.cookies.set(cookie, '', { path: '/', maxAge: 0 })
	)
	return response
}

export default clearAuthCookies

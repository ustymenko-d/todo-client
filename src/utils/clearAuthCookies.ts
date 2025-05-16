import { NextResponse } from 'next/server'

const COOKIES_TO_CLEAN = [
	'accessToken',
	'refreshToken',
	'refreshed',
	'rememberMe',
]

const clearAuthCookies = (response: NextResponse): NextResponse => {
	COOKIES_TO_CLEAN.forEach((cookie) => {
		response.cookies.set(cookie, '', { path: '/', maxAge: 0 })
		response.cookies.delete(cookie)
	})
	return response
}

export default clearAuthCookies

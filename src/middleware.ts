import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import TokenService from './utils/token'

const redirectTo = (url: string, request: NextRequest) => {
	return NextResponse.redirect(new URL(url, request.url))
}

export async function middleware(request: NextRequest) {
	const accessToken = request.cookies.get('access_token')
	const refreshToken = request.cookies.get('refresh_token')
	const isValid = accessToken
		? TokenService.verifyToken(accessToken.value)
		: false

	const url = request.nextUrl

	if (url.pathname === '/auth/refresh' && isValid) {
		return redirectTo('/dashboard', request)
	}

	if (url.pathname.startsWith('/dashboard')) {
		if (!isValid)
			return refreshToken
				? redirectTo('/auth/refresh', request)
				: redirectTo('/', request)
	}

	if (url.pathname === '/' || url.pathname === '/auth') {
		if (isValid) {
			return redirectTo('/dashboard', request)
		} else {
			if (refreshToken) {
				return redirectTo('/auth/refresh', request)
			}
		}
	}

	if (
		url.pathname.startsWith('/auth/verification') ||
		url.pathname.startsWith('/auth/reset-password')
	) {
		const token = url.pathname.startsWith('/auth/verification')
			? url.searchParams.get('verificationToken')
			: url.searchParams.get('resetToken')

		if (!token) {
			return redirectTo('/', request)
		}
	}

	return NextResponse.next()
}

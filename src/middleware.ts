import { NextRequest, NextResponse } from 'next/server'
import verifyToken from './utils/tokens'
import AuthService from './services/auth.service'

export const config = {
	matcher: ['/', '/auth/:path*', '/dashboard', '/table', '/settings'],
}

export const redirectTo = (url: string, request: NextRequest) =>
	NextResponse.redirect(new URL(url, request.url))

export async function middleware(request: NextRequest) {
	const { nextUrl, cookies } = request
	const { pathname, searchParams } = nextUrl

	const accessToken = cookies.get('access_token')?.value
	const refreshToken = cookies.get('refresh_token')?.value
	const wasRefreshed = cookies.get('refreshed')?.value === 'true'
	const resetPasswordToken = searchParams.get('resetToken')
	const verificationToken = searchParams.get('verificationToken')

	const isStartPage = pathname === '/' || pathname.startsWith('/auth')

	console.log('[Middleware] Path:', pathname)
	console.log('[Middleware] wasRefreshed:', wasRefreshed)

	if (verificationToken) {
		try {
			await AuthService.verifyEmail(verificationToken)
		} catch (error) {
			console.error('[Middleware] Email verification failed:', error)
		}
		const cleanUrl = new URL(request.url)
		cleanUrl.searchParams.delete('verificationToken')
		return NextResponse.redirect(cleanUrl)
	}

	if (pathname === '/auth/reset-password' && !resetPasswordToken) {
		return redirectTo('/', request)
	}

	if (isStartPage) {
		if (verifyToken(accessToken)) {
			return redirectTo('/dashboard', request)
		}

		if (refreshToken && !wasRefreshed) {
			const refreshUrl = new URL('/api/auth/tokens/refresh-tokens', request.url)
			refreshUrl.searchParams.set('redirect', request.nextUrl.pathname)
			console.log('[Middleware] Redirecting to refresh tokens (start page)...')
			return NextResponse.redirect(refreshUrl)
		}

		const response = NextResponse.next()
		response.headers.set('Cache-Control', 'no-store')
		response.cookies.set('refreshed', '', { path: '/', maxAge: 0 })
		return response
	}

	if (!accessToken) {
		return redirectTo('/', request)
	}

	if (!verifyToken(accessToken)) {
		if (refreshToken && !wasRefreshed) {
			const refreshUrl = new URL('/api/auth/tokens/refresh-tokens', request.url)
			refreshUrl.searchParams.set('redirect', pathname)
			console.log(
				'[Middleware] Redirecting to refresh tokens (non-start page)...'
			)
			return NextResponse.redirect(refreshUrl)
		}

		return redirectTo('/', request)
	}

	const response = NextResponse.next()
	response.headers.set('Cache-Control', 'no-store')
	response.cookies.set('refreshed', '', { path: '/', maxAge: 0 })
	return response
}

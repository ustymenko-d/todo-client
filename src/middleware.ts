import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './utils/tokens'
import AuthService from './services/Axios/auth.service'

export const redirectTo = (url: string, request: NextRequest) =>
	NextResponse.redirect(new URL(url, request.url))

export async function middleware(request: NextRequest) {
	const { nextUrl, cookies } = request
	const { pathname, searchParams } = nextUrl
	const accessToken = cookies.get('access_token')?.value
	const refreshToken = cookies.get('refresh_token')?.value
	const wasRefreshed = searchParams.get('refreshed') === 'true'
	const resetPasswordToken = searchParams.get('resetToken')
	const verificationToken = searchParams.get('verificationToken')
	const isAuthPage = pathname === '/' || pathname.startsWith('/auth')
	const isDashboardPage = pathname.startsWith('/dashboard')

	if (verificationToken) {
		try {
			await AuthService.verifyEmail(verificationToken)
		} catch (error) {
			console.error('Email verification failed:', error)
		}
		const cleanUrl = new URL(request.url)
		cleanUrl.searchParams.delete('verificationToken')
		return NextResponse.redirect(cleanUrl)
	}

	if (pathname === '/auth/reset-password' && !resetPasswordToken) {
		return redirectTo('/', request)
	}

	if (isAuthPage) {
		if (accessToken && verifyToken(accessToken)) {
			return redirectTo('/dashboard', request)
		}

		if (refreshToken && !wasRefreshed) {
			const refreshUrl = new URL('/api/auth/tokens/refresh-tokens', request.url)
			refreshUrl.searchParams.set('redirect', request.nextUrl.pathname)

			return NextResponse.redirect(refreshUrl)
		}

		return NextResponse.next({
			headers: { 'Cache-Control': 'no-store' },
		})
	}

	if (isDashboardPage) {
		if (!accessToken) {
			return redirectTo('/', request)
		}

		if (!verifyToken(accessToken)) {
			if (refreshToken && !wasRefreshed) {
				const refreshUrl = new URL(
					'/api/auth/tokens/refresh-tokens',
					request.url
				)
				refreshUrl.searchParams.set('redirect', pathname)
				return NextResponse.redirect(refreshUrl)
			}

			return redirectTo('/', request)
		}
	}

	return NextResponse.next({
		headers: { 'Cache-Control': 'no-store' },
	})
}

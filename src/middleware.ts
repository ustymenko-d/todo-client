import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { refreshTokens, verifyToken } from './utils/tokens'
import AuthService from './services/Axios/auth.service'

export const redirectTo = (url: string, request: NextRequest) =>
	NextResponse.redirect(new URL(url, request.url))

export async function middleware(request: NextRequest) {
	const { nextUrl, cookies } = request
	const { pathname, searchParams } = nextUrl
	const accessToken = cookies.get('access_token')?.value
	const refreshToken = cookies.get('refresh_token')?.value
	const isRefreshing = cookies.get('is_refreshing')?.value === 'true'
	const resetPasswordToken = searchParams.get('resetToken')
	const verificationToken = searchParams.get('verificationToken')
	const isAuthPage = pathname === '/' || pathname.startsWith('/auth')
	const isDashboardPage = pathname.startsWith('/dashboard')

	if (verificationToken) {
		try {
			await AuthService.verifyEmail(verificationToken)
		} catch (e) {
			console.error('Email verification failed:', e)
		}
		const cleanUrl = new URL(request.url)
		cleanUrl.searchParams.delete('verificationToken')
		return NextResponse.redirect(cleanUrl)
	}

	if (pathname === '/auth/reset-password' && !resetPasswordToken) {
		return redirectTo('/', request)
	}

	if (isAuthPage) {
		if (accessToken) {
			if (verifyToken(accessToken)) {
				return redirectTo('/dashboard', request)
			} else if (refreshToken && !isRefreshing) {
				const response = await refreshTokens(accessToken, refreshToken, request)

				if (response) {
					response.cookies.set('is_refreshing', 'true', { maxAge: 5 })
					return response
				}
			}
		}
		return NextResponse.next()
	}

	if (isDashboardPage) {
		if (!accessToken) {
			return redirectTo('/', request)
		}

		if (!verifyToken(accessToken)) {
			if (refreshToken && !isRefreshing) {
				const response = await refreshTokens(accessToken, refreshToken, request)
				if (response) {
					response.cookies.set('is_refreshing', 'true', { maxAge: 5 })
					return response
				}
			} else if (!refreshToken) {
				return redirectTo('/', request)
			}
		}
	}

	const response = NextResponse.next()
	if (isRefreshing) {
		response.cookies.set('is_refreshing', '', { maxAge: 0 })
	}
	return NextResponse.next()
}

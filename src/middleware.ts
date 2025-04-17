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
	const resetPasswordToken = searchParams.get('resetToken')
	const verificationToken = searchParams.get('verificationToken')

	const isAuthPage = pathname === '/' || pathname.startsWith('/auth')
	const isDashboardPage = pathname.startsWith('/dashboard')
	const isRefreshing = searchParams.has('isRefreshing')

	if (verificationToken) {
		await AuthService.verifyEmail(verificationToken)
	}

	if (pathname === '/auth/reset-password' && !resetPasswordToken) {
		return redirectTo('/', request)
	}

	if (isAuthPage) {
		if (accessToken) {
			if (verifyToken(accessToken)) {
				return redirectTo('/dashboard', request)
			} else if (refreshToken && !isRefreshing) {
				const refreshed = await refreshTokens(
					accessToken,
					refreshToken,
					request
				)

				if (refreshed) return refreshed
			}
		}
		return NextResponse.next()
	}

	if (isDashboardPage) {
		if (!accessToken) {
			return redirectTo('/', request)
		}

		if (!verifyToken(accessToken) && refreshToken && !isRefreshing) {
			const refreshed = await refreshTokens(accessToken, refreshToken, request)
			if (refreshed) return refreshed
		}
	}

	return NextResponse.next()
}

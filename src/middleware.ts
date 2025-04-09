import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { refreshTokens, verifyToken } from './utils/tokens'
import AuthService from './services/auth.service'

export const redirectTo = (url: string, request: NextRequest) => {
	return NextResponse.redirect(new URL(url, request.url))
}

export async function middleware(request: NextRequest) {
	const { nextUrl: url, cookies } = request
	const { pathname, searchParams } = url

	const accessToken = cookies.get('access_token')?.value
	const refreshToken = cookies.get('refresh_token')?.value
	const resetPasswordToken = searchParams.get('resetToken')
	const verificationToken = searchParams.get('verificationToken')
	const isValidAccess = accessToken && verifyToken(accessToken)

	if (verificationToken) {
		await AuthService.verifyEmail(`verificationToken=${verificationToken}`)
	}

	if (pathname === '/' || pathname.startsWith('/auth')) {
		if (accessToken) {
			if (isValidAccess) {
				return redirectTo('/dashboard', request)
			}
			if (refreshToken) {
				return refreshTokens(accessToken, refreshToken, request)
			}
		}
	}

	if (pathname.startsWith('/dashboard')) {
		if (!accessToken) return redirectTo('/', request)

		if (!isValidAccess)
			return refreshToken
				? refreshTokens(accessToken, refreshToken, request)
				: redirectTo('/', request)
	}

	if (pathname === '/auth/reset-password' && !resetPasswordToken)
		return redirectTo('/', request)

	return NextResponse.next()
}

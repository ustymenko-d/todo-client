import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { refreshTokens, verifyToken } from './utils/tokens'
import AuthService from './services/auth.service'

export const redirectTo = (url: string, request: NextRequest) => {
	return NextResponse.redirect(new URL(url, request.url))
}

export async function middleware(request: NextRequest) {
	const url = request.nextUrl
	const { pathname } = url
	const accessToken = request.cookies.get('access_token')
	const refreshToken = request.cookies.get('refresh_token')
	const resetPasswordToken = url.searchParams.get('resetToken')
	const verificationToken = url.searchParams.get('verificationToken')
	const isValid = accessToken ? verifyToken(accessToken.value) : false

	if (verificationToken)
		await AuthService.verifyEmail(`verificationToken=${verificationToken}`)

	if (pathname === '/' || pathname.startsWith('/auth')) {
		if (accessToken && !isValid) {
			if (refreshToken) {
				return refreshTokens(accessToken.value, refreshToken.value, request)
			}
		}
		if (accessToken && isValid) return redirectTo('/dashboard', request)
	}

	if (pathname.startsWith('/dashboard')) {
		if (!accessToken) return redirectTo('/', request)

		if (accessToken && !isValid)
			return refreshToken
				? refreshTokens(accessToken.value, refreshToken.value, request)
				: redirectTo('/', request)
	}

	if (pathname === '/auth/reset-password' && !resetPasswordToken)
		return redirectTo('/', request)

	return NextResponse.next()
}

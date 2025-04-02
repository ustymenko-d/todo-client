import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './utils/token'
import AuthService from './services/api/auth'

export const redirectTo = (url: string, request: NextRequest) => {
	return NextResponse.redirect(new URL(url, request.url))
}

export async function middleware(request: NextRequest) {
	const url = request.nextUrl
	const { pathname } = url
	const accessToken = request.cookies.get('access_token')
	const resetPasswordToken = url.searchParams.get('resetToken')
	const verificationToken = url.searchParams.get('verificationToken')
	const isValid = accessToken ? verifyToken(accessToken.value) : false

	if (verificationToken)
		await AuthService.verifyEmail(`verificationToken=${verificationToken}`)

	if (pathname === '/' || pathname.startsWith('/auth')) {
		if (isValid) return redirectTo('/dashboard', request)
	}

	if (pathname.startsWith('/dashboard'))
		if (!isValid) return redirectTo('/', request)

	if (pathname === '/auth/reset-password' && !resetPasswordToken)
		return redirectTo('/', request)

	return NextResponse.next()
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './utils/tokens'
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
			if (verifyToken(accessToken) || refreshToken) {
				return redirectTo('/dashboard', request)
			}
		}
	}

	if (isDashboardPage) {
		if (!accessToken || (!verifyToken(accessToken) && !refreshToken)) {
			return redirectTo('/', request)
		}
	}

	return NextResponse.next()
}

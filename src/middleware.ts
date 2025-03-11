import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './utils/token'

const redirectTo = (url: string, request: NextRequest) => {
	return NextResponse.redirect(new URL(url, request.url))
}

const setCookies = (
	response: NextResponse,
	cookies: Record<string, string>
) => {
	for (const [name, value] of Object.entries(cookies)) {
		response.cookies.set(name, value, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			path: '/',
		})
	}
}

const refreshTokens = async (
	accessToken: string,
	refreshToken: string,
	request: NextRequest
) => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
			{
				headers: {
					'Content-Type': 'application/json',
					Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`,
				},

				cache: 'no-store',
			}
		)

		if (response.ok) {
			const setCookiesHeader = response.headers.get('set-cookie')
			const cookies: Record<string, string> = {}

			if (setCookiesHeader) {
				const accessTokenMatch = setCookiesHeader.match(/access_token=([^;]+)/)
				const refreshTokenMatch = setCookiesHeader.match(
					/refresh_token=([^;]+)/
				)

				if (accessTokenMatch) cookies['access_token'] = accessTokenMatch[1]
				if (refreshTokenMatch) cookies['refresh_token'] = refreshTokenMatch[1]

				const nextResponse = NextResponse.next()
				setCookies(nextResponse, cookies)
				return nextResponse
			}
		}
	} catch (error) {
		console.error(error)
	}
	return redirectTo('/', request)
}

export async function middleware(request: NextRequest) {
	const accessToken = request.cookies.get('access_token')
	const refreshToken = request.cookies.get('refresh_token')
	const isValid = accessToken ? verifyToken(accessToken.value) : false
	const url = request.nextUrl
	const { pathname } = url

	if (pathname === '/' || pathname.startsWith('/auth')) {
		if (accessToken && !isValid) {
			if (refreshToken) {
				refreshTokens(accessToken.value, refreshToken.value, request)
			}
		}
		if (accessToken && isValid) {
			return redirectTo('/dashboard', request)
		}
	}

	if (pathname.startsWith('/dashboard')) {
		if (!accessToken) {
			return redirectTo('/', request)
		}

		if (accessToken && !isValid) {
			return refreshToken
				? refreshTokens(accessToken.value, refreshToken.value, request)
				: redirectTo('/', request)
		}
	}

	if (
		pathname === '/auth/verification' ||
		pathname === '/auth/reset-password'
	) {
		const token =
			pathname === '/auth/verification'
				? url.searchParams.get('verificationToken')
				: url.searchParams.get('resetToken')

		if (!token) {
			return redirectTo('/', request)
		}
	}

	return NextResponse.next()
}

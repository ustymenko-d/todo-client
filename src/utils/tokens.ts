import { jwtDecode } from 'jwt-decode'
import { NextRequest, NextResponse } from 'next/server'
import { redirectTo } from '@/middleware'
import { setCookies } from './cookies'

export const verifyToken = (accessToken: string): boolean => {
	try {
		const { exp }: { exp: number } = jwtDecode(accessToken)
		const now = Math.floor(Date.now() / 1000)
		return exp > now
	} catch {
		return false
	}
}

const fetchRefreshTokens = async (
	accessToken: string,
	refreshToken: string
): Promise<Record<string, string> | null> => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/auth/tokens/refresh-tokens`,
			{
				headers: {
					'Content-Type': 'application/json',
					Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`,
				},
				cache: 'no-store',
			}
		)

		if (!response.ok) return null

		const setCookiesHeader = response.headers.get('set-cookie')
		if (!setCookiesHeader) return null

		const accessTokenMatch = setCookiesHeader.match(/access_token=([^;]+)/)
		const refreshTokenMatch = setCookiesHeader.match(/refresh_token=([^;]+)/)
		if (!accessTokenMatch || !refreshTokenMatch) return null

		return {
			access_token: accessTokenMatch[1],
			refresh_token: refreshTokenMatch[1],
		}
	} catch (err) {
		console.error('Token fetch failed', err)
		return null
	}
}

export const refreshTokens = async (
	accessToken: string,
	refreshToken: string,
	request: NextRequest
): Promise<NextResponse | null> => {
	const tokens = await fetchRefreshTokens(accessToken, refreshToken)

	if (tokens) {
		const url = new URL(request.nextUrl)
		url.searchParams.set('isRefreshing', 'true')
		const response = NextResponse.redirect(url)
		setCookies(response, tokens)
		return response
	} else {
		const response = redirectTo('/', request)
		response.cookies.set('access_token', '', { maxAge: 0 })
		response.cookies.set('refresh_token', '', { maxAge: 0 })
		return response
	}
}

import { jwtDecode } from 'jwt-decode'
import { NextRequest, NextResponse } from 'next/server'
import { redirectTo } from '@/middleware'
import { setCookies } from './cookies'

export const verifyToken = (accessToken: string): boolean => {
	try {
		const decodedToken: { exp: number } = jwtDecode(accessToken)
		const currentTime = Math.floor(Date.now() / 1000)
		return decodedToken.exp !== undefined && decodedToken.exp > currentTime
	} catch (error) {
		console.error('Invalid token format', error)
		return false
	}
}

const fetchRefreshTokens = async (
	accessToken: string,
	refreshToken: string
): Promise<Record<string, string> | null> => {
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

	if (!response.ok) return null

	const setCookiesHeader = response.headers.get('set-cookie')

	if (!setCookiesHeader) return null

	const cookies: Record<string, string> = {}
	const accessTokenMatch = setCookiesHeader.match(/access_token=([^;]+)/)
	const refreshTokenMatch = setCookiesHeader.match(/refresh_token=([^;]+)/)

	if (accessTokenMatch && refreshTokenMatch) {
		cookies['access_token'] = accessTokenMatch[1]
		cookies['refresh_token'] = refreshTokenMatch[1]
	}

	return cookies
}

export const refreshTokens = async (
	accessToken: string,
	refreshToken: string,
	request: NextRequest
) => {
	try {
		const cookies = await fetchRefreshTokens(accessToken, refreshToken)
		if (cookies) {
			const nextResponse = NextResponse.next()
			setCookies(nextResponse, cookies)
			return nextResponse
		}
	} catch (error) {
		console.error('Token refresh failed:', error)
	}

	return redirectTo('/', request)
}

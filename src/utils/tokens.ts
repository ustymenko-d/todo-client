import { jwtDecode } from 'jwt-decode'
import { NextRequest } from 'next/server'

export const getTokens = (cookies: NextRequest['cookies']) => ({
	accessToken: cookies.get('accessToken')?.value,
	refreshToken: cookies.get('refreshToken')?.value,
	// wasRefreshed: cookies.get('refreshed')?.value === 'true',
	rememberMe: cookies.get('refreshed')?.value === 'true',
})

export const verifyToken = (accessToken?: string): boolean => {
	if (!accessToken) return false

	try {
		const { exp }: { exp: number } = jwtDecode(accessToken)
		const currentTime = Math.floor(Date.now() / 1000)
		return exp > currentTime
	} catch {
		return false
	}
}

// export const refreshTokens = (request: NextRequest) => {
// 	const refreshUrl = new URL('/api/auth/tokens/refresh-tokens', request.url)
// 	refreshUrl.searchParams.set('redirect', request.nextUrl.pathname)
// 	return NextResponse.redirect(refreshUrl)
// }

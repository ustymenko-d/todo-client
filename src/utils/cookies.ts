import { NextResponse } from 'next/server'

export const setCookies = (
	response: NextResponse,
	cookies: Record<string, string>
) => {
	Object.entries(cookies).forEach(([name, value]) =>
		response.cookies.set(name, value, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
		})
	)
}

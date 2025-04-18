import { jwtDecode } from 'jwt-decode'

export const verifyToken = (accessToken: string): boolean => {
	try {
		const { exp }: { exp: number } = jwtDecode(accessToken)
		const now = Math.floor(Date.now() / 1000)
		return exp > now
	} catch {
		return false
	}
}

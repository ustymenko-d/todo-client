import { jwtDecode } from 'jwt-decode'

const verifyToken = (accessToken?: string): boolean => {
	if (!accessToken) return false

	try {
		const { exp }: { exp: number } = jwtDecode(accessToken)
		const now = Math.floor(Date.now() / 1000)
		return exp > now
	} catch {
		return false
	}
}

export default verifyToken

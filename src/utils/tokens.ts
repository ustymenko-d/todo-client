import { jwtDecode } from 'jwt-decode'

const verifyToken = (accessToken?: string): boolean => {
	if (!accessToken) return false

	try {
		const { exp }: { exp: number } = jwtDecode(accessToken)
		const currentTime = Math.floor(Date.now() / 1000)
		return exp > currentTime
	} catch {
		return false
	}
}

export default verifyToken

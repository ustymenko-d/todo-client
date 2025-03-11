import { jwtDecode } from 'jwt-decode'

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

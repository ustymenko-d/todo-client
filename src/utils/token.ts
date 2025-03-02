import { jwtDecode } from 'jwt-decode'

const setStorageToken = (token: string, rememberUser: boolean) => {
	const storage: Storage = rememberUser ? localStorage : sessionStorage
	storage.setItem('access_token', token)
}

const getStorageToken = (): string | null => {
	return (
		localStorage.getItem('access_token') ||
		sessionStorage.getItem('access_token')
	)
}

const removeStorageToken = () => {
	localStorage.removeItem('access_token')
	sessionStorage.removeItem('access_token')
}

const verifyToken = (accessToken: string): boolean => {
	try {
		const decodedToken: { exp: number } = jwtDecode(accessToken)
		const currentTime = Math.floor(Date.now() / 1000)
		return decodedToken.exp !== undefined && decodedToken.exp > currentTime
	} catch (error) {
		console.error('Invalid token format', error)
		return false
	}
}

const TokenService = {
	setStorageToken,
	removeStorageToken,
	getStorageToken,
	verifyToken,
}

export default TokenService

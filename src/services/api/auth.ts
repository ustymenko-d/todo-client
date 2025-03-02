import Axios from '../Axios'
import { baseAuthDto, emailDto, passwordDto } from '@/dto/auth'

type Method = 'post' | 'get' | 'delete' | 'patch' | 'put'

const API_URL = '/auth'
const request = async (
	method: Method,
	endpoint: string,
	payload?: baseAuthDto | emailDto | passwordDto,
	param?: string
) => {
	try {
		const url = param
			? `${API_URL}/${endpoint}?${param}`
			: `${API_URL}/${endpoint}`
		const response = await Axios[method](url, payload)
		return response.data
	} catch (error) {
		console.error(`${endpoint} error:`, error)
		throw error
	}
}

const AuthService = {
	signup: (payload: baseAuthDto) => request('post', 'signup', payload),
	verifyEmail: (param: string) =>
		request('get', 'verification', undefined, param),
	login: (payload: baseAuthDto) => request('post', 'login', payload),
	logout: () => request('post', 'logout'),
	refreshToken: () => request('get', 'refresh'),
	deleteAccount: () => request('delete', 'delete'),
	forgotPassword: (payload: emailDto) =>
		request('post', 'forgot-password', payload),
	resetPassword: (payload: passwordDto, param: string) =>
		request('post', 'reset-password', payload, param),
}

export default AuthService

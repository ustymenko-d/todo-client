import apiRequestHandler from '@/utils/apiRequestHandler'
import { baseAuthDto, emailDto, passwordDto } from '@/dto/auth'

const API_URL = '/auth'

const AuthService = {
	signup: (payload: baseAuthDto) =>
		apiRequestHandler<baseAuthDto>(API_URL, 'post', 'signup', payload),
	verifyEmail: (param: string) =>
		apiRequestHandler<string>(API_URL, 'get', 'verification', undefined, param),
	login: (payload: baseAuthDto) =>
		apiRequestHandler<baseAuthDto>(API_URL, 'post', 'login', payload),
	logout: () => apiRequestHandler(API_URL, 'post', 'logout'),
	refreshToken: () => apiRequestHandler(API_URL, 'get', 'refresh'),
	deleteAccount: () => apiRequestHandler(API_URL, 'delete', 'delete'),
	forgotPassword: (payload: emailDto) =>
		apiRequestHandler<emailDto>(API_URL, 'post', 'forgot-password', payload),
	resetPassword: (payload: passwordDto, param: string) =>
		apiRequestHandler<passwordDto>(
			API_URL,
			'patch',
			'reset-password',
			payload,
			param
		),
}

export default AuthService

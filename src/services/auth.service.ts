import { baseAuthDto, emailDto, passwordDto } from '@/dto/auth'
import { IAuthResponse, IUserInfo } from '@/types/auth'
import { IResponseStatus } from '@/types/common'
import apiRequestHandler from '@/utils/apiRequestHandler'

const API_URL = '/auth'

const AuthService = {
	signup: (payload: baseAuthDto): Promise<IAuthResponse> =>
		apiRequestHandler<IAuthResponse, baseAuthDto>(
			`${API_URL}/signup`,
			'post',
			payload
		),

	verifyEmail: (param: string): Promise<IResponseStatus> =>
		apiRequestHandler<IResponseStatus, string>(
			`${API_URL}/email-verification`,
			'get',
			undefined,
			param
		),

	login: (payload: baseAuthDto): Promise<IAuthResponse> =>
		apiRequestHandler<IAuthResponse, baseAuthDto>(
			`${API_URL}/login`,
			'post',
			payload
		),

	getAccountInfo: (): Promise<IUserInfo> =>
		apiRequestHandler<IUserInfo>(`${API_URL}/account-info`, 'get'),

	logout: (): Promise<IResponseStatus> =>
		apiRequestHandler<IResponseStatus>(`${API_URL}/logout`, 'get'),

	refreshToken: (): Promise<IResponseStatus> =>
		apiRequestHandler<IResponseStatus>(
			`${API_URL}/tokens/refresh-tokens`,
			'get'
		),

	deleteAccount: (): Promise<IResponseStatus> =>
		apiRequestHandler<IResponseStatus>(`${API_URL}/delete-account`, 'delete'),

	forgotPassword: (payload: emailDto): Promise<IResponseStatus> =>
		apiRequestHandler<IResponseStatus, emailDto>(
			`${API_URL}/password/forgot-password`,
			'post',
			payload
		),

	resetPassword: (
		payload: passwordDto,
		param: string
	): Promise<IResponseStatus> =>
		apiRequestHandler<IResponseStatus, passwordDto>(
			`${API_URL}/password/reset-password`,
			'patch',
			payload,
			param
		),

	clearAuthCookies: (): Promise<IResponseStatus> =>
		apiRequestHandler<IResponseStatus>(`${API_URL}/cookies/clear-auth-cookies`, 'get'),
}

export default AuthService

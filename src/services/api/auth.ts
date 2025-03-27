import apiRequestHandler from '@/utils/apiRequestHandler'
import { baseAuthDto, emailDto, passwordDto } from '@/dto/auth'
import { IAuthResponse, IUserInfo } from '@/types/auth'
import { IResponseStatus } from '@/types/common'

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
			`${API_URL}/verification`,
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

	accountInfo: (): Promise<IUserInfo> =>
		apiRequestHandler<IUserInfo>(`${API_URL}/account-info`, 'get'),

	logout: (): Promise<IResponseStatus> =>
		apiRequestHandler<IResponseStatus>(`${API_URL}/logout`, 'post'),

	refreshToken: (): Promise<IResponseStatus> =>
		apiRequestHandler<IResponseStatus>(`${API_URL}/refresh`, 'get'),

	deleteAccount: (): Promise<IResponseStatus> =>
		apiRequestHandler<IResponseStatus>(`${API_URL}/delete`, 'delete'),

	forgotPassword: (payload: emailDto): Promise<IResponseStatus> =>
		apiRequestHandler<IResponseStatus, emailDto>(
			`${API_URL}/forgot-password`,
			'post',
			payload
		),

	resetPassword: (
		payload: passwordDto,
		param: string
	): Promise<IResponseStatus> =>
		apiRequestHandler<IResponseStatus, passwordDto>(
			`${API_URL}/reset-password`,
			'patch',
			payload,
			param
		),
}

export default AuthService

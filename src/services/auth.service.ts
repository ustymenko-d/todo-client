import { baseAuthDto, emailDto, passwordDto } from '@/dto/auth'
import { IAuthResponse, IUserInfo } from '@/types/auth'
import { IResponseStatus } from '@/types/common'
import apiRequestHandler from '@/utils/apiRequestHandler'
import { AxiosResponse } from 'axios'
import { ApiAxios } from './Axios'

const API_URL = '/auth'

const AuthService = {
	signup: (payload: baseAuthDto): Promise<AxiosResponse<IAuthResponse>> =>
		apiRequestHandler<IAuthResponse, baseAuthDto>(
			`${API_URL}/signup`,
			'post',
			payload
		),

	verifyEmail: (param: string): Promise<AxiosResponse<IResponseStatus>> =>
		apiRequestHandler<IResponseStatus, string>(
			`${API_URL}/email-verification`,
			'get',
			undefined,
			param
		),

	login: (payload: baseAuthDto): Promise<AxiosResponse<IAuthResponse>> =>
		ApiAxios.post(`${API_URL}/login`, payload),

	getAccountInfo: (): Promise<AxiosResponse<IUserInfo>> =>
		apiRequestHandler<IUserInfo>(`${API_URL}/account-info`, 'get'),

	logout: (): Promise<AxiosResponse<IResponseStatus>> =>
		apiRequestHandler<IResponseStatus>(`${API_URL}/logout`, 'get'),

	refreshToken: (): Promise<AxiosResponse<IResponseStatus>> =>
		ApiAxios.get(`${API_URL}/tokens/refresh-tokens`),

	deleteAccount: (): Promise<AxiosResponse<IResponseStatus>> =>
		apiRequestHandler<IResponseStatus>(`${API_URL}/delete-account`, 'delete'),

	forgotPassword: (
		payload: emailDto
	): Promise<AxiosResponse<IResponseStatus>> =>
		apiRequestHandler<IResponseStatus, emailDto>(
			`${API_URL}/password/forgot-password`,
			'post',
			payload
		),

	resetPassword: (
		payload: passwordDto,
		param: string
	): Promise<AxiosResponse<IResponseStatus>> =>
		apiRequestHandler<IResponseStatus, passwordDto>(
			`${API_URL}/password/reset-password`,
			'patch',
			payload,
			param
		),

	clearAuthCookies: (): Promise<AxiosResponse<IResponseStatus>> =>
		apiRequestHandler<IResponseStatus>(
			`${API_URL}/cookies/clear-auth-cookies`,
			'get'
		),
}

export default AuthService

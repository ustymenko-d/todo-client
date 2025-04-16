import { baseAuthDto, emailDto, passwordDto } from '@/dto/auth'
import { IAuthResponse, IUserInfo } from '@/types/auth'
import { IResponseStatus } from '@/types/common'
import { AxiosResponse } from 'axios'
import { ApiAxios } from './Axios'
import RequestHandler from '@/utils/RequestHandler'

const AUTH_API_URL = '/auth'

const AuthService = {
	signup: (payload: baseAuthDto): Promise<AxiosResponse<IAuthResponse>> =>
		RequestHandler.handleRequest(() =>
			ApiAxios.post(`${AUTH_API_URL}/signup`, payload)
		),

	verifyEmail: (
		verificationToken: string
	): Promise<AxiosResponse<IResponseStatus>> =>
		RequestHandler.handleRequest(() =>
			ApiAxios.get(
				`${AUTH_API_URL}/email-verification?verificationToken=${verificationToken}`
			)
		),

	login: (payload: baseAuthDto): Promise<AxiosResponse<IAuthResponse>> =>
		RequestHandler.handleRequest(() =>
			ApiAxios.post(`${AUTH_API_URL}/login`, payload)
		),

	getAccountInfo: (): Promise<AxiosResponse<IUserInfo>> =>
		RequestHandler.handleRequest(() =>
			ApiAxios.get(`${AUTH_API_URL}/account-info`)
		),

	logout: (): Promise<AxiosResponse<IResponseStatus>> =>
		RequestHandler.handleRequest(() => ApiAxios.get(`${AUTH_API_URL}/logout`)),

	refreshToken: (): Promise<AxiosResponse<IResponseStatus>> =>
		RequestHandler.handleRequest(() =>
			ApiAxios.get(`${AUTH_API_URL}/tokens/refresh-tokens`)
		),

	deleteAccount: (): Promise<AxiosResponse<IResponseStatus>> =>
		RequestHandler.handleRequest(() =>
			ApiAxios.delete(`${AUTH_API_URL}/delete-account`)
		),

	forgotPassword: (
		payload: emailDto
	): Promise<AxiosResponse<IResponseStatus>> =>
		RequestHandler.handleRequest(() =>
			ApiAxios.post(`${AUTH_API_URL}/password/forgot-password`, payload)
		),

	resetPassword: (
		payload: passwordDto,
		resetToken: string | null
	): Promise<AxiosResponse<IResponseStatus>> =>
		RequestHandler.handleRequest(() =>
			ApiAxios.patch(
				`${AUTH_API_URL}/password/reset-password?resetToken=${resetToken}`,
				payload
			)
		),

	clearAuthCookies: (): Promise<AxiosResponse<IResponseStatus>> =>
		RequestHandler.handleRequest(() =>
			ApiAxios.get(`${AUTH_API_URL}/cookies/clear-auth-cookies`)
		),
}

export default AuthService

import { handleApiRequest } from '@/api/requestHandler'
import {
	IAuthResponse,
	IUserInfo,
	TAuthPayload,
	TEmail,
	TPassword,
} from '@/types/auth'
import { IResponseStatus } from '@/types/common'

import { ApiAxios } from './Axios'

const AUTH_API_URL = '/auth'

const AuthAPI = {
	signup: (payload: TAuthPayload) =>
		handleApiRequest<IAuthResponse>(() =>
			ApiAxios.post(`${AUTH_API_URL}/signup`, payload)
		),

	verifyEmail: (verificationToken: string) =>
		handleApiRequest<IResponseStatus>(() =>
			ApiAxios.get(
				`${AUTH_API_URL}/email-verification?verificationToken=${verificationToken}`
			)
		),

	login: (payload: TAuthPayload) =>
		handleApiRequest<IAuthResponse>(() =>
			ApiAxios.post(`${AUTH_API_URL}/login`, payload)
		),

	getAccountInfo: () =>
		handleApiRequest<IUserInfo>(() =>
			ApiAxios.get(`${AUTH_API_URL}/account-info`)
		),

	logout: () =>
		handleApiRequest<IResponseStatus>(() =>
			ApiAxios.get(`${AUTH_API_URL}/logout`)
		),

	refreshToken: () =>
		handleApiRequest<IResponseStatus>(() =>
			ApiAxios.get(`${AUTH_API_URL}/tokens/refresh-tokens`)
		),

	deleteAccount: () =>
		handleApiRequest<IResponseStatus>(() =>
			ApiAxios.delete(`${AUTH_API_URL}/delete-account`)
		),

	forgotPassword: (payload: TEmail) =>
		handleApiRequest<IResponseStatus>(() =>
			ApiAxios.post(`${AUTH_API_URL}/password/forgot-password`, payload)
		),

	resetPassword: (payload: TPassword, resetToken: string | null) =>
		handleApiRequest<IResponseStatus>(() =>
			ApiAxios.patch(
				`${AUTH_API_URL}/password/reset-password?resetToken=${resetToken}`,
				payload
			)
		),

	clearAuthCookies: () =>
		handleApiRequest<IResponseStatus>(() =>
			ApiAxios.get(`${AUTH_API_URL}/cookies/clear-auth-cookies`)
		),
}

export default AuthAPI

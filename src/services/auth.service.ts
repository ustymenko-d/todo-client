import { ApiAxios } from './Axios'
import { handleApiRequest } from '@/utils/requestHandler'
import {
	IAuthResponse,
	IUserInfo,
	TAuthPayload,
	TEmail,
	TPassword,
} from '@/types/auth'
import { IResponseStatus } from '@/types/common'

const AUTH_API_URL = '/auth'

const AuthService = {
	signup: (payload: TAuthPayload) =>
		handleApiRequest(() =>
			ApiAxios.post<IAuthResponse>(`${AUTH_API_URL}/signup`, payload)
		),

	verifyEmail: (verificationToken: string) =>
		handleApiRequest(() =>
			ApiAxios.get<IResponseStatus>(
				`${AUTH_API_URL}/email-verification?verificationToken=${verificationToken}`
			)
		),

	login: (payload: TAuthPayload) =>
		handleApiRequest(() =>
			ApiAxios.post<IAuthResponse>(`${AUTH_API_URL}/login`, payload)
		),

	getAccountInfo: () =>
		handleApiRequest(() =>
			ApiAxios.get<IUserInfo>(`${AUTH_API_URL}/account-info`)
		),

	logout: () =>
		handleApiRequest(() =>
			ApiAxios.get<IResponseStatus>(`${AUTH_API_URL}/logout`)
		),

	refreshToken: () =>
		handleApiRequest(() =>
			ApiAxios.get<IResponseStatus>(`${AUTH_API_URL}/tokens/refresh-tokens`)
		),

	deleteAccount: () =>
		handleApiRequest(() =>
			ApiAxios.delete<IResponseStatus>(`${AUTH_API_URL}/delete-account`)
		),

	forgotPassword: (payload: TEmail) =>
		handleApiRequest(() =>
			ApiAxios.post<IResponseStatus>(
				`${AUTH_API_URL}/password/forgot-password`,
				payload
			)
		),

	resetPassword: (payload: TPassword, resetToken: string | null) =>
		handleApiRequest(() =>
			ApiAxios.patch<IResponseStatus>(
				`${AUTH_API_URL}/password/reset-password?resetToken=${resetToken}`,
				payload
			)
		),

	clearAuthCookies: () =>
		handleApiRequest(() =>
			ApiAxios.get<IResponseStatus>(
				`${AUTH_API_URL}/cookies/clear-auth-cookies`
			)
		),
}

export default AuthService

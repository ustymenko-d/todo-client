import { IResponseStatus } from './common'

export type AuthFormType = 'login' | 'signup' | 'forgotPassword'

interface IUserInfo {
	id: string
	email: string
	username: string
	createdAt: Date
	isVerified: boolean
}

export interface IAuthResponse extends IResponseStatus {
	userInfo: IUserInfo
}

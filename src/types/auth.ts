import { z } from 'zod'
import AuthValidation from '@/schemas/authForm.schema'
import { IResponseStatus } from './common'
import { IFolder } from './folders'

export type TAuthFormType = 'login' | 'signup' | 'forgotPassword'
export type TEmail = z.infer<typeof AuthValidation.email>
export type TPassword = z.infer<typeof AuthValidation.password>
export type TAuthPayload = z.infer<typeof AuthValidation.login>

export interface IUserInfo {
	id: string
	email: string
	username: string
	createdAt: Date
	isVerified: boolean
	folders?: IFolder[]
}

export interface IAuthResponse extends IResponseStatus {
	userInfo: IUserInfo
}

import { z, ZodSchema } from 'zod'

import AuthValidation from '@/schemas/authForm.schema'

import { IResponseStatus } from './common'

export type TAuthForm = 'signin' | 'signup' | 'forgotPassword'
export type TEmail = z.infer<typeof AuthValidation.email>
export type TPassword = z.infer<typeof AuthValidation.password>
export type TAuthPayload = z.infer<typeof AuthValidation.login>

export interface IUserInfo {
	id: string
	email: string
	username: string
	createdAt: Date
	isVerified: boolean
}

export interface IAuthResponse extends IResponseStatus {
	userInfo: IUserInfo
}

type Fields = 'email' | 'password' | 'confirmPassword' | 'rememberMe'

export interface IFormConfig {
	fields: Fields[]
	buttonText: string
	validationSchema: ZodSchema
	defaultValues: {
		email: string
		password?: string
		confirmPassword?: string
		rememberMe?: boolean
	}
}

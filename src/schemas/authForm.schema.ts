import { z } from 'zod'

const passwordBase = z
	.string()
	.min(8, { message: 'The password must be at least 8 characters long.' })
	.max(64, { message: 'The password must not exceed 64 characters.' })
	.regex(/^[^\u0400-\u04FF]*$/, {
		message: 'The password must not contain Cyrillic characters.',
	})
	.regex(/(?=.*[A-Z])/, {
		message: 'The password must contain at least one capital letter.',
	})
	.regex(/(?=.*[a-z])/, {
		message: 'The password must contain at least one lowercase letter.',
	})
	.regex(/(?=.*\d)/, {
		message: 'The password must contain at least one digit.',
	})
	.regex(/^[^\s]*$/, {
		message: 'The password must not contain spaces.',
	})

const password = z.object({
	password: passwordBase,
})

const emailBase = z.string().email({ message: 'Invalid email address.' })

const email = z.object({
	email: emailBase,
})

const login = z.object({
	email: emailBase,
	password: passwordBase,
	rememberMe: z.boolean(),
})

const signup = z
	.object({
		email: emailBase,
		password: passwordBase,
		confirmPassword: passwordBase,
		rememberMe: z.boolean(),
	})
	.refine(({ password, confirmPassword }) => password === confirmPassword, {
		message: 'Passwords do not match.',
		path: ['confirmPassword'],
	})

const resetPassword = z
	.object({
		password: passwordBase,
		confirmPassword: passwordBase,
	})
	.refine(({ password, confirmPassword }) => password === confirmPassword, {
		message: 'Passwords do not match.',
		path: ['confirmPassword'],
	})

const AuthValidation = {
	email,
	password,
	login,
	signup,
	resetPassword,
}

export default AuthValidation

import { z } from 'zod'

const passwordBaseSchema = z
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

const emailBaseSchema = z.string().email({ message: 'Invalid email address.' })

const emailSchema = z.object({
	email: emailBaseSchema,
})

const loginSchema = z.object({
	email: emailBaseSchema,
	password: passwordBaseSchema,
})

const signupSchema = z
	.object({
		email: emailBaseSchema,
		password: passwordBaseSchema,
		confirmPassword: passwordBaseSchema,
	})
	.refine(({ password, confirmPassword }) => password === confirmPassword, {
		message: 'Passwords do not match.',
		path: ['confirmPassword'],
	})

const resetPasswordSchema = z
	.object({
		password: passwordBaseSchema,
		confirmPassword: passwordBaseSchema,
	})
	.refine(({ password, confirmPassword }) => password === confirmPassword, {
		message: 'Passwords do not match.',
		path: ['confirmPassword'],
	})

const authValidation = {
	emailSchema,
	loginSchema,
	signupSchema,
	resetPasswordSchema,
}

export default authValidation

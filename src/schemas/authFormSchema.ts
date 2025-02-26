import { z } from 'zod'

export const passwordSchema = z
	.string()
	.min(8, { message: 'The password must be at least 8 characters long.' })
	.max(64, { message: 'The password must not exceed 64 characters.' })
	.regex(/(?=.*[A-Z])/, {
		message: 'The password must contain at least one capital letter.',
	})
	.regex(/(?=.*[a-z])/, {
		message: 'The password must contain at least one lowercase letter.',
	})
	.regex(/(?=.*\d)/, {
		message: 'The password must contain at least one digit.',
	})

export const emailSchema = z
	.string()
	.email({ message: 'Invalid email address.' })

export const passwordBaseSchema = z.object({
	password: passwordSchema,
})

export const emailBaseSchema = z.object({
	email: emailSchema,
})

export const authFormSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
})

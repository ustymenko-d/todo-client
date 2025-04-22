import { z } from 'zod'
import AuthValidation from '@/schemas/authForm.schema'

export type emailDto = z.infer<typeof AuthValidation.emailSchema>
export type passwordDto = z.infer<typeof AuthValidation.passwordSchema>
export type baseAuthDto = z.infer<typeof AuthValidation.loginSchema>

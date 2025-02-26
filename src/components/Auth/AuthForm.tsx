import { useEffect, useMemo } from 'react'
import { appStore, AuthFormType } from '@/store/store'
import { useForm } from 'react-hook-form'
import { z, ZodSchema } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import authValidation from '@/schemas/authFormSchema'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import RememberMeCheckbox from '@/components/ui/RememberMeCheckbox'
import AuthFormSuggestion from './AuthFormSuggestion'
import AuthFormInput from './AuthFormInput'

export type BaseFieldType = 'email' | 'password' | 'confirmPassword'
type FieldType = BaseFieldType | 'rememberMe'

interface IDefaultSchemaValues {
	email?: string
	password?: string
	confirmPassword?: string
}

interface IFormConfig {
	fields: FieldType[]
	buttonText: string
	validationSchema: ZodSchema
	defaultValues: IDefaultSchemaValues
}

const formConfig: Record<AuthFormType, IFormConfig> = {
	login: {
		fields: ['email', 'password', 'rememberMe'],
		buttonText: 'Log in',
		validationSchema: authValidation.loginSchema,
		defaultValues: {
			email: '',
			password: '',
		},
	},
	signup: {
		fields: ['email', 'password', 'confirmPassword'],
		buttonText: 'Sign up',
		validationSchema: authValidation.signupSchema,
		defaultValues: {
			email: '',
			password: '',
			confirmPassword: '',
		},
	},
	forgotPassword: {
		fields: ['email'],
		buttonText: 'Send password reset email',
		validationSchema: authValidation.emailSchema,
		defaultValues: {
			email: '',
		},
	},
	resetPassword: {
		fields: ['password', 'confirmPassword'],
		buttonText: 'Confirm',
		validationSchema: authValidation.resetPasswordSchema,
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	},
} as const

const AuthForm = () => {
	const authFormType = appStore((state) => state.authFormType)

	const { fields, buttonText, validationSchema, defaultValues } = useMemo(
		() => formConfig[authFormType],
		[authFormType]
	)

	const authForm = useForm<z.infer<typeof validationSchema>>({
		resolver: zodResolver(validationSchema),
		defaultValues,
	})

	const onSubmit = (values: z.infer<typeof validationSchema>) => {
		console.log(values)
	}

	useEffect(() => {
		authForm.reset(defaultValues)
	}, [authForm, authFormType, defaultValues])

	return (
		<Form {...authForm}>
			<form onSubmit={authForm.handleSubmit(onSubmit)}>
				<div className='flex flex-col gap-6'>
					{fields.includes('email') && (
						<AuthFormInput
							name='email'
							label='Email'
							control={authForm.control}
						/>
					)}
					{fields.includes('password') && (
						<AuthFormInput
							name='password'
							label='Password'
							control={authForm.control}
						/>
					)}
					{fields.includes('confirmPassword') && (
						<AuthFormInput
							name='confirmPassword'
							label='Confirm Password'
							control={authForm.control}
						/>
					)}
					{fields.includes('rememberMe') && <RememberMeCheckbox />}

					<Button
						type='submit'
						className='w-full'>
						{buttonText}
					</Button>
				</div>
				{authFormType !== 'resetPassword' && <AuthFormSuggestion />}
			</form>
		</Form>
	)
}

export default AuthForm

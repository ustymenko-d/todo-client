import { useCallback, useEffect, useMemo, useState } from 'react'
import { appStore, AuthFormType } from '@/store/store'
import { useForm } from 'react-hook-form'
import { z, ZodSchema } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import AuthValidation from '@/schemas/authFormSchema'
import { Form } from '@/components/ui/form'
import RememberMeCheckbox from '@/components/ui/RememberMeCheckbox'
import AuthFormSuggestion from './AuthFormSuggestion'
import AuthFormInput from './AuthFormInput'
import AuthService from '@/services/api/auth'
import { useRouter } from 'next/navigation'
import { baseAuthDto, emailDto } from '@/dto/auth'
import { toast } from 'sonner'
import LoadingButton from '../ui/LoadingButton'

export type BaseFieldType = 'email' | 'password' | 'confirmPassword'
type FieldType = BaseFieldType | 'rememberMe'

interface IDefaultSchemaValues {
	email?: string
	password?: string
	confirmPassword?: string
	rememberMe?: boolean
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
		validationSchema: AuthValidation.loginSchema,
		defaultValues: {
			email: '',
			password: '',
			rememberMe: false,
		},
	},
	signup: {
		fields: ['email', 'password', 'confirmPassword', 'rememberMe'],
		buttonText: 'Sign up',
		validationSchema: AuthValidation.signupSchema,
		defaultValues: {
			email: '',
			password: '',
			confirmPassword: '',
			rememberMe: false,
		},
	},
	forgotPassword: {
		fields: ['email'],
		buttonText: 'Send password reset email',
		validationSchema: AuthValidation.emailSchema,
		defaultValues: {
			email: '',
		},
	},
}

const AuthForm = () => {
	const router = useRouter()
	const authFormType = appStore((state) => state.authFormType)
	const setIsAuthorized = appStore((state) => state.setIsAuthorized)
	const [loading, setLoading] = useState(false)

	const { fields, buttonText, validationSchema, defaultValues } = useMemo(
		() => formConfig[authFormType],
		[authFormType]
	)

	const authForm = useForm<z.infer<typeof validationSchema>>({
		resolver: zodResolver(validationSchema),
		defaultValues,
	})

	const handleAuthAction = useCallback(
		async (payload: baseAuthDto | emailDto) => {
			setLoading(true)
			try {
				let response
				switch (authFormType) {
					case 'signup':
						response = await AuthService.signup(payload as baseAuthDto)
						break
					case 'login':
						response = await AuthService.login(payload as baseAuthDto)
						break
					case 'forgotPassword':
						response = await AuthService.forgotPassword(payload as emailDto)
						break
					default:
						return
				}

				const { success, error, message } = response

				if (error) {
					toast.error(message)
				} else {
					if (success) {
						if (authFormType !== 'forgotPassword') {
							setIsAuthorized(true)
							router.replace('/dashboard')
						} else {
							authForm.reset(defaultValues)
						}
						if (message) toast.success(message)
					}
				}
			} catch (error) {
				toast.error('Something went wrong!')
				console.error(`${authFormType} error:`, error)
			} finally {
				setLoading(false)
			}
		},
		[authForm, authFormType, defaultValues, router, setIsAuthorized]
	)

	const onSubmit = (values: z.infer<typeof validationSchema>) => {
		const payload: baseAuthDto | emailDto =
			authFormType === 'forgotPassword'
				? { email: values.email }
				: {
						email: values.email,
						password: values.password || '',
						rememberMe: values.rememberMe,
				  }
		handleAuthAction(payload)
	}

	useEffect(() => {
		authForm.reset(defaultValues)
	}, [authForm, authFormType, defaultValues])

	return (
		<Form {...authForm}>
			<form onSubmit={authForm.handleSubmit(onSubmit)}>
				<div className='flex flex-col gap-6'>
					{fields.map((field) =>
						field === 'rememberMe' ? (
							<RememberMeCheckbox
								key={field}
								control={authForm.control}
							/>
						) : (
							<AuthFormInput
								key={field}
								name={field}
								label={field}
								control={authForm.control}
							/>
						)
					)}

					<LoadingButton
						loading={loading}
						type='submit'>
						<span>{buttonText}</span>
					</LoadingButton>
				</div>
				<AuthFormSuggestion />
			</form>
		</Form>
	)
}

export default AuthForm

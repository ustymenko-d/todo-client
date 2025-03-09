import { useCallback, useEffect, useMemo, useState } from 'react'
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
import AuthService from '@/services/api/auth'
import TokenService from '@/utils/token'
import { useRouter } from 'next/navigation'
import { baseAuthDto, emailDto } from '@/dto/auth'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

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
}

const AuthForm = () => {
	const router = useRouter()
	const authFormType = appStore((state) => state.authFormType)
	const isRememberUser = appStore((state) => state.isRememberUser)
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

				const { accessToken, error, message } = response

				if (error) {
					toast.error(message)
				} else {
					if (message) toast.success(message)

					if (accessToken) {
						TokenService.setStorageToken(accessToken, isRememberUser)
						router.replace('/dashboard')
					}
				}
			} catch (error) {
				toast.error('Something went wrong!')
				console.error(`${authFormType} error:`, error)
			} finally {
				setLoading(false)
			}
		},
		[authFormType, isRememberUser, router]
	)

	const onSubmit = (values: z.infer<typeof validationSchema>) => {
		const payload: baseAuthDto | emailDto =
			authFormType === 'forgotPassword'
				? { email: values.email }
				: { email: values.email, password: values.password || '' }
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
							<RememberMeCheckbox key={field} />
						) : (
							<AuthFormInput
								key={field}
								name={field}
								label={field}
								control={authForm.control}
							/>
						)
					)}

					<Button
						disabled={loading}
						type='submit'
						className='w-full'>
						{loading ? (
							<>
								<Loader2 className='animate-spin' />
								<span>Please wait</span>
							</>
						) : (
							buttonText
						)}
					</Button>
				</div>
				<AuthFormSuggestion />
			</form>
		</Form>
	)
}

export default AuthForm

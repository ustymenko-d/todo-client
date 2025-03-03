import { useEffect, useMemo, useState } from 'react'
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
} as const

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

	const handleSignup = async (payload: baseAuthDto) => {
		setLoading(true)
		try {
			const response = await AuthService.signup(payload)

			if (response.accessToken) {
				TokenService.setStorageToken(response.accessToken, isRememberUser)
				toast.success('Your account has been successfully created!')
				router.replace('/dashboard')
			}
			
			if (response.error) {
				toast.error(response.message)
			}
		} catch (error) {
			toast.error('Something went wrong!')
			console.error('Sign up error:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleLogin = async (payload: baseAuthDto) => {
		setLoading(true)
		try {
			const response = await AuthService.login(payload)

			if (response.accessToken) {
				TokenService.setStorageToken(response.accessToken, isRememberUser)
				router.replace('/dashboard')
			}
		} catch (error) {
			toast.error('Something went wrong!')
			console.error('Log in error:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleForgotPassword = async (payload: emailDto) => {
		setLoading(true)
		try {
			const response = await AuthService.forgotPassword(payload)

			if (response.message) {
				toast.success(response.message)
			}
		} catch (error) {
			toast.error('Something went wrong!')
			console.error('Log in error:', error)
		} finally {
			setLoading(false)
		}
	}

	const onSubmit = async (values: z.infer<typeof validationSchema>) => {
		const payload: baseAuthDto | emailDto =
			authFormType === 'forgotPassword'
				? { email: values.email }
				: { email: values.email, password: values.password || '' }

		switch (authFormType) {
			case 'signup':
				handleSignup(payload as baseAuthDto)
				break
			case 'login':
				handleLogin(payload as baseAuthDto)
				break
			case 'forgotPassword':
				handleForgotPassword(payload as emailDto)
				break

			default:
				break
		}
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

import { useCallback, useEffect, useMemo, useState } from 'react'
import useAppStore from '@/store/store'
import { useForm } from 'react-hook-form'
import { z, ZodSchema } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import AuthValidation from '@/schemas/authForm.schema'
import { Form } from '@/components/ui/form'
import AuthFormSuggestion from './AuthFormSuggestion'
import AuthFormInput from './AuthFormInput'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import LoadingButton from '@/components/ui/LoadingButton'
import { TAuthFormType, TAuthPayload, TEmail } from '@/types/auth'
import AuthService from '@/services/auth.service'
import RememberMe from '@/components/ui/RememberMe'
import { AxiosError } from 'axios'

export type TBaseFields = 'email' | 'password' | 'confirmPassword'
type TFields = TBaseFields | 'rememberMe'

interface IFormConfig {
	fields: TFields[]
	buttonText: string
	validationSchema: ZodSchema
	defaultValues: {
		email: string
		password?: string
		confirmPassword?: string
		rememberMe?: boolean
	}
}

const formConfig: Record<TAuthFormType, IFormConfig> = {
	login: {
		fields: ['email', 'password', 'rememberMe'],
		buttonText: 'Log in',
		validationSchema: AuthValidation.login,
		defaultValues: {
			email: '',
			password: '',
			rememberMe: false,
		},
	},
	signup: {
		fields: ['email', 'password', 'confirmPassword', 'rememberMe'],
		buttonText: 'Sign up',
		validationSchema: AuthValidation.signup,
		defaultValues: {
			email: '',
			password: '',
			confirmPassword: '',
			rememberMe: false,
		},
	},
	forgotPassword: {
		fields: ['email'],
		buttonText: 'Send reset password email',
		validationSchema: AuthValidation.email,
		defaultValues: {
			email: '',
		},
	},
}

const AuthForm = () => {
	const router = useRouter()
	const authFormType = useAppStore((state) => state.authFormType)
	const isAuthorized = useAppStore((state) => state.isAuthorized)
	const setIsAuthorized = useAppStore((state) => state.setIsAuthorized)
	const setAccountInfo = useAppStore((state) => state.setAccountInfo)
	const [loading, setLoading] = useState(false)

	const { fields, buttonText, validationSchema, defaultValues } = useMemo(
		() => formConfig[authFormType],
		[authFormType]
	)

	const authForm = useForm<z.infer<typeof validationSchema>>({
		resolver: zodResolver(validationSchema),
		defaultValues,
	})

	const handleForgotPassword = useCallback(
		async (payload: TEmail) => {
			const { data } = await AuthService.forgotPassword(payload)
			if (data.success) {
				toast.success(data.message)
				authForm.reset(defaultValues)
			} else {
				toast.error(data.message)
			}
		},
		[authForm, defaultValues]
	)

	const handleAuth = useCallback(
		async (payload: TAuthPayload) => {
			const { data } =
				authFormType === 'signup'
					? await AuthService.signup(payload as TAuthPayload)
					: await AuthService.login(payload as TAuthPayload)
			const { success, message, userInfo } = data

			if (!success) {
				toast.error(message)
				return
			}

			authForm.reset(defaultValues)
			toast.success(message)
			setIsAuthorized(true)
			setAccountInfo(userInfo)
			router.push('/dashboard')
		},
		[
			authFormType,
			authForm,
			defaultValues,
			router,
			setAccountInfo,
			setIsAuthorized,
		]
	)

	const onSubmit = useCallback(
		async (values: z.infer<typeof validationSchema>): Promise<void> => {
			try {
				setLoading(true)

				if (authFormType === 'forgotPassword') {
					await handleForgotPassword({ email: values.email })
				} else {
					await handleAuth({
						email: values.email,
						password: values.password,
						rememberMe: values.rememberMe,
					})
				}
			} catch (error) {
				const axiosError = error as AxiosError
				const message =
					(axiosError.response?.data as { message?: string })?.message ||
					axiosError.response?.data ||
					'Something went wrong'
				toast.error(
					typeof message === 'string' ? message : JSON.stringify(message)
				)
				console.error(`${authFormType} error:`, error)
			} finally {
				setLoading(false)
			}
		},
		[authFormType, handleAuth, handleForgotPassword]
	)

	useEffect(() => {
		authForm.reset(defaultValues)
	}, [authForm, authFormType, defaultValues])

	return (
		<Form {...authForm}>
			<form onSubmit={authForm.handleSubmit(onSubmit)}>
				<div className='flex flex-col gap-6'>
					{fields.map((field) =>
						field === 'rememberMe' ? (
							<RememberMe
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
						type='submit'
						loading={loading}
						disabled={isAuthorized}>
						{buttonText}
					</LoadingButton>
				</div>
				<AuthFormSuggestion />
			</form>
		</Form>
	)
}

export default AuthForm

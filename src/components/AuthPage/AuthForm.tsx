import { useEffect, useState } from 'react'
import useAppStore from '@/store/store'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import AuthFormSuggestion from './components/AuthFormSuggestion'
import AuthFormInput from './components/AuthFormInput'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import LoadingButton from '@/components/ui/LoadingButton'
import { TAuthPayload, TEmail } from '@/types/auth'
import AuthService from '@/services/auth.service'
import RememberMe from '@/components/ui/RememberMe'
import { AxiosError } from 'axios'
import { formConfig } from '@/const'

const AuthForm = () => {
	const router = useRouter()

	const authFormType = useAppStore((state) => state.authFormType)
	const accountInfo = useAppStore((state) => state.accountInfo)
	const setAccountInfo = useAppStore((state) => state.setAccountInfo)
	const setAuthHydrated = useAppStore((state) => state.setAuthHydrated)

	const [loading, setLoading] = useState(false)

	const { fields, buttonText, validationSchema, defaultValues } =
		formConfig[authFormType]

	const authForm = useForm<z.infer<typeof validationSchema>>({
		resolver: zodResolver(validationSchema),
		defaultValues,
	})

	const handleForgotPassword = async (payload: TEmail) => {
		const { data } = await AuthService.forgotPassword(payload)
		const { success, message } = data

		if (!success) {
			toast.error(message)
			return
		}

		toast.success(message)
		authForm.reset(defaultValues)
	}

	const handleAuth = async (payload: TAuthPayload) => {
		const { data } =
			authFormType === 'signup'
				? await AuthService.signup(payload)
				: await AuthService.login(payload)

		const { success, message, userInfo } = data

		if (!success) {
			toast.error(message)
			return
		}

		authForm.reset(defaultValues)
		toast.success(message)
		setAccountInfo(userInfo)
		setAuthHydrated(true)
		router.push('/home')
	}

	const onSubmit = async (
		values: z.infer<typeof validationSchema>
	): Promise<void> => {
		try {
			setLoading(true)

			if (authFormType === 'forgotPassword') {
				await handleForgotPassword({ email: values.email })
			} else {
				const { email, password, rememberMe } = values as TAuthPayload
				await handleAuth({
					email,
					password,
					rememberMe,
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
						disabled={!!accountInfo}>
						{buttonText}
					</LoadingButton>
				</div>
				<AuthFormSuggestion />
			</form>
		</Form>
	)
}

export default AuthForm

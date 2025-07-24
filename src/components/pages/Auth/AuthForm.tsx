import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import AuthAPI from '@/api/auth.api'
import RememberMe from '@/components/pages/Auth/components/RememberMe'
import { queryClient } from '@/components/providers/Query.provider'
import { Form } from '@/components/ui/form'
import LoadingButton from '@/components/ui/LoadingButton'
import { formConfig } from '@/const'
import { useWithRecaptcha } from '@/hooks/useWithRecaptcha'
import useAppStore from '@/store/store'
import { TAuthPayload, TEmail } from '@/types/auth'
import { TResponseState } from '@/types/common'

import AuthFormInput from './components/AuthFormInput'
import AuthFormSuggestion from './components/AuthFormSuggestion'

const AuthForm = () => {
	const router = useRouter()
	const { withRecaptcha } = useWithRecaptcha()

	const authFormType = useAppStore(s => s.authFormType)
	const setIsAuthorized = useAppStore(s => s.setIsAuthorized)

	const [loading, setLoading] = useState<TResponseState>('default')

	const { fields, buttonText, validationSchema, defaultValues } = formConfig[authFormType]

	const authForm = useForm<z.infer<typeof validationSchema>>({
		resolver: zodResolver(validationSchema),
		defaultValues,
	})

	const handleForgotPassword = async (payload: TEmail) => {
		const { success, message } = await AuthAPI.forgotPassword(await withRecaptcha<TEmail>(payload))

		if (!success) throw new Error(message || 'Forgot Password error')

		setLoading('success')
		toast.success(message)
		authForm.reset(defaultValues)

		setTimeout(() => {
			setLoading('default')
		}, 3000)
	}

	const handleAuth = async (payload: TAuthPayload) => {
		const { success, message, userInfo } =
			authFormType === 'signup' ? await AuthAPI.signup(payload) : await AuthAPI.login(payload)

		if (!success) throw new Error(message || 'Auth error')

		setLoading('success')
		authForm.reset(defaultValues)
		toast.success(message)
		setIsAuthorized(true)
		queryClient.setQueryData(['account info'], userInfo)
		router.push('/home')
	}

	const onSubmit = async (values: z.infer<typeof validationSchema>) => {
		try {
			setLoading('pending')

			if (authFormType === 'forgotPassword') {
				await handleForgotPassword({ email: values.email })
			} else {
				const { email, password, rememberMe } = values

				await handleAuth(
					await withRecaptcha<TAuthPayload>({
						email,
						password,
						rememberMe,
					})
				)
			}
		} catch (error) {
			setLoading('error')
			console.error(`${authFormType} error:`, error)
		}
	}

	useEffect(() => {
		authForm.reset(defaultValues)
		setLoading('default')
	}, [authForm, authFormType, defaultValues])

	return (
		<Form {...authForm}>
			<form onSubmit={authForm.handleSubmit(onSubmit)}>
				<div className='flex flex-col gap-6'>
					{fields.map(field =>
						field === 'rememberMe' ? (
							<RememberMe
								key={field}
								control={authForm.control}
							/>
						) : (
							<AuthFormInput
								key={field}
								name={field}
								control={authForm.control}
							/>
						)
					)}

					<LoadingButton
						type='submit'
						loading={loading === 'pending'}
						disabled={loading === 'success'}>
						{buttonText}
					</LoadingButton>
				</div>
				<AuthFormSuggestion />
			</form>
		</Form>
	)
}

export default AuthForm

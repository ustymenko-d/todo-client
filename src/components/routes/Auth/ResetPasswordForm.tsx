'use client'

import AuthValidation from '@/schemas/authFormSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useCallback, useState } from 'react'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../../ui/form'
import PasswordInput from '../../ui/PasswordInput'
import AuthService from '@/services/api/auth'
import { passwordDto } from '@/dto/auth'
import { toast } from 'sonner'
import LoadingButton from '@/components/ui/LoadingButton'

const formConfig = {
	validationSchema: AuthValidation.resetPasswordSchema,
	defaultValues: {
		password: '',
		confirmPassword: '',
	},
}

type ResponseStatus = 'pending' | 'success' | 'error'

const ResetPasswordForm = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [loading, setLoading] = useState(false)
	const [status, setStatus] = useState<ResponseStatus>('pending')
	const { validationSchema, defaultValues } = formConfig

	const resetPasswordForm = useForm<z.infer<typeof validationSchema>>({
		resolver: zodResolver(validationSchema),
		defaultValues,
	})

	const handleResetPassword = useCallback(
		async (payload: passwordDto) => {
			setLoading(true)
			try {
				const param = 'resetToken=' + searchParams.get('resetToken')
				const { success, message } = await AuthService.resetPassword(
					payload,
					param
				)

				setStatus(success ? 'success' : 'error')

				if (!success) {
					if (message) {
						toast.error(message)
						throw new Error(message)
					}
					throw new Error()
				}

				toast.success('Your password has been changed successfully!', {
					description:
						'You will be automatically redirected to the main page in 3 seconds.',
				})

				setTimeout(() => {
					router.replace('/')
				}, 3000)
			} catch (error) {
				toast.error('Something went wrong!')
				console.error('Change password error:', error)
			} finally {
				setLoading(false)
			}
		},
		[router, searchParams]
	)

	const onSubmit = useCallback(
		async (values: z.infer<typeof validationSchema>) => {
			handleResetPassword({ password: values.password })
		},
		[handleResetPassword]
	)

	return (
		<Form {...resetPasswordForm}>
			<form onSubmit={resetPasswordForm.handleSubmit(onSubmit)}>
				<div className='flex flex-col gap-6'>
					{(['password', 'confirmPassword'] as const).map((element) => (
						<FormField
							key={`${element}-field`}
							control={resetPasswordForm.control}
							name={element}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<PasswordInput
											{...field}
											labelNode={
												<FormLabel>
													{element === 'password'
														? 'Password'
														: 'Confirm Password'}
												</FormLabel>
											}
											value={field.value || ''}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					))}

					<LoadingButton
						type='submit'
						className='w-full'
						loading={loading}
						disabled={status === 'success'}>
						Confirm
					</LoadingButton>
				</div>
			</form>
		</Form>
	)
}

export default ResetPasswordForm

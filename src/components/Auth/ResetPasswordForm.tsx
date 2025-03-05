'use client'

import authValidation from '@/schemas/authFormSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form'
import PasswordInput from '../ui/PasswordInput'
import AuthService from '@/services/api/auth'
import { passwordDto } from '@/dto/auth'
import { toast } from 'sonner'

const formConfig = {
	validationSchema: authValidation.resetPasswordSchema,
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
				const resetPasswordParam =
					'resetToken=' + searchParams.get('resetToken')
				const response = await AuthService.resetPassword(
					payload,
					resetPasswordParam
				)

				if (response.error) {
					setStatus('error')
					toast.error(response.message)
					throw new Error(response.message)
				}

				setStatus(response.success ? 'success' : 'error')
				toast.success('Your password has been changed successfully!', {
					description:
						'You will be automatically redirected to the main page in 3 seconds.',
				})

				setTimeout(() => {
					router.replace('/')
				}, 3000)
			} catch (error) {
				setStatus('error')
				toast.error('Something went wrong!')
				console.error('Log in error:', error)
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
		<>
			<Form {...resetPasswordForm}>
				<form onSubmit={resetPasswordForm.handleSubmit(onSubmit)}>
					<div className='flex flex-col gap-6'>
						<FormField
							control={resetPasswordForm.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<PasswordInput
											{...field}
											labelNode={<FormLabel>Password</FormLabel>}
											value={field.value || ''}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={resetPasswordForm.control}
							name='confirmPassword'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<PasswordInput
											{...field}
											labelNode={<FormLabel>Confirm Password</FormLabel>}
											value={field.value || ''}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							disabled={loading || status === 'success'}
							type='submit'
							className='w-full'>
							{loading ? (
								<>
									<Loader2 className='animate-spin' />
									<span>Please wait</span>
								</>
							) : (
								'Confirm'
							)}
						</Button>
					</div>
				</form>
			</Form>
		</>
	)
}

export default ResetPasswordForm

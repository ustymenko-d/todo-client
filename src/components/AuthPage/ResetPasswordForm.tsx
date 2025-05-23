'use client'

import AuthValidation from '@/schemas/authForm.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState } from 'react'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import PasswordInput from '@/components/AuthPage/components/PasswordInput'
import { toast } from 'sonner'
import LoadingButton from '@/components/ui/LoadingButton'
import AuthService from '@/services/auth.service'
import { TResponseState } from '@/types/common'
import { TPassword } from '@/types/auth'

const formConfig = {
	validationSchema: AuthValidation.resetPassword,
	defaultValues: {
		password: '',
		confirmPassword: '',
	},
}

const ResetPasswordForm = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [status, setStatus] = useState<TResponseState>('default')
	const { validationSchema, defaultValues } = formConfig

	const resetPasswordForm = useForm<z.infer<typeof validationSchema>>({
		resolver: zodResolver(validationSchema),
		defaultValues,
	})

	const handleResetPassword = async (
		values: z.infer<typeof validationSchema>
	) => {
		try {
			setStatus('pending')
			const payload: TPassword = { password: values.password }
			const resetToken = searchParams.get('resetToken')
			const { data } = await AuthService.resetPassword(payload, resetToken)
			const { success, message } = data

			if (!success) {
				setStatus('error')
				if (message) toast.error(message)
				throw new Error(message || 'Reset failed')
			}

			setStatus('success')
			toast.success('Your password has been changed successfully!', {
				description:
					'You will be automatically redirected to the main page in 3 seconds.',
			})
			resetPasswordForm.reset(defaultValues)
			setTimeout(() => {
				router.push('/')
			}, 3000)
		} catch (error) {
			setStatus('error')
			toast.error('Something went wrong!')
			console.error('Change password error:', error)
		}
	}

	return (
		<Form {...resetPasswordForm}>
			<form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)}>
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
						loading={status === 'pending'}
						disabled={status === 'success'}>
						Confirm
					</LoadingButton>
				</div>
			</form>
		</Form>
	)
}

export default ResetPasswordForm

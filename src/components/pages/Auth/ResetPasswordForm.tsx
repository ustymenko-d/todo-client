'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import AuthAPI from '@/api/auth.api'
import PasswordInput from '@/components/pages/Auth/components/PasswordInput'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import LoadingButton from '@/components/ui/LoadingButton'
import AuthValidation from '@/schemas/authForm.schema'
import { TPassword } from '@/types/auth'
import { TResponseState } from '@/types/common'

const formConfig = {
	validationSchema: AuthValidation.resetPassword,
	defaultValues: {
		password: '',
		confirmPassword: '',
	},
} as const

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
		setStatus('pending')

		try {
			const payload: TPassword = { password: values.password }
			const resetToken = searchParams.get('resetToken')

			const { success, message } = await AuthAPI.resetPassword(
				payload,
				resetToken
			)

			if (!success) throw new Error(message ?? 'Reset Password failed')

			setStatus('success')
			resetPasswordForm.reset(defaultValues)

			toast.success('Your password has been changed successfully!', {
				description:
					'You will be automatically redirected to the main page in 3 seconds.',
			})

			setTimeout(() => {
				router.push('/')
			}, 3000)
		} catch (error) {
			setStatus('error')
			console.error('Change password error: ', error)
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

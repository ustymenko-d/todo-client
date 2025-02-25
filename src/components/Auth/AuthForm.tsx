'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import RememberMeCheckbox from '../ui/RememberMeCheckbox'
import PasswordInput from '../ui/PasswordInput'
import EmailInput from '../ui/EmailInput'
import FormSuggestion from './FormSuggestion'
import { appStore } from '@/store/store'
import { useMemo } from 'react'

const formConfig = {
	login: {
		title: 'Welcome back',
		description:
			'Please enter your email and password below to login to your account',
		buttonText: 'Log in',
	},
	signup: {
		title: 'Create account',
		description:
			'Please enter your email and password below to sign up your account',
		buttonText: 'Sign up',
	},
	forgotPassword: {
		title: 'Forgot password',
		description: 'Please enter the email address provided during registration',
		buttonText: 'Send password reset email',
	},
	resetPassword: {
		title: 'Reset password',
		description: 'Please enter a new password',
		buttonText: 'Confirm',
	},
} as const

const AuthForm = ({
	className,
	...props
}: React.ComponentPropsWithoutRef<'div'>) => {
	const authFormType = appStore((state) => state.authFormType)

	const { title, description, buttonText } = useMemo(
		() => formConfig[authFormType],
		[authFormType]
	)

	return (
		<div
			className={cn('flex flex-col gap-6', className)}
			{...props}>
			<Card>
				<CardHeader>
					<CardTitle className='text-2xl'>{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent>
					<form>
						<div className='flex flex-col gap-6'>
							{authFormType !== 'resetPassword' && <EmailInput />}
							{authFormType !== 'forgotPassword' && (
								<PasswordInput label='Password' />
							)}
							{(authFormType === 'signup' ||
								authFormType === 'resetPassword') && (
								<PasswordInput label='Confirm password' />
							)}
							{authFormType === 'login' && <RememberMeCheckbox />}
							<Button
								type='submit'
								className='w-full'>
								{buttonText}
							</Button>
						</div>
						{authFormType !== 'resetPassword' && <FormSuggestion />}
					</form>
				</CardContent>
			</Card>
		</div>
	)
}

export default AuthForm

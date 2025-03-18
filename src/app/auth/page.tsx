'use client'

import { useMemo } from 'react'
import useAppStore from '@/store/store'
import { cn } from '@/lib/utils'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import AuthForm from '@/components/Auth/AuthForm'

const cardConfig = {
	login: {
		title: 'Welcome back',
		description:
			'Please enter your email and password below to login to your account',
	},
	signup: {
		title: 'Create account',
		description:
			'Please enter your email and password below to sign up your account',
	},
	forgotPassword: {
		title: 'Forgot password',
		description: 'Please enter the email address provided during registration',
	},
} as const

const AuthPage = () => {
	const authFormType = useAppStore((state) => state.authFormType)

	const { title, description } = useMemo(
		() => cardConfig[authFormType],
		[authFormType]
	)

	return (
		<div className='w-full max-w-sm'>
			<div className={cn('flex flex-col gap-6')}>
				<Card>
					<CardHeader>
						<CardTitle className='text-2xl'>{title}</CardTitle>
						<CardDescription>{description}</CardDescription>
					</CardHeader>
					<CardContent>
						<AuthForm />
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default AuthPage

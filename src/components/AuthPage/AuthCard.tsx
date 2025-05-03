'use client'

import useAppStore from '@/store/store'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import AuthForm from './AuthForm'

const cardConfig = {
	signin: {
		title: 'Welcome back',
		description:
			'Please enter your email and password to sign in to your account.',
	},
	signup: {
		title: 'Create an account',
		description: 'Please enter your email and password to create your account.',
	},
	forgotPassword: {
		title: 'Forgot your password?',
		description: 'Please enter the email address provided during registration',
	},
} as const

const AuthCard = () => {
	const authFormType = useAppStore((state) => state.authFormType)
	const { title, description } = cardConfig[authFormType]

	return (
		<Card className='max-w-sm'>
			<CardHeader>
				<CardTitle className='text-2xl'>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<AuthForm />
			</CardContent>
		</Card>
	)
}

export default AuthCard

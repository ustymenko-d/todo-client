'use client'

import Link from 'next/link'
import useAppStore from '@/store/store'
import { useMemo } from 'react'

type AuthFormType = 'login' | 'signup' | 'forgotPassword'

const signupSuggestion = {
	text: 'Don’t have an account?',
	linkText: 'Sign up',
	newType: 'signup' as AuthFormType,
}

const suggestionConfig: Record<
	AuthFormType,
	{ text: string; linkText: string; newType: AuthFormType }
> = {
	login: signupSuggestion,
	forgotPassword: signupSuggestion,
	signup: {
		text: 'Already have an account?',
		linkText: 'Log in',
		newType: 'login',
	},
} as const

const AuthFormSuggestion = () => {
	const authFormType = useAppStore((state) => state.authFormType)
	const setAuthFormType = useAppStore((state) => state.setAuthFormType)
	const {
		text: suggestionText,
		linkText,
		newType,
	} = useMemo(() => suggestionConfig[authFormType], [authFormType])

	return (
		<div className='flex flex-wrap gap-2 mt-4 text-center text-sm'>
			<span>{suggestionText}</span>
			{linkText && (
				<Link
					href='/auth'
					className='underline underline-offset-4'
					onClick={() => setAuthFormType(newType)}>
					{linkText}
				</Link>
			)}
		</div>
	)
}

export default AuthFormSuggestion

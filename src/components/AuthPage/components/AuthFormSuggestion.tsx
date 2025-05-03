import Link from 'next/link'
import useAppStore from '@/store/store'
import { TAuthForm } from '@/types/auth'

const signupSuggestion = {
	text: 'Don’t have an account?',
	linkText: 'Sign up',
	newType: 'signup' as TAuthForm,
}

const suggestionConfig: Record<
	TAuthForm,
	{ text: string; linkText: string; newType: TAuthForm }
> = {
	signin: signupSuggestion,
	forgotPassword: signupSuggestion,
	signup: {
		text: 'Already have an account?',
		linkText: 'Sign in',
		newType: 'signin' as TAuthForm,
	},
} as const

const AuthFormSuggestion = () => {
	const authFormType = useAppStore((state) => state.authFormType)
	const setAuthFormType = useAppStore((state) => state.setAuthFormType)
	const {
		text: suggestionText,
		linkText,
		newType,
	} = suggestionConfig[authFormType]

	return (
		<div className='flex flex-wrap gap-2 mt-4 text-sm text-center'>
			<span>{suggestionText}</span>
			<Link
				href='/auth'
				className='underline underline-offset-4'
				onClick={() => setAuthFormType(newType)}>
				{linkText}
			</Link>
		</div>
	)
}

export default AuthFormSuggestion

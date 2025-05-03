import { Folder, LayoutGrid, Settings, Sheet } from 'lucide-react'
import { TNavItem } from '@/types/common'
import AuthValidation from '@/schemas/authForm.schema'
import { IFormConfig, TAuthForm } from './types/auth'

export const navItems: TNavItem[] = [
	{
		href: '/home',
		label: 'Home',
		icon: LayoutGrid,
		description: 'Access the main navigation and overview of the application',
	},
	{
		href: '/table',
		label: 'Table',
		icon: Sheet,
		description: 'Manage your tasks in a tabular layout',
	},
	{
		href: '/folders',
		label: 'Folders',
		icon: Folder,
		description: 'Manage and organize your folders efficiently',
	},
	{
		href: '/settings',
		label: 'Settings',
		icon: Settings,
		description: 'View and update your account settings and preferences',
	},
]

export const formConfig: Record<TAuthForm, IFormConfig> = {
	signin: {
		fields: ['email', 'password', 'rememberMe'],
		buttonText: 'Sign in',
		validationSchema: AuthValidation.login,
		defaultValues: {
			email: '',
			password: '',
			rememberMe: false,
		},
	},
	signup: {
		fields: ['email', 'password', 'confirmPassword', 'rememberMe'],
		buttonText: 'Sign up',
		validationSchema: AuthValidation.signup,
		defaultValues: {
			email: '',
			password: '',
			confirmPassword: '',
			rememberMe: false,
		},
	},
	forgotPassword: {
		fields: ['email'],
		buttonText: 'Send a password reset email',
		validationSchema: AuthValidation.email,
		defaultValues: {
			email: '',
		},
	},
}

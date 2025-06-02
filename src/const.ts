import { Folder, LayoutGrid, Settings, Sheet } from 'lucide-react'

import AuthValidation from '@/schemas/authForm.schema'
import { TNavItem } from '@/types/common'

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
		description: 'Manage and organize your folders',
	},
	{
		href: '/settings',
		label: 'Settings',
		icon: Settings,
		description: 'View and update your account settings and preferences',
	},
] as const

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
} as const

export const TASK_FETCH_LIMIT: number = 25 as const

export const PUBLIC_PATHS_REQUIRING_TOKENS: Record<string, string> = {
	'/auth/reset-password': 'resetToken',
	'/verification': 'verificationToken',
} as const

import { Folder, LayoutGrid, LucideIcon, Settings, Sheet } from 'lucide-react'

export type TNavItem = {
	href: string
	label: string
	icon: LucideIcon
	description: string
}

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
		description: 'Organize and manage your folders efficiently',
	},
	{
		href: '/settings',
		label: 'Settings',
		icon: Settings,
		description: 'View and update your account settings and preferences',
	},
]

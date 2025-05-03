import { LucideIcon } from 'lucide-react'

export type TResponseState = 'default' | 'pending' | 'success' | 'error'

export interface IResponseStatus {
	success: boolean
	message: string
}

export interface IPagination {
	page: number
	limit: number
}

export interface IGetResponse extends IPagination {
	pages: number
	total: number
}

export interface IEditorSettings<T> {
	open: boolean
	mode: 'create' | 'edit'
	target: T | null
}

export type TNavItem = {
	href: string
	label: string
	icon: LucideIcon
	description: string
}

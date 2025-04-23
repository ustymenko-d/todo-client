export interface IResponseStatus {
	success: boolean
	message: string
}

export type TResponseStatus = 'default' | 'pending' | 'success' | 'error'

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
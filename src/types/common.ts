export interface IResponseStatus {
	success: boolean
	message: string
}

export type TResponseStatus = 'default' | 'pending' | 'success' | 'error'

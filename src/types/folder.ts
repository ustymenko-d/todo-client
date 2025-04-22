import { FolderNameSchema } from '@/schemas/folder.schema'
import { IGetResponse, IPagination, IResponseStatus } from './common'
import { z } from 'zod'

export type TFolderName = z.infer<typeof FolderNameSchema>

export interface ICreateFolderPayload {
	name: string
	userId: string
}

export interface IFolder extends ICreateFolderPayload {
	id: string
}

export type IGetFolderRequest = IPagination & {
	name?: z.infer<typeof FolderNameSchema>
}

export interface IFolderResponse extends IResponseStatus {
	folder: IFolder
}

export interface IGetFolderResponse extends IGetResponse {
	folders: IFolder[]
}

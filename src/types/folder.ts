import FolderValidation from '@/schemas/folder.schema'
import { IGetResponse, IPagination, IResponseStatus } from './common'
import { z } from 'zod'

export type TFolderName = z.infer<typeof FolderValidation.folderName>

export interface IFolder {
	id: string
	name: string
	userId: string
}

export interface IGetFoldersRequest extends IPagination {
	name?: z.infer<typeof FolderValidation.folderName>
}

export interface IFolderResponse extends IResponseStatus {
	folder: IFolder
}

export interface IGetFolderResponse extends IGetResponse {
	folders: IFolder[]
}

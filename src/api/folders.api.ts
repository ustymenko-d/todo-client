import { IRecaptcha } from '@/types/common'
import {
	IFolderResponse,
	IGetFoldersRequest,
	IGetFoldersResponse,
	TFolderName,
} from '@/types/folders'

import { ApiAxios, handleApiRequest } from './Axios'

const FOLDERS_API_URL = '/folders'

const buildQueryParams = (params: Record<string, string>) => new URLSearchParams(params).toString()

const FoldersAPI = {
	createFolder: (payload: TFolderName & IRecaptcha) =>
		handleApiRequest<IFolderResponse>(() => ApiAxios.post(`${FOLDERS_API_URL}`, payload)),

	getFolders: (searchParams: IGetFoldersRequest) => {
		const query = buildQueryParams(searchParams as unknown as Record<string, string>)

		return handleApiRequest<IGetFoldersResponse>(() => ApiAxios.get(`${FOLDERS_API_URL}?${query}`))
	},

	renameFolder: (id: string, payload: TFolderName) =>
		handleApiRequest<IFolderResponse>(() => ApiAxios.patch(`${FOLDERS_API_URL}/${id}`, payload)),

	deleteFolder: (id: string) =>
		handleApiRequest<IFolderResponse>(() => ApiAxios.delete(`${FOLDERS_API_URL}/${id}`)),
}

export default FoldersAPI

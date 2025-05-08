import { ApiAxios } from './Axios'
import { handleApiRequest } from '@/utils/requestHandler'
import {
	IFolderResponse,
	IGetFoldersRequest,
	IGetFoldersResponse,
	TFolderName,
} from '@/types/folders'

const FOLDERS_API_URL = '/folders'

const FoldersService = {
	createFolder: (payload: TFolderName) =>
		handleApiRequest(() =>
			ApiAxios.post<IFolderResponse>(`${FOLDERS_API_URL}`, payload)
		),

	getFolders: (searchParams: IGetFoldersRequest) => {
		const params = new URLSearchParams(
			searchParams as unknown as Record<string, string>
		).toString()

		return handleApiRequest(() =>
			ApiAxios.get<IGetFoldersResponse>(`${FOLDERS_API_URL}?${params}`)
		)
	},

	renameFolder: (id: string, payload: TFolderName) =>
		handleApiRequest(() =>
			ApiAxios.patch<IFolderResponse>(`${FOLDERS_API_URL}/${id}`, payload)
		),

	deleteFolder: (id: string) =>
		handleApiRequest(() =>
			ApiAxios.delete<IFolderResponse>(`${FOLDERS_API_URL}/${id}`)
		),
}

export default FoldersService

import { AxiosResponse } from 'axios'
import { ApiAxios } from './Axios'
import RequestHandler from '@/utils/RequestHandler'
import {
	IFolderResponse,
	IGetFoldersRequest,
	IGetFoldersResponse,
	TFolderName,
} from '@/types/folders'

const FOLDERS_API_URL = '/folder'

const FoldersService = {
	createFolder: (
		payload: TFolderName
	): Promise<AxiosResponse<IFolderResponse>> =>
		RequestHandler.handleRequest(() =>
			ApiAxios.post(`${FOLDERS_API_URL}`, payload)
		),

	getFolders: (
		searchParams: IGetFoldersRequest
	): Promise<AxiosResponse<IGetFoldersResponse>> => {
		const params = new URLSearchParams(
			searchParams as unknown as Record<string, string>
		).toString()
		return RequestHandler.handleRequest(() =>
			ApiAxios.get(`${FOLDERS_API_URL}?${params}`)
		)
	},

	renameFolder: (
		id: string,
		payload: TFolderName
	): Promise<AxiosResponse<IFolderResponse>> =>
		RequestHandler.handleRequest(() =>
			ApiAxios.patch(`${FOLDERS_API_URL}/${id}`, payload)
		),

	deleteFolder: (id: string): Promise<AxiosResponse<IFolderResponse>> =>
		RequestHandler.handleRequest(() =>
			ApiAxios.delete(`${FOLDERS_API_URL}/${id}`)
		),
}

export default FoldersService

import { AxiosResponse } from 'axios'
import { ApiAxios } from './Axios'
import RequestHandler from '@/utils/RequestHandler'
import {
	IFolderResponse,
	IGetFolderRequest,
	IGetFolderResponse,
	TFolderName,
} from '@/types/folder'

const FOLDER_API_URL = '/folder'

const FolderService = {
	createFolder: (
		payload: TFolderName
	): Promise<AxiosResponse<IFolderResponse>> =>
		RequestHandler.handleRequest(() =>
			ApiAxios.post(`${FOLDER_API_URL}`, payload)
		),

	getFolders: (
		searchParams: IGetFolderRequest
	): Promise<AxiosResponse<IGetFolderResponse>> => {
		const params = new URLSearchParams(
			searchParams as unknown as Record<string, string>
		).toString()
		return RequestHandler.handleRequest(() =>
			ApiAxios.get(`${FOLDER_API_URL}?${params}`)
		)
	},

	renameFolder: (
		id: string,
		payload: TFolderName
	): Promise<AxiosResponse<IFolderResponse>> =>
		RequestHandler.handleRequest(() =>
			ApiAxios.patch(`${FOLDER_API_URL}/${id}`, payload)
		),

	deleteFolder: (id: string): Promise<AxiosResponse<IFolderResponse>> =>
		RequestHandler.handleRequest(() =>
			ApiAxios.delete(`${FOLDER_API_URL}/${id}`)
		),
}

export default FolderService

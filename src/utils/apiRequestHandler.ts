import AuthService from '@/services/api/auth'
import Axios, { getServerAxios } from '@/services/Axios'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

type Method = 'post' | 'get' | 'delete' | 'patch' | 'put'

const createUrl = (apiUrl: string, endpoint: string, param?: string) =>
	param ? `${apiUrl}/${endpoint}?${param}` : `${apiUrl}/${endpoint}`

const getAxiosInstance = async (): Promise<AxiosInstance> =>
	typeof window === 'undefined' ? await getServerAxios() : Axios

const handleRequest = async (
	axiosInstance: AxiosInstance,
	config: AxiosRequestConfig
) => {
	try {
		const response = await axiosInstance.request(config)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.status === 401) {
			return await handleUnauthorizedError(axiosInstance, config)
		}
		console.error('API Request Error:', error)
		throw error
	}
}

const handleUnauthorizedError = async (
	axiosInstance: AxiosInstance,
	config: AxiosRequestConfig
) => {
	try {
		const { success } = await AuthService.refreshToken()
		if (success) {
			const { data } = await axiosInstance.request(config)
			return data
		}
	} catch (refreshError) {
		console.error('Token refresh failed:', refreshError)
		throw refreshError
	}
}

const apiRequestHandler = async <T>(
	apiUrl: string,
	method: Method,
	endpoint: string,
	payload?: T,
	param?: string
) => {
	const url = createUrl(apiUrl, endpoint, param)
	const config: AxiosRequestConfig = {
		url,
		method,
		...(payload ? { data: payload } : {}),
	}
	const axiosInstance = await getAxiosInstance()
	return await handleRequest(axiosInstance, config)
}

export default apiRequestHandler

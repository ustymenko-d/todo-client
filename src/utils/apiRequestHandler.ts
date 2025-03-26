import AuthService from '@/services/api/auth'
import Axios, { getServerAxios } from '@/services/Axios'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

type Method = 'post' | 'get' | 'delete' | 'patch' | 'put'

const createUrl = (endpoint: string, param?: string): string =>
	param ? `${endpoint}?${param}` : endpoint

const getAxiosInstance = async (): Promise<AxiosInstance> =>
	typeof window === 'undefined' ? await getServerAxios() : Axios

const handleRequest = async <R>(
	axiosInstance: AxiosInstance,
	config: AxiosRequestConfig
): Promise<R> => {
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

const apiRequestHandler = async <R, T = undefined>(
	endpoint: string,
	method: Method,
	payload?: T,
	param?: string
): Promise<R> => {
	const url = createUrl(endpoint, param)
	const config: AxiosRequestConfig = {
		url,
		method,
		...(payload ? { data: payload } : {}),
	}
	const axiosInstance = await getAxiosInstance()
	return await handleRequest<R>(axiosInstance, config)
}

export default apiRequestHandler

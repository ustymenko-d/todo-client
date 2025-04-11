import AuthService from '@/services/auth.service'
import { Axios, getServerAxios } from '@/services/Axios'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

type Method = 'post' | 'get' | 'delete' | 'patch' | 'put'

const createUrl = (endpoint: string, param?: string): string =>
	param ? `${endpoint}?${param}` : endpoint

const getAxiosInstance = async (): Promise<AxiosInstance> =>
	typeof window === 'undefined' ? await getServerAxios() : Axios

const handleRequest = async <R>(
	axiosInstance: AxiosInstance,
	config: AxiosRequestConfig
): Promise<AxiosResponse<R>> => {
	try {
		return await axiosInstance.request(config)
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.status === 401) {
			return await refreshAndRetry<R>(axiosInstance, config)
		}
		console.error('API Request Error:', error)
		throw error
	}
}

const refreshAndRetry = async <R>(
	axiosInstance: AxiosInstance,
	config: AxiosRequestConfig
): Promise<AxiosResponse<R>> => {
	try {
		const { data } = await AuthService.refreshToken()
		const { success } = data
		if (success) return await axiosInstance.request(config)
		throw new Error('Refresh token failed')
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
): Promise<AxiosResponse<R>> => {
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

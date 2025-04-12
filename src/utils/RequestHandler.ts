import AuthService from '@/services/Axios/auth.service'
import { Axios, getServerAxios } from '@/services/Axios/Axios'
import axios, {
	AxiosError,
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
	Method,
} from 'axios'
import { NextResponse } from 'next/server'

class RequestHandler {
	static async request<R, T = undefined>(
		url: string,
		method: Method,
		payload?: T
	): Promise<AxiosResponse<R>> {
		const config: AxiosRequestConfig = {
			url,
			method,
			...(payload && { data: payload }),
		}
		const axiosInstance = await this.getAxiosInstance()
		return await this.sendRequest<R>(axiosInstance, config)
	}

	static async routeRequest<TResponse, TPayload = undefined>(
		url: string,
		method: Method,
		payload?: TPayload
	): Promise<NextResponse> {
		try {
			const response = await this.request<TResponse, TPayload>(
				url,
				method,
				payload
			)

			const { data, status, headers } = response
			const nextResponse = NextResponse.json(data, { status })

			const cookies = headers['set-cookie']
			if (cookies) {
				if (Array.isArray(cookies)) {
					nextResponse.headers.set('set-cookie', cookies.join(', '))
				} else {
					nextResponse.headers.set('set-cookie', cookies)
				}
			}

			return nextResponse
		} catch (error) {
			console.error('Error in route handler:', error)

			if (axios.isAxiosError(error)) {
				const err = error as AxiosError
				const status = err.response?.status || 500
				const message = err.response?.data || { error: 'Request failed' }

				return NextResponse.json(message, { status })
			}

			return NextResponse.json(
				{ error: 'Unexpected server error' },
				{ status: 500 }
			)
		}
	}

	private static async getAxiosInstance(): Promise<AxiosInstance> {
		return typeof window === 'undefined' ? await getServerAxios() : Axios
	}

	private static async sendRequest<R>(
		axiosInstance: AxiosInstance,
		config: AxiosRequestConfig
	): Promise<AxiosResponse<R>> {
		try {
			return await axiosInstance.request(config)
		} catch (error) {
			if (axios.isAxiosError(error) && error.response?.status === 401) {
				return await this.refreshAndRetry<R>(axiosInstance, config)
			}
			console.error('API Request Error:', error)
			throw error
		}
	}

	private static async refreshAndRetry<R>(
		axiosInstance: AxiosInstance,
		config: AxiosRequestConfig
	): Promise<AxiosResponse<R>> {
		try {
			const { data } = await AuthService.refreshToken()
			if (data.success) {
				return await axiosInstance.request(config)
			}
			throw new Error('Refresh token failed')
		} catch (refreshError) {
			await AuthService.clearAuthCookies()
			console.error('Token refresh failed:', refreshError)
			throw refreshError
		}
	}
}

export default RequestHandler

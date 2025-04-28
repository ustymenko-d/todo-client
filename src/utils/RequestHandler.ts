import AuthService from '@/services/auth.service'
import { Axios, getServerAxios } from '@/services/Axios'
import axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios'
import { NextResponse } from 'next/server'

interface ICustomAxiosRequestConfig extends AxiosRequestConfig {
	skipRefresh?: boolean
}

class RequestHandler {
	static async request<TPayload = undefined>(
		url: string,
		method: Method,
		payload?: TPayload,
		extraConfig?: ICustomAxiosRequestConfig
	): Promise<NextResponse> {
		try {
			const config: ICustomAxiosRequestConfig = {
				url,
				method,
				...(payload && { data: payload }),
				skipRefresh: extraConfig?.skipRefresh,
				headers: {
					...(extraConfig?.headers || {}),
				},
			}
			const axiosInstance = await this.getAxiosInstance()
			const response = await axiosInstance.request(config)
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
			if (
				axios.isAxiosError(error) &&
				!extraConfig?.skipRefresh &&
				error.response?.data?.message !== 'Missing access or refresh token' &&
				error.status === 401
			) {
				return NextResponse.json({ needRefresh: true })
			}

			return NextResponse.json(
				axios.isAxiosError(error) && error.response?.data
					? error.response.data
					: 'Unexpected server error'
			)
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static async handleRequest(apiRequest: any) {
		const response = await apiRequest()
		if (response.data.needRefresh) {
			try {
				await AuthService.refreshToken()
				return await apiRequest()
			} catch (error) {
				await AuthService.clearAuthCookies()
				throw error
			}
		} else {
			return response
		}
	}

	private static async getAxiosInstance(): Promise<AxiosInstance> {
		return typeof window === 'undefined' ? await getServerAxios() : Axios
	}
}

export default RequestHandler

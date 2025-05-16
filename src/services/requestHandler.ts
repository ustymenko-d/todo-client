import axios, {
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
	Method,
} from 'axios'
import { Axios, getServerAxios } from '@/services/Axios'
import { NextResponse } from 'next/server'
import AuthService from '@/services/auth.service'

type NeedRefreshResponse = { needRefresh: true }
type MaybeWithNeedRefresh<T> = T | NeedRefreshResponse

interface ICustomAxiosRequestConfig extends AxiosRequestConfig {
	skipRefresh?: boolean
}

export const handleApiRequest = async <T>(
	apiRequest: () => Promise<AxiosResponse<MaybeWithNeedRefresh<T>>>,
	allowRetry = true
): Promise<AxiosResponse<T>> => {
	const response = await apiRequest()

	if (isNeedRefreshResponse(response.data)) {
		if (!allowRetry) {
			await AuthService.clearAuthCookies()
			throw new Error('Token refresh failed after retry')
		}

		try {
			await AuthService.refreshToken()
			return handleApiRequest(apiRequest, false)
		} catch (error) {
			await AuthService.clearAuthCookies()
			throw error
		}
	}

	return response as AxiosResponse<T>
}

export const handleRequest = async <TPayload = undefined>(
	url: string,
	method: Method,
	payload?: TPayload,
	extraConfig: ICustomAxiosRequestConfig = {}
): Promise<NextResponse> => {
	try {
		const axiosInstance = await getAxiosInstance()
		const config: ICustomAxiosRequestConfig = {
			url,
			method,
			...(payload && { data: payload }),
			skipRefresh: extraConfig?.skipRefresh,
			headers: { ...extraConfig.headers },
		}

		const response = await axiosInstance.request(config)
		const { data, status, headers } = response

		const nextResponse = NextResponse.json(data, { status })
		const cookies = headers['set-cookie']

		if (cookies) {
			nextResponse.headers.set(
				'set-cookie',
				Array.isArray(cookies) ? cookies.join(', ') : cookies
			)
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

const isNeedRefreshResponse = (data: unknown): data is NeedRefreshResponse =>
	typeof data === 'object' && data !== null && 'needRefresh' in data

const getAxiosInstance = async (): Promise<AxiosInstance> =>
	typeof window === 'undefined' ? await getServerAxios() : Axios

import axios, {
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
	Method,
} from 'axios'
import { NextResponse } from 'next/server'
import { toast } from 'sonner'

import AuthAPI from '@/api/auth.api'
import { Axios, getServerAxios } from '@/api/Axios'
import createSingletonPromise from '@/utils/createSingletonPromise'

type NeedRefreshResponse = { needRefresh: true }
type MaybeWithNeedRefresh<T> = T | NeedRefreshResponse

interface ICustomAxiosRequestConfig extends AxiosRequestConfig {
	skipRefresh?: boolean
}

export const handleApiRequest = async <T>(
	apiRequest: () => Promise<AxiosResponse<MaybeWithNeedRefresh<T>>>,
	allowRetry = true
): Promise<T> => {
	try {
		const { data } = await apiRequest()

		if (isNeedRefreshResponse(data) && allowRetry) {
			await handleTokenRefresh()
			return await handleApiRequest(apiRequest, false)
		}

		return data as T
	} catch (error) {
		let message = 'Unexpected error'

		if (axios.isAxiosError(error)) {
			message = error.response?.data?.message || error.message
		} else if (error instanceof Error) {
			message = error.message
		}

		toast.error(message)

		throw error
	}
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

		return withSetCookie(
			NextResponse.json(data, { status }),
			headers['set-cookie']
		)
	} catch (error) {
		return handleAxiosError(error, extraConfig.skipRefresh)
	}
}

const getAxiosInstance = async (): Promise<AxiosInstance> =>
	typeof window === 'undefined' ? await getServerAxios() : Axios

const isNeedRefreshResponse = (data: unknown): data is NeedRefreshResponse =>
	typeof data === 'object' && data !== null && 'needRefresh' in data

const refreshToken = createSingletonPromise(() => AuthAPI.refreshToken())

const handleTokenRefresh = async () => {
	try {
		await refreshToken()
	} catch {
		await AuthAPI.clearAuthCookies()
		toast.warning('Authentication cookies have been cleared', {
			description: 'Please reload the page to continue',
			action: {
				label: 'Reload',
				onClick: () => window.location.reload(),
			},
			duration: 10000,
		})
		throw new Error('Token refresh failed')
	}
}

const withSetCookie = (
	res: NextResponse,
	cookies?: string | string[]
): NextResponse => {
	if (!cookies) return res

	res.headers.set(
		'set-cookie',
		Array.isArray(cookies) ? cookies.join(', ') : cookies
	)

	return res
}

const handleAxiosError = (error: unknown, skipRefresh?: boolean) => {
	if (axios.isAxiosError(error)) {
		const res = error.response
		const is401 =
			res?.status === 401 &&
			res.data?.message !== 'Missing access or refresh token'

		if (is401 && !skipRefresh) {
			return NextResponse.json({ needRefresh: true })
		}

		const data = {
			message: res?.data?.message || 'Unexpected server error',
		}

		return NextResponse.json(data, { status: res?.status || 500 })
	}

	return NextResponse.json(
		{ message: 'Unexpected non-Axios error' },
		{ status: 500 }
	)
}

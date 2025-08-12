import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import { NextResponse } from 'next/server'
import { toast } from 'sonner'

import createSingletonPromise from '@/utils/createSingletonPromise'

import AuthAPI from './auth.api'

const baseConfig = {
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
	withCredentials: true,
	timeout: 60000,
}

export const Axios: AxiosInstance = axios.create(baseConfig)
export const ApiAxios: AxiosInstance = axios.create({
	...baseConfig,
	baseURL:
		typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
			? new URL('/api', window.location.origin).toString()
			: new URL('/api', process.env.NEXT_PUBLIC_FRONTEND_URL).toString(),
})

if (typeof window !== 'undefined') {
	import('@/lib/socket').then(({ getSocketId }) => {
		ApiAxios.interceptors.request.use(config => {
			const socketId = getSocketId()
			if (socketId) {
				config.headers['x-socket-id'] = socketId
			}
			return config
		})
	})
}

export const getServerAxios = async () => {
	const { cookies } = await import('next/headers')
	const serverAxios = axios.create(baseConfig)

	serverAxios.interceptors.request.use(async config => {
		const cookieStore = await cookies()
		const cookieHeader = cookieStore.toString()

		if (cookieHeader) {
			config.headers.set('Cookie', cookieHeader)
		}

		return config
	})

	return serverAxios
}

const getAxiosInstance = async (): Promise<AxiosInstance> =>
	typeof window === 'undefined' ? await getServerAxios() : Axios

export const handleApiRequest = async <T>(
	apiRequest: () => Promise<AxiosResponse<T>>,
	allowRetry = true
): Promise<T> => {
	try {
		const { data } = await apiRequest()

		if (isNeedTokensRefresh(data)) {
			if (!allowRetry) throw new Error('Tokens need to be refresh')
			await handleTokenRefresh()
			return handleApiRequest(apiRequest, false)
		} else {
			return data
		}
	} catch (error) {
		const message = axios.isAxiosError(error)
			? error.response?.data?.message || error.message
			: error instanceof Error
			? error.message
			: 'Unexpected error'

		toast.error(message)
		throw error
	}
}

export const handleRequest = async <T = undefined>(
	url: string,
	method: Method,
	payload?: T,
	extraConfig: AxiosRequestConfig = {}
): Promise<NextResponse> => {
	try {
		const axiosInstance = await getAxiosInstance()

		const { data, status, headers } = await axiosInstance.request({
			url,
			method,
			...(payload && { data: payload }),
			...extraConfig,
		})

		return withSetCookie(NextResponse.json(data, { status }), headers['set-cookie'])
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const res = error.response

			if (res?.status === 401 && res.data?.message === 'Token expired') {
				return NextResponse.json({ needRefresh: true })
			}
		}

		throw error
	}
}

const isNeedTokensRefresh = (data: unknown): data is { needRefresh: true } =>
	typeof data === 'object' && data !== null && 'needRefresh' in data && data.needRefresh === true

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

		throw new Error('Tokens refresh failed')
	}
}

const refreshToken = createSingletonPromise(() => AuthAPI.refreshToken())

const withSetCookie = (res: NextResponse, cookies?: string | string[]): NextResponse => {
	if (!cookies) return res
	;(Array.isArray(cookies) ? cookies : [cookies]).forEach(cookie =>
		res.headers.append('set-cookie', cookie)
	)

	return res
}

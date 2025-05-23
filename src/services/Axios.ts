import axios, { AxiosInstance } from 'axios'

const baseConfig = {
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
	withCredentials: true,
	timeout: 5000,
}

export const Axios: AxiosInstance = axios.create(baseConfig)
export const ApiAxios: AxiosInstance = axios.create({
	...baseConfig,
	baseURL: new URL('/api', process.env.NEXT_PUBLIC_FRONTEND_URL).toString(),
})

if (typeof window !== 'undefined') {
	import('@/lib/socket').then(({ getSocketId }) => {
		ApiAxios.interceptors.request.use((config) => {
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

	serverAxios.interceptors.request.use(async (config) => {
		const cookieStore = await cookies()
		const cookieHeader = cookieStore.toString()

		if (cookieHeader) {
			config.headers.set('Cookie', cookieHeader)
		}

		return config
	})

	return serverAxios
}

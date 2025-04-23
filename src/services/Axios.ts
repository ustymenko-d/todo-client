import axios, { AxiosInstance } from 'axios'

const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL ?? 'http://localhost:3000'
const baseConfig = {
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
	withCredentials: true,
	timeout: 5000,
}

export const Axios: AxiosInstance = axios.create(baseConfig)
export const ApiAxios: AxiosInstance = axios.create({
	...baseConfig,
	baseURL: new URL('/api', frontendUrl).toString(),
})

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

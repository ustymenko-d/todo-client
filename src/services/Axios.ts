import axios from 'axios'

const baseConfig = {
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
	withCredentials: true,
	timeout: 5000,
}

const Axios = axios.create(baseConfig)

export default Axios

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

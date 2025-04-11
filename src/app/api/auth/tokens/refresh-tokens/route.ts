import { IResponseStatus } from '@/types/common'
import apiRequestHandler from '@/utils/apiRequestHandler'
import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse> {
	try {
		const response = await apiRequestHandler<IResponseStatus>(
			'/auth/tokens/refresh-tokens',
			'get'
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
		console.error('Request handler error during login: ', error)

		if (axios.isAxiosError(error)) {
			const status = error.response?.status || 500
			const message = error.response?.data || { error: 'Axios error' }

			return NextResponse.json(message, { status })
		}

		return NextResponse.json(
			{ error: 'Request handler error during login' },
			{ status: 500 }
		)
	}
}

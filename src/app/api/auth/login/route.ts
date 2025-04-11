import { baseAuthDto } from '@/dto/auth'
import { IAuthResponse } from '@/types/auth'
import apiRequestHandler from '@/utils/apiRequestHandler'
import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		const body = await request.json()
		const response = await apiRequestHandler<IAuthResponse, baseAuthDto>(
			'/auth/login',
			'post',
			body
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

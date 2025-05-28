import { NextRequest, NextResponse } from 'next/server'

import { handleRequest } from '@/services/requestHandler'

export const POST = async (request: NextRequest): Promise<NextResponse> => {
	const body = await request.json()
	const socketId = request.headers.get('x-socket-id') || undefined

	return handleRequest('/folders', 'post', body, {
		headers: {
			'x-socket-id': socketId,
		},
	})
}

export const GET = async (request: NextRequest): Promise<NextResponse> => {
	const searchParams = request.nextUrl.searchParams.toString()
	return handleRequest(`/folders?${searchParams}`, 'get')
}

import { NextRequest, NextResponse } from 'next/server'
import RequestHandler from '@/utils/RequestHandler'
import { TGetTasksRequest } from '@/types/tasks'

export const POST = async (request: NextRequest): Promise<NextResponse> => {
	const body = await request.json()
	const cookie = request.headers.get('cookie') || ''
	return RequestHandler.request<TGetTasksRequest>('/tasks/get', 'post', body, {
		headers: {
			Cookie: cookie,
		},
	})
}

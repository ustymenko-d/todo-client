import { NextRequest, NextResponse } from 'next/server'
import { handleRequest } from '@/services/requestHandler'
import { TGetTasksRequest } from '@/types/tasks'

export const POST = async (request: NextRequest): Promise<NextResponse> => {
	const body = await request.json()
	const cookie = request.headers.get('cookie') || ''
	return handleRequest<TGetTasksRequest>('/tasks/get', 'post', body, {
		headers: {
			Cookie: cookie,
		},
	})
}

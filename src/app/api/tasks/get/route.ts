import { TGetTasksRequest } from '@/types/tasks'
import RequestHandler from '@/utils/RequestHandler'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest): Promise<NextResponse> {
	const body = await request.json()
	const cookie = request.headers.get('cookie') || ''
	return RequestHandler.request<TGetTasksRequest>('/tasks/get', 'post', body, {
		headers: {
			Cookie: cookie,
		},
	})
}

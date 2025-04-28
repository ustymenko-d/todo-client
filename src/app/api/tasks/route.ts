import { NextRequest, NextResponse } from 'next/server'
import RequestHandler from '@/utils/RequestHandler'
import { TTask } from '@/types/tasks'

export const PUT = async (request: NextRequest): Promise<NextResponse> => {
	const body = await request.json()
	return RequestHandler.request<TTask>('/tasks', 'put', body)
}

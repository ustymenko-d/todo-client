import { NextRequest, NextResponse } from 'next/server'

import { handleRequest } from '@/api/requestHandler'
import { TGetTasksRequest } from '@/types/tasks'

export const POST = async (request: NextRequest): Promise<NextResponse> => {
	const body = await request.json()
	return handleRequest<TGetTasksRequest>('/tasks/get', 'post', body)
}

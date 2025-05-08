import { NextRequest, NextResponse } from 'next/server'
import { handleRequest } from '@/utils/requestHandler'
import { TTask } from '@/types/tasks'

export const PUT = async (request: NextRequest): Promise<NextResponse> => {
	const body = await request.json()
	return handleRequest<TTask>('/tasks', 'put', body)
}

import { NextRequest, NextResponse } from 'next/server'
import { handleRequest } from '@/utils/requestHandler'
import { TTaskBase } from '@/types/tasks'

export const POST = async (request: NextRequest): Promise<NextResponse> => {
	const body = await request.json()
	return handleRequest<TTaskBase>('/tasks/create', 'post', body)
}

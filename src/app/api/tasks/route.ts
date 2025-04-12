import { ITaskResponse } from '@/types/tasks'
import RequestHandler from '@/utils/RequestHandler'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest): Promise<NextResponse> {
	const body = await request.json()
	return RequestHandler.routeRequest<ITaskResponse>('/tasks', 'put', body)
}

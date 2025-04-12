import { TaskBaseDto } from '@/dto/tasks'
import { ITaskResponse } from '@/types/tasks'
import RequestHandler from '@/utils/RequestHandler'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest): Promise<NextResponse> {
	const body = await request.json()
	return RequestHandler.routeRequest<ITaskResponse, TaskBaseDto>(
		'/tasks/create',
		'post',
		body
	)
}

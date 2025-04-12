import { GetTasksRequestDto } from '@/dto/tasks'
import { IGetTasksResponse } from '@/types/tasks'
import RequestHandler from '@/utils/RequestHandler'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest): Promise<NextResponse> {
	const body = await request.json()
	return RequestHandler.routeRequest<IGetTasksResponse, GetTasksRequestDto>(
		'/tasks/get',
		'post',
		body
	)
}

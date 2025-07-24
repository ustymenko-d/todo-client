import { NextRequest, NextResponse } from 'next/server'

import { handleRequest } from '@/api/requestHandler'
import { IRecaptcha } from '@/types/common'
import { TTaskBase } from '@/types/tasks'

export const POST = async (request: NextRequest): Promise<NextResponse> => {
	const body = await request.json()
	const socketId = request.headers.get('x-socket-id') || undefined
	return handleRequest<TTaskBase & IRecaptcha>('/tasks/create', 'post', body, {
		headers: {
			'x-socket-id': socketId,
		},
	})
}

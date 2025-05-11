import { NextRequest, NextResponse } from 'next/server'
import getIdFromRequest from '@/utils/getIdFromRequest'
import { handleRequest } from '@/services/requestHandler'

export const PATCH = async (request: NextRequest): Promise<NextResponse> => {
	const id = getIdFromRequest(request, 'tasks')
	if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
	const socketId = request.headers.get('x-socket-id') || undefined
	return handleRequest(`/tasks/${id}`, 'patch', undefined, {
		headers: {
			'x-socket-id': socketId,
		},
	})
}

export const DELETE = async (request: NextRequest): Promise<NextResponse> => {
	const id = getIdFromRequest(request, 'tasks')
	if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
	const socketId = request.headers.get('x-socket-id') || undefined
	return handleRequest(`/tasks/${id}`, 'delete', undefined, {
		headers: {
			'x-socket-id': socketId,
		},
	})
}

import { NextRequest, NextResponse } from 'next/server'

import { handleRequest } from '@/api/Axios'
import getIdFromRequest from '@/utils/getIdFromRequest'

export const PATCH = async (request: NextRequest): Promise<NextResponse> => {
	const body = await request.json()
	const id = getIdFromRequest(request, 'folders')
	if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
	const socketId = request.headers.get('x-socket-id') || undefined

	return handleRequest(`/folders/${id}`, 'patch', body, {
		headers: {
			'x-socket-id': socketId,
		},
	})
}

export const DELETE = async (request: NextRequest): Promise<NextResponse> => {
	const id = getIdFromRequest(request, 'folders')
	if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
	const socketId = request.headers.get('x-socket-id') || undefined

	return handleRequest(`/folders/${id}`, 'delete', undefined, {
		headers: {
			'x-socket-id': socketId,
		},
	})
}

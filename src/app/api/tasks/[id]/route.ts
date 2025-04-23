import { NextRequest, NextResponse } from 'next/server'
import getIdFromRequest from '@/utils/getIdFromRequest'
import RequestHandler from '@/utils/RequestHandler'

export const PATCH = async (request: NextRequest): Promise<NextResponse> => {
	const id = getIdFromRequest(request, 'tasks')
	if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
	return RequestHandler.request(`/tasks/${id}`, 'patch')
}

export const DELETE = async (request: NextRequest): Promise<NextResponse> => {
	const id = getIdFromRequest(request, 'tasks')
	if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
	return RequestHandler.request(`/tasks/${id}`, 'delete')
}

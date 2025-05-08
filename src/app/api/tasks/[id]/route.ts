import { NextRequest, NextResponse } from 'next/server'
import getIdFromRequest from '@/utils/getIdFromRequest'
import { handleRequest } from '@/utils/requestHandler'

export const PATCH = async (request: NextRequest): Promise<NextResponse> => {
	const id = getIdFromRequest(request, 'tasks')
	if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
	return handleRequest(`/tasks/${id}`, 'patch')
}

export const DELETE = async (request: NextRequest): Promise<NextResponse> => {
	const id = getIdFromRequest(request, 'tasks')
	if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
	return handleRequest(`/tasks/${id}`, 'delete')
}

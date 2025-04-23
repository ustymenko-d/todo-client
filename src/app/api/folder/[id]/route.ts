import { NextRequest, NextResponse } from 'next/server'
import getIdFromRequest from '@/utils/getIdFromRequest'
import RequestHandler from '@/utils/RequestHandler'

export const PATCH = async (request: NextRequest): Promise<NextResponse> => {
	const body = await request.json()
	const id = getIdFromRequest(request, 'folder')
	if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
	return RequestHandler.request(`/folder/${id}`, 'patch', body)
}

export const DELETE = async (request: NextRequest): Promise<NextResponse> => {
	const id = getIdFromRequest(request, 'folder')
	if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
	return RequestHandler.request(`/folder/${id}`, 'delete')
}

import RequestHandler from '@/utils/RequestHandler'
import { NextRequest, NextResponse } from 'next/server'

function getTaskIdFromRequest(request: NextRequest): string | null {
	const pathname = request.nextUrl.pathname
	const match = pathname.match(/\/api\/tasks\/([^\/]+)/)
	return match ? match[1] : null
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
	const id = getTaskIdFromRequest(request)
	if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
	return RequestHandler.request(`/tasks/${id}`, 'patch')
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
	const id = getTaskIdFromRequest(request)
	if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
	return RequestHandler.request(`/tasks/${id}`, 'delete')
}

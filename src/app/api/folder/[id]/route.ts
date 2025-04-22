import RequestHandler from '@/utils/RequestHandler'
import { NextRequest, NextResponse } from 'next/server'

function getFolderIdFromRequest(request: NextRequest): string | null {
	const pathname = request.nextUrl.pathname
	const match = pathname.match(/\/api\/folder\/([^\/]+)/)
	return match ? match[1] : null
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
	const body = await request.json()
	const id = getFolderIdFromRequest(request)
	if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
	return RequestHandler.request(`/folder/${id}`, 'patch', body)
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
	const id = getFolderIdFromRequest(request)
	if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
	return RequestHandler.request(`/folder/${id}`, 'delete')
}

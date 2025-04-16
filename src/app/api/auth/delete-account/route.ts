import RequestHandler from '@/utils/RequestHandler'
import { NextResponse } from 'next/server'

export async function DELETE(): Promise<NextResponse> {
	return RequestHandler.request('/auth/delete-account', 'delete')
}

import { NextRequest, NextResponse } from 'next/server'
import RequestHandler from '@/utils/RequestHandler'

export const PUT = async (request: NextRequest): Promise<NextResponse> => {
	const body = await request.json()
	return RequestHandler.request('/tasks', 'put', body)
}

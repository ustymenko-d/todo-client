import { NextRequest, NextResponse } from 'next/server'
import RequestHandler from '@/utils/RequestHandler'

export const POST = async (request: NextRequest): Promise<NextResponse> => {
	const body = await request.json()
	return RequestHandler.request('/folder', 'post', body)
}

export const GET = async (request: NextRequest): Promise<NextResponse> => {
	const searchParams = request.nextUrl.searchParams.toString()
	return RequestHandler.request(`/folder?${searchParams}`, 'get')
}

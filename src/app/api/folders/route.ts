import { NextRequest, NextResponse } from 'next/server'
import { handleRequest } from '@/utils/requestHandler'

export const POST = async (request: NextRequest): Promise<NextResponse> => {
	const body = await request.json()
	return handleRequest('/folders', 'post', body)
}

export const GET = async (request: NextRequest): Promise<NextResponse> => {
	const searchParams = request.nextUrl.searchParams.toString()
	return handleRequest(`/folders?${searchParams}`, 'get')
}

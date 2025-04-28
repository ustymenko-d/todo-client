import { NextRequest, NextResponse } from 'next/server'
import RequestHandler from '@/utils/RequestHandler'
import { TAuthPayload } from '@/types/auth'

export const POST = async (request: NextRequest): Promise<NextResponse> => {
	const body = await request.json()
	return RequestHandler.request<TAuthPayload>('/auth/signup', 'post', body, {
		skipRefresh: true,
	})
}

import { TBaseAuth } from '@/types/auth'
import RequestHandler from '@/utils/RequestHandler'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest): Promise<NextResponse> {
	const body = await request.json()
	return RequestHandler.request<TBaseAuth>('/auth/login', 'post', body, {
		skipRefresh: true,
	})
}

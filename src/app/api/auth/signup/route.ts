import { baseAuthDto } from '@/dto/auth'
import RequestHandler from '@/utils/RequestHandler'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest): Promise<NextResponse> {
	const body = await request.json()
	return RequestHandler.request<baseAuthDto>('/auth/signup', 'post', body, {
		skipRefresh: true,
	})
}

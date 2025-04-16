import { emailDto } from '@/dto/auth'
import RequestHandler from '@/utils/RequestHandler'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest): Promise<NextResponse> {
	const body = await request.json()
	return RequestHandler.request<emailDto>(
		'/auth/password/forgot-password',
		'post',
		body,
		{ skipRefresh: true }
	)
}

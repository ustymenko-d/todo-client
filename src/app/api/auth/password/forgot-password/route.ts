import { NextRequest, NextResponse } from 'next/server'
import RequestHandler from '@/utils/RequestHandler'
import { TEmail } from '@/types/auth'

export const POST = async (request: NextRequest): Promise<NextResponse> => {
	const body = await request.json()
	return RequestHandler.request<TEmail>(
		'/auth/password/forgot-password',
		'post',
		body,
		{ skipRefresh: true }
	)
}

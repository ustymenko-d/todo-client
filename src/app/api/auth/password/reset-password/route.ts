import { NextRequest, NextResponse } from 'next/server'
import RequestHandler from '@/utils/RequestHandler'
import { TPassword } from '@/types/auth'

export const PATCH = async (request: NextRequest): Promise<NextResponse> => {
	const body = await request.json()
	const searchParams = request.nextUrl.searchParams.toString()
	return RequestHandler.request<TPassword>(
		`/auth/password/reset-password?${searchParams}`,
		'patch',
		body,
		{ skipRefresh: true }
	)
}

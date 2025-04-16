import { passwordDto } from '@/dto/auth'
import RequestHandler from '@/utils/RequestHandler'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest): Promise<NextResponse> {
	const body = await request.json()
	const searchParams = request.nextUrl.searchParams.toString()
	return RequestHandler.request<passwordDto>(
		`/auth/password/reset-password?${searchParams}`,
		'patch',
		body,
		{ skipRefresh: true }
	)
}

import { NextRequest, NextResponse } from 'next/server'
import RequestHandler from '@/utils/RequestHandler'

export const GET = async (request: NextRequest): Promise<NextResponse> => {
	const searchParams = request.nextUrl.searchParams.toString()
	return RequestHandler.request(
		`/auth/email-verification?${searchParams}`,
		'get',
		undefined,
		{ skipRefresh: true }
	)
}

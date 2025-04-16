import RequestHandler from '@/utils/RequestHandler'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest): Promise<NextResponse> {
	const searchParams = request.nextUrl.searchParams.toString()
	return RequestHandler.request(
		`/auth/email-verification?${searchParams}`,
		'get',
		undefined,
		{ skipRefresh: true }
	)
}

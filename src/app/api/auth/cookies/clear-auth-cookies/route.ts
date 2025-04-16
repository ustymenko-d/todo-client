import RequestHandler from '@/utils/RequestHandler'
import { NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse> {
	return RequestHandler.request(
		'/auth/cookies/clear-auth-cookies',
		'get',
		undefined,
		{ skipRefresh: true }
	)
}

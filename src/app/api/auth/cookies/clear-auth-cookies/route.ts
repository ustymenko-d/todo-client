import { IResponseStatus } from '@/types/common'
import RequestHandler from '@/utils/RequestHandler'
import { NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse> {
	return RequestHandler.routeRequest<IResponseStatus>(
		'/auth/cookies/clear-auth-cookies',
		'get',
		undefined,
		{ skipRefresh: true }
	)
}

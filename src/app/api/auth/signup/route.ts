import { baseAuthDto } from '@/dto/auth'
import { IAuthResponse } from '@/types/auth'
import RequestHandler from '@/utils/RequestHandler'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest): Promise<NextResponse> {
	const body = await request.json()
	return RequestHandler.routeRequest<IAuthResponse, baseAuthDto>(
		'/auth/signup',
		'post',
		body,
		{ skipRefresh: true }
	)
}

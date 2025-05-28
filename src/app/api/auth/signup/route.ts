import { NextRequest, NextResponse } from 'next/server'

import { handleRequest } from '@/services/requestHandler'
import { TAuthPayload } from '@/types/auth'

export const POST = async (request: NextRequest): Promise<NextResponse> => {
	const body = await request.json()
	return handleRequest<TAuthPayload>('/auth/signup', 'post', body, {
		skipRefresh: true,
	})
}

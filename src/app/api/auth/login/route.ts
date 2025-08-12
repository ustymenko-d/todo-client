import { NextRequest, NextResponse } from 'next/server'

import { handleRequest } from '@/api/Axios'
import { TAuthPayload } from '@/types/auth'

export const POST = async (request: NextRequest): Promise<NextResponse> => {
	const body = await request.json()
	return handleRequest<TAuthPayload>('/auth/login', 'post', body)
}

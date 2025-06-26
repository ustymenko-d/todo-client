import { NextRequest, NextResponse } from 'next/server'

import { handleRequest } from '@/api/requestHandler'
import { TEmail } from '@/types/auth'

export const POST = async (request: NextRequest): Promise<NextResponse> => {
	const body = await request.json()
	return handleRequest<TEmail>('/auth/password/forgot-password', 'post', body)
}

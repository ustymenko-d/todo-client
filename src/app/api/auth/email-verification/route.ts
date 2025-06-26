import { NextRequest, NextResponse } from 'next/server'

import { handleRequest } from '@/api/requestHandler'

export const GET = async (request: NextRequest): Promise<NextResponse> => {
	const searchParams = request.nextUrl.searchParams.toString()
	return handleRequest(`/auth/email-verification?${searchParams}`, 'get')
}

import { NextRequest, NextResponse } from 'next/server'

import { handleRequest } from '@/api/requestHandler'
import { TPassword } from '@/types/auth'
import { IRecaptcha } from '@/types/common'

export const PATCH = async (request: NextRequest): Promise<NextResponse> => {
	const body = await request.json()
	const searchParams = request.nextUrl.searchParams.toString()
	return handleRequest<TPassword & IRecaptcha>(
		`/auth/password/reset-password?${searchParams}`,
		'patch',
		body,
		{ skipRefresh: true }
	)
}

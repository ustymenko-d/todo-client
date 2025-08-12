import { NextRequest, NextResponse } from 'next/server'

import { handleRequest } from '@/api/Axios'
import { TEmail } from '@/types/auth'
import { IRecaptcha } from '@/types/common'

export const POST = async (request: NextRequest): Promise<NextResponse> => {
	const body = await request.json()
	return handleRequest<TEmail & IRecaptcha>('/auth/password/forgot-password', 'post', body)
}

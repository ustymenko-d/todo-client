import { NextRequest, NextResponse } from 'next/server'

import { handleRequest } from '@/api/requestHandler'
import { IRecaptcha } from '@/types/common'

export const DELETE = async (request: NextRequest): Promise<NextResponse> => {
	const body = await request.json()
	return handleRequest<IRecaptcha>('/auth/delete-account', 'delete', body)
}

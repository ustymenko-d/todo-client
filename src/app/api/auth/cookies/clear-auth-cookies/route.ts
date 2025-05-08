import { NextResponse } from 'next/server'
import { handleRequest } from '@/utils/requestHandler'

export const GET = async (): Promise<NextResponse> =>
	handleRequest('/auth/cookies/clear-auth-cookies', 'get', undefined, {
		skipRefresh: true,
	})

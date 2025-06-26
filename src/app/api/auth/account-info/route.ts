import { NextResponse } from 'next/server'

import { handleRequest } from '@/api/requestHandler'

export const GET = async (): Promise<NextResponse> =>
	handleRequest('/auth/account-info', 'get')

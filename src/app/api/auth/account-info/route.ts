import { NextResponse } from 'next/server'

import { handleRequest } from '@/services/requestHandler'

export const GET = async (): Promise<NextResponse> =>
	handleRequest('/auth/account-info', 'get')

import { NextResponse } from 'next/server'

import { handleRequest } from '@/api/Axios'

export const GET = async (): Promise<NextResponse> =>
	handleRequest('/auth/resend-verification-email', 'get')

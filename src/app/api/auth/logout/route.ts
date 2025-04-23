import { NextResponse } from 'next/server'
import RequestHandler from '@/utils/RequestHandler'

export const GET = async (): Promise<NextResponse> =>
	RequestHandler.request('/auth/logout', 'get')

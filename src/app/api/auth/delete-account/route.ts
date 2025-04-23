import { NextResponse } from 'next/server'
import RequestHandler from '@/utils/RequestHandler'

export const DELETE = async (): Promise<NextResponse> =>
	RequestHandler.request('/auth/delete-account', 'delete')

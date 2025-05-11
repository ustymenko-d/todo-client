import { NextResponse } from 'next/server'
import { handleRequest } from '@/services/requestHandler'

export const DELETE = async (): Promise<NextResponse> =>
	handleRequest('/auth/delete-account', 'delete')

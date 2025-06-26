import { NextResponse } from 'next/server'

import { handleRequest } from '@/api/requestHandler'

export const DELETE = async (): Promise<NextResponse> =>
	handleRequest('/auth/delete-account', 'delete')

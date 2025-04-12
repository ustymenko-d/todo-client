import { IResponseStatus } from '@/types/common'
import RequestHandler from '@/utils/RequestHandler'
import { NextResponse } from 'next/server'

export async function DELETE(): Promise<NextResponse> {
	return RequestHandler.routeRequest<IResponseStatus>(
		'/auth/delete-account',
		'delete'
	)
}

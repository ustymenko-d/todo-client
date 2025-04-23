import { NextRequest } from 'next/server'

const getIdFromRequest = (
	request: NextRequest,
	segment: string
): string | null => {
	const pathname = request.nextUrl.pathname
	const regex = new RegExp(`/api/${segment}/([^/]+)`)
	const match = pathname.match(regex)
	return match ? match[1] : null
}

export default getIdFromRequest

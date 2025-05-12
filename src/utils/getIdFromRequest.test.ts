import { NextRequest } from 'next/server'
import getIdFromRequest from './getIdFromRequest'

const createMockRequest = (pathname: string): NextRequest => {
	return {
		nextUrl: {
			pathname,
		},
	} as unknown as NextRequest
}

describe('getIdFromRequest', () => {
	it('should extract ID from valid API path', () => {
		const req = createMockRequest('/api/tasks/abc123')
		expect(getIdFromRequest(req, 'tasks')).toBe('abc123')
	})

	it('should extract ID from another segment', () => {
		const req = createMockRequest('/api/folders/123')
		expect(getIdFromRequest(req, 'folders')).toBe('123')
	})

	it('should return null if path does not match', () => {
		const req = createMockRequest('/api/other/123')
		expect(getIdFromRequest(req, 'tasks')).toBeNull()
	})

	it('should return null if segment exists but no ID', () => {
		const req = createMockRequest('/api/tasks/')
		expect(getIdFromRequest(req, 'tasks')).toBeNull()
	})

	it('should not match similar segments', () => {
		const req = createMockRequest('/api/tasks/123')
		expect(getIdFromRequest(req, 'task')).toBeNull()
	})
})

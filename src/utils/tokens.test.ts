import { jwtDecode } from 'jwt-decode'

import { getTokens, verifyToken } from './tokens'

jest.mock('jwt-decode')

type CookieObject = { value: string }

interface CookieStore {
	get(name: string): CookieObject | undefined
}

const makeCookieStore = (values: Record<string, string | undefined>): CookieStore => ({
	get(key: string) {
		return values[key] !== undefined ? { value: values[key] } : undefined
	},
})

describe('getTokens', () => {
	it('returns all tokens when they exist', () => {
		const cookies = makeCookieStore({
			accessToken: 'a.token',
			refreshToken: 'r.token',
			refreshed: 'true',
		}) as Parameters<typeof getTokens>[0]

		expect(getTokens(cookies)).toEqual({
			accessToken: 'a.token',
			refreshToken: 'r.token',
			rememberMe: true,
		})
	})

	it('returns undefined fields when a cookie is missing', () => {
		const cookies = makeCookieStore({
			accessToken: undefined,
			refreshToken: 'r.token',
			refreshed: 'false',
		}) as Parameters<typeof getTokens>[0]

		const { accessToken, refreshToken, rememberMe } = getTokens(cookies)
		expect(accessToken).toBeUndefined()
		expect(refreshToken).toBe('r.token')
		expect(rememberMe).toBe(false)
	})
})

describe('verifyToken', () => {
	const mockDecode = jwtDecode as jest.MockedFunction<typeof jwtDecode>

	beforeEach(() => jest.restoreAllMocks())

	it('returns false if no token is provided', () => {
		expect(verifyToken()).toBe(false)
	})

	it('returns false for invalid token (jwtDecode throws)', () => {
		mockDecode.mockImplementation(() => {
			throw new Error('bad')
		})
		expect(verifyToken('bad.token')).toBe(false)
		expect(mockDecode).toHaveBeenCalledWith('bad.token')
	})

	it('returns false if the token is expired', () => {
		mockDecode.mockReturnValue({ exp: 1 })
		expect(verifyToken('old.token')).toBe(false)
		expect(mockDecode).toHaveBeenCalledWith('old.token')
	})

	it('returns true if the token is still valid', () => {
		const nowSec = Math.floor(Date.now() / 1000)
		mockDecode.mockReturnValue({ exp: nowSec + 3600 })
		expect(verifyToken('good.token')).toBe(true)
		expect(mockDecode).toHaveBeenCalledWith('good.token')
	})
})

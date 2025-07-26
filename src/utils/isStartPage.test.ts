import isStartPage from './isStartPage'

describe('isStartPage', () => {
	it('should return true for valid value', () => {
		expect(isStartPage('/')).toBe(true)
		expect(isStartPage('/auth')).toBe(true)
		expect(isStartPage('/auth/reset-password')).toBe(true)
		expect(isStartPage('/verification')).toBe(true)
	})

	it('should return false for unknown paths', () => {
		expect(isStartPage('/dashboard')).toBe(false)
		expect(isStartPage('/login')).toBe(false)
		expect(isStartPage('/auth/reset')).toBe(false)
	})

	it('should be case-sensitive', () => {
		expect(isStartPage('/AUTH')).toBe(false)
		expect(isStartPage('/Verification')).toBe(false)
	})
})

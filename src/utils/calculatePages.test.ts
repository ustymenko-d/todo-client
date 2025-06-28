import calculatePages from './calculatePages'

describe('calculatePages', () => {
	it('returns 1 when total is 5 and default limit', () => {
		expect(calculatePages(5)).toBe(1)
	})

	it('returns 2 when total is 15 and limit is 10', () => {
		expect(calculatePages(15)).toBe(2)
	})

	it('returns 3 when total is 21 and limit is 10', () => {
		expect(calculatePages(21)).toBe(3)
	})

	it('returns 0 when total is 0', () => {
		expect(calculatePages(0)).toBe(0)
	})

	it('works with custom limit: total = 30, limit = 7', () => {
		expect(calculatePages(30, 7)).toBe(5)
	})

	it('throws an error when limit is 0', () => {
		expect(() => calculatePages(10, 0)).toThrow()
	})

	it('throws an error when total is negative', () => {
		expect(() => calculatePages(-5, 10)).toThrow()
	})

	it('throws an error when negative limit', () => {
		expect(() => calculatePages(10, -5)).toThrow()
	})
})

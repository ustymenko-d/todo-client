import { cn } from './utils'

describe('cn', () => {
	it('merges tailwind classes correctly', () => {
		const result = cn('p-2', 'p-4')
		expect(result).toBe('p-4')
	})

	it('joins multiple class values', () => {
		const result = cn('text-red-500', false && 'hidden', 'bg-white')
		expect(result).toBe('text-red-500 bg-white')
	})

	it('filters out falsy values', () => {
		const result = cn(
			'block',
			null,
			undefined,
			'',
			false,
			0 && 'zero',
			'text-lg'
		)
		expect(result).toBe('block text-lg')
	})

	it('handles conditional classes', () => {
		const isActive = true
		const result = cn('btn', isActive && 'btn-active')
		expect(result).toBe('btn btn-active')
	})

	it('handles arrays of class names', () => {
		const result = cn(['p-2', 'm-4'], 'rounded')
		expect(result).toBe('p-2 m-4 rounded')
	})

	it('handles objects of class names', () => {
		const result = cn({ 'p-2': true, 'm-4': false }, 'rounded')
		expect(result).toBe('p-2 rounded')
	})
})

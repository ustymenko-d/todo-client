import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import React from 'react'

import { formatDate, formatValue, stringToBoolean } from './formatting'

type Props = { children: React.ReactNode }

jest.mock('@/components/ui/tooltip', () => {
	const Mock = ({ children }: Props) => <>{children}</>
	return {
		Tooltip: Mock,
		TooltipTrigger: Mock,
		TooltipContent: Mock,
		TooltipProvider: Mock,
	}
})

describe('formatValue', () => {
	it('renders "-" if value is null or undefined', () => {
		expect(formatValue(null)).toBe('-')
		expect(formatValue(undefined)).toBe('-')
	})

	it('returns short text wrapped in <p>', () => {
		const shortText: string = 'Short text'
		const { container } = render(<>{formatValue(shortText)}</>)
		expect(container.querySelector('p')).toHaveTextContent(shortText)
	})

	it('returns tooltip for long values', () => {
		const longText: string = 'A'.repeat(40)
		render(<>{formatValue(longText)}</>)

		expect(screen.getByText(/A{30}…/)).toBeInTheDocument()
		expect(screen.getByText(longText)).toBeInTheDocument()
	})
})

describe('formatDate', () => {
	it('returns "-" if date is null or undefined', () => {
		expect(formatDate(null)).toBe('-')
		expect(formatDate(undefined)).toBe('-')
	})

	it('formats date string correctly', () => {
		const date = new Date('2023-01-01T12:30:00')
		const formatted = formatDate(date)

		expect(typeof formatted).toBe('string')
		expect(formatted.length).toBeGreaterThan(0)
		expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4},? \d{2}:\d{2}/)
	})
})

describe('stringToBoolean', () => {
	it('returns true for "true" (any case, trimmed)', () => {
		expect(stringToBoolean('true')).toBe(true)
		expect(stringToBoolean(' True ')).toBe(true)
		expect(stringToBoolean('TRUE')).toBe(true)
	})

	it('returns false for any non-true value', () => {
		expect(stringToBoolean('false')).toBe(false)
		expect(stringToBoolean('')).toBe(false)
		expect(stringToBoolean('yes')).toBe(false)
	})
})

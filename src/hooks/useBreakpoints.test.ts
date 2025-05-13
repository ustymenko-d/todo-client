import { act, renderHook } from '@testing-library/react'
import useBreakpoints from './useBreakpoints'

describe('useBreakpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('should return index 0 for screen width < first breakpoint', () => {
		const breakpoints = [320]
		global.innerWidth = 319
		const { result } = renderHook(() => useBreakpoints(breakpoints))

		act(() => {
			window.dispatchEvent(new Event('resize'))
		})

		expect(result.current).toBe(0)
	})

	it('should return index 1 for screen width === first breakpoint', () => {
		const breakpoints = [320]
		global.innerWidth = 320
		const { result } = renderHook(() => useBreakpoints(breakpoints))

		act(() => {
			window.dispatchEvent(new Event('resize'))
		})

		expect(result.current).toBe(1)
	})

	it('should return index 1 for screen width > first breakpoint', () => {
		const breakpoints = [320]
		global.innerWidth = 321
		const { result } = renderHook(() => useBreakpoints(breakpoints))

		act(() => {
			window.dispatchEvent(new Event('resize'))
		})

		expect(result.current).toBe(1)
	})

	it('should return index 1 for (first breakpoint < screen width < second breakpoint)', () => {
		const breakpoints = [320, 400]
		global.innerWidth = 350
		const { result } = renderHook(() => useBreakpoints(breakpoints))

		act(() => {
			window.dispatchEvent(new Event('resize'))
		})

		expect(result.current).toBe(1)
	})

	it('should return index 2 for screen width === second breakpoint', () => {
		const breakpoints = [320, 400]
		global.innerWidth = 400
		const { result } = renderHook(() => useBreakpoints(breakpoints))

		act(() => {
			window.dispatchEvent(new Event('resize'))
		})

		expect(result.current).toBe(2)
	})

	it('should debounce resize event and update index', () => {
		jest.useFakeTimers()

		const breakpoints = [320, 400]
		global.innerWidth = 300
		const { result } = renderHook(() => useBreakpoints(breakpoints))

		expect(result.current).toBe(0)

		act(() => {
			global.innerWidth = 350
			window.dispatchEvent(new Event('resize'))
			jest.advanceTimersByTime(100)
		})

		expect(result.current).toBe(0)

		act(() => {
			jest.advanceTimersByTime(50)
		})

		expect(result.current).toBe(1)

		jest.useRealTimers()
	})
})

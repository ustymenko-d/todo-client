import { act, renderHook } from '@testing-library/react'

import useBreakpoints from './useBreakpoints'

jest.mock('lodash.debounce', () => {
	return (fn: (...args: unknown[]) => unknown) => {
		const debounced = (...args: unknown[]) => fn(...args)
		debounced.cancel = jest.fn()
		return debounced
	}
})

describe('useBreakpoints', () => {
	let originalInnerWidth: number
	let originalInnerHeight: number

	beforeEach(() => {
		originalInnerWidth = window.innerWidth
		originalInnerHeight = window.innerHeight
	})

	afterEach(() => {
		Object.defineProperty(window, 'innerWidth', {
			writable: true,
			configurable: true,
			value: originalInnerWidth,
		})
		Object.defineProperty(window, 'innerHeight', {
			writable: true,
			configurable: true,
			value: originalInnerHeight,
		})
	})

	const resizeWindow = (width: number, height: number) => {
		Object.defineProperty(window, 'innerWidth', {
			writable: true,
			configurable: true,
			value: width,
		})
		Object.defineProperty(window, 'innerHeight', {
			writable: true,
			configurable: true,
			value: height,
		})

		window.dispatchEvent(new Event('resize'))
	}

	it('should return initial indices based on window size', () => {
		resizeWindow(800, 600)

		const { result } = renderHook(() =>
			useBreakpoints({ width: [500, 1000], height: [400, 700] })
		)

		expect(result.current.widthIndex).toBe(1)
		expect(result.current.heightIndex).toBe(1)
	})

	it('should update indices on window resize', () => {
		resizeWindow(400, 300)

		const { result } = renderHook(() =>
			useBreakpoints({ width: [500, 1000], height: [400, 700] })
		)

		expect(result.current.widthIndex).toBe(0)
		expect(result.current.heightIndex).toBe(0)

		act(() => {
			resizeWindow(1100, 800)
		})

		expect(result.current.widthIndex).toBe(2)
		expect(result.current.heightIndex).toBe(2)
	})

	it('should return 0 indices when breakpoints are empty', () => {
		resizeWindow(1000, 1000)

		const { result } = renderHook(() =>
			useBreakpoints({ width: [], height: [] })
		)

		expect(result.current.widthIndex).toBe(0)
		expect(result.current.heightIndex).toBe(0)
	})
})

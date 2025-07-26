import { act, renderHook } from '@testing-library/react'

import useIsTouchDevice from './useIsTouchDevice'

type MockMediaQueryList = Partial<MediaQueryList> & {
	listeners: Set<(e: MediaQueryListEvent) => void>
	dispatchChange: (matches: boolean) => void
}

function createMockMediaQueryList(initial: boolean): MockMediaQueryList {
	let _matches = initial
	const listeners = new Set<(e: MediaQueryListEvent) => void>()

	const mql: MockMediaQueryList = {
		get matches() {
			return _matches
		},
		media: '(pointer: coarse)',
		onchange: null,
		addEventListener(event: string, handler: EventListenerOrEventListenerObject) {
			listeners.add(handler as (e: MediaQueryListEvent) => void)
		},
		removeEventListener(event: string, handler: EventListenerOrEventListenerObject) {
			listeners.delete(handler as (e: MediaQueryListEvent) => void)
		},
		dispatchChange(matches: boolean) {
			_matches = matches
			const event = { matches } as MediaQueryListEvent
			listeners.forEach(handler => handler(event))
		},
		listeners,
	}
	return mql
}

describe('useIsTouchDevice', () => {
	let originalMatchMedia: typeof window.matchMedia
	let mql: MockMediaQueryList

	beforeEach(() => {
		originalMatchMedia = window.matchMedia
	})

	afterEach(() => {
		window.matchMedia = originalMatchMedia
	})

	it('should initialize as false when pointer is not coarse', () => {
		mql = createMockMediaQueryList(false)
		window.matchMedia = jest.fn().mockReturnValue(mql as MediaQueryList)

		const { result } = renderHook(() => useIsTouchDevice())
		expect(result.current).toBe(false)
	})

	it('should initialize as true when pointer is coarse', () => {
		mql = createMockMediaQueryList(true)
		window.matchMedia = jest.fn().mockReturnValue(mql as MediaQueryList)

		const { result } = renderHook(() => useIsTouchDevice())
		expect(result.current).toBe(true)
	})

	it('should update value when media query changes', () => {
		mql = createMockMediaQueryList(false)
		window.matchMedia = jest.fn().mockReturnValue(mql as MediaQueryList)

		const { result } = renderHook(() => useIsTouchDevice())
		expect(result.current).toBe(false)

		act(() => {
			mql.dispatchChange(true)
		})
		expect(result.current).toBe(true)

		act(() => {
			mql.dispatchChange(false)
		})
		expect(result.current).toBe(false)
	})

	it('should remove listener on unmount', () => {
		mql = createMockMediaQueryList(false)
		window.matchMedia = jest.fn().mockReturnValue(mql as MediaQueryList)

		const { unmount } = renderHook(() => useIsTouchDevice())
		expect(mql.listeners.size).toBe(1)

		unmount()
		expect(mql.listeners.size).toBe(0)
	})
})

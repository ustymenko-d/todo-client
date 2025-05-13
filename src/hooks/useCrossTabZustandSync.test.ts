import { act, renderHook } from '@testing-library/react'
import useAppStore from '@/store/store'
import { useCrossTabZustandSync } from './useCrossTabZustandSync'

describe('useCrossTabZustandSync', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		localStorage.clear()
	})

	it('should not update state if storage event key is not "app-store"', () => {
		const setStateMock = jest.spyOn(useAppStore, 'setState')
		renderHook(() => useCrossTabZustandSync())

		act(() => {
			window.dispatchEvent(
				new StorageEvent('storage', {
					key: 'other-key',
					newValue: JSON.stringify({ state: { accountInfo: {} } }),
				})
			)
		})

		expect(setStateMock).not.toHaveBeenCalled()
	})

	it('should handle invalid JSON gracefully', () => {
		const setStateMock = jest.spyOn(useAppStore, 'setState')
		const consoleErrorMock = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {})

		renderHook(() => useCrossTabZustandSync())

		act(() => {
			window.dispatchEvent(
				new StorageEvent('storage', {
					key: 'app-store',
					newValue: 'invalid-json',
				})
			)
		})

		expect(consoleErrorMock).toHaveBeenCalledWith(
			'[CrossTabSync] Failed to parse state:',
			expect.any(SyntaxError)
		)
		expect(setStateMock).not.toHaveBeenCalled()

		consoleErrorMock.mockRestore()
	})

	it('should update state if incoming state is different', () => {
		const setStateMock = jest.spyOn(useAppStore, 'setState')
		renderHook(() => useCrossTabZustandSync())

		act(() => {
			window.dispatchEvent(
				new StorageEvent('storage', {
					key: 'app-store',
					newValue: JSON.stringify({
						state: {
							accountInfo: {
								id: '123',
								email: 'username@email.com',
								username: 'username',
								createdAt: new Date().toISOString(),
								isVerified: true,
								folders: [],
							},
							foldersWithTasks: [],
						},
					}),
				})
			)
		})

		expect(setStateMock).toHaveBeenCalled()
	})
})

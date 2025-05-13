import { act, renderHook } from '@testing-library/react'
import { useFolderSocket } from '@/hooks/useFolderSocket'
import { getSocket } from '@/lib/socket'
import useAppStore from '@/store/store'

jest.mock('@/lib/socket', () => ({
	getSocket: jest.fn(),
}))

jest.mock('@/store/store', () => ({
	__esModule: true,
	default: jest.fn(),
}))

describe('useFolderSocket', () => {
	let mockOn: jest.Mock
	let mockOff: jest.Mock
	let setFoldersWithTasks: jest.Mock
	let setAccountInfo: jest.Mock

	const folder = { id: '1', name: 'New Folder' }

	beforeEach(() => {
		mockOn = jest.fn()
		mockOff = jest.fn()

		// @ts-expect-error: Mocking the return value of getSocket for testing purposes
		getSocket.mockReturnValue({
			on: mockOn,
			off: mockOff,
		})

		setFoldersWithTasks = jest.fn()
		setAccountInfo = jest.fn()

		// @ts-expect-error: Mocking the implementation of useAppStore for testing purposes
		useAppStore.mockImplementation((selector) => {
			if (selector.toString().includes('setFoldersWithTasks')) {
				return setFoldersWithTasks
			}
			if (selector.toString().includes('setAccountInfo')) {
				return setAccountInfo
			}
		})
	})

	it('should register socket events on mount', () => {
		renderHook(() => useFolderSocket())

		expect(mockOn).toHaveBeenCalledWith('folder:created', expect.any(Function))
		expect(mockOn).toHaveBeenCalledWith('folder:renamed', expect.any(Function))
		expect(mockOn).toHaveBeenCalledWith('folder:deleted', expect.any(Function))
	})

	it('should unregister socket events on unmount', () => {
		const { unmount } = renderHook(() => useFolderSocket())

		unmount()

		expect(mockOff).toHaveBeenCalledWith('folder:created', expect.any(Function))
		expect(mockOff).toHaveBeenCalledWith('folder:renamed', expect.any(Function))
		expect(mockOff).toHaveBeenCalledWith('folder:deleted', expect.any(Function))
	})

	it('should handle folder:created event', () => {
		renderHook(() => useFolderSocket())

		const createdHandler = mockOn.mock.calls.find(
			([event]) => event === 'folder:created'
		)[1]

		act(() => {
			createdHandler(folder)
		})

		expect(setAccountInfo).toHaveBeenCalledWith(expect.any(Function))
	})

	it('should handle folder:renamed event', () => {
		renderHook(() => useFolderSocket())

		const renamedHandler = mockOn.mock.calls.find(
			([event]) => event === 'folder:renamed'
		)[1]

		act(() => {
			renamedHandler(folder)
		})

		expect(setAccountInfo).toHaveBeenCalledWith(expect.any(Function))
		expect(setFoldersWithTasks).toHaveBeenCalledWith(expect.any(Function))
	})

	it('should handle folder:deleted event', () => {
		renderHook(() => useFolderSocket())

		const deletedHandler = mockOn.mock.calls.find(
			([event]) => event === 'folder:deleted'
		)[1]

		act(() => {
			deletedHandler(folder)
		})

		expect(setAccountInfo).toHaveBeenCalledWith(expect.any(Function))
		expect(setFoldersWithTasks).toHaveBeenCalledWith(expect.any(Function))
	})
})

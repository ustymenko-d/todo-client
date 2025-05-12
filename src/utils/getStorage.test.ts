import getStorage from "./getStorage"

describe('getStorage', () => {
	const originalWindow = global.window

	afterEach(() => {
		global.window = originalWindow
	})

	it('should return mock storage in server environment', () => {
		// @ts-expect-error simulate server-side by deleting window
		delete global.window

		const storage = getStorage()

		expect(storage.getItem('key')).toBeNull()
		expect(() => storage.setItem('key', 'value')).not.toThrow()
		expect(() => storage.removeItem('key')).not.toThrow()
	})

	it('should return window.localStorage in client environment', () => {
		const mockLocalStorage = {
			getItem: jest.fn(() => 'value'),
			setItem: jest.fn(),
			removeItem: jest.fn(),
		}

		// @ts-expect-error simulate window object with localStorage
		global.window = { localStorage: mockLocalStorage }

		const storage = getStorage()

		storage.setItem('key', 'value')
		expect(mockLocalStorage.setItem).toHaveBeenCalledWith('key', 'value')

		storage.getItem('key')
		expect(mockLocalStorage.getItem).toHaveBeenCalledWith('key')

		storage.removeItem('key')
		expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('key')
	})
})

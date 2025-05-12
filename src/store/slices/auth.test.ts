import createAuthSlice from './auth'
import { IUserInfo, TAuthForm } from '@/types/auth'

describe('AuthSlice', () => {
	let mockSet: jest.Mock
	let authSlice: ReturnType<typeof createAuthSlice>

	const mockUser: IUserInfo = {
		id: '123',
		email: 'user@example.com',
		username: 'user123',
		createdAt: new Date('2023-01-01'),
		isVerified: false,
		folders: [],
	}

	beforeEach(() => {
		mockSet = jest.fn()
		authSlice = createAuthSlice(mockSet)
	})

	it.each([true, false])('should set authHydrated', (value) => {
		authSlice.setAuthHydrated(value)
		expect(mockSet).toHaveBeenCalledWith({ authHydrated: value })
	})

	it('should set accountInfo directly', () => {
		authSlice.setAccountInfo(mockUser)
		const setFn = mockSet.mock.calls[0][0]
		expect(setFn({ accountInfo: null })).toEqual({ accountInfo: mockUser })
	})

	it('should update accountInfo using an updater function', () => {
		const updater = (prev: IUserInfo | null) =>
			prev ? { ...prev, isVerified: true } : null

		authSlice.setAccountInfo(updater)
		const setFn = mockSet.mock.calls[0][0]
		expect(setFn({ accountInfo: mockUser })).toEqual({
			accountInfo: { ...mockUser, isVerified: true },
		})
	})

	it.each<TAuthForm>(['signin', 'signup', 'forgotPassword'])(
		'should set authFormType',
		(type) => {
			authSlice.setAuthFormType(type)
			expect(mockSet).toHaveBeenCalledWith({ authFormType: type })
		}
	)
})

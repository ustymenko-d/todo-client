import { TAuthForm } from '@/types/auth'

import createAuthSlice, { AuthSlice } from './auth'

describe('AuthSlice', () => {
	let mockSet: jest.Mock
	let authSlice: AuthSlice

	beforeEach(() => {
		mockSet = jest.fn()
		authSlice = createAuthSlice(mockSet)
	})

	it('initializes isAuthorized as false', () => {
		expect(authSlice.isAuthorized).toBe(false)
	})

	it('initializes authFormType as "signin"', () => {
		expect(authSlice.authFormType).toBe('signin')
	})

	describe('setIsAuthorized', () => {
		test.each([[true], [false]])('sets isAuthorized to %s', (newValue: boolean) => {
			authSlice.setIsAuthorized(newValue)
			expect(mockSet).toHaveBeenCalledWith({ isAuthorized: newValue })
		})
	})

	describe('setAuthFormType', () => {
		const formTypes: TAuthForm[] = ['signin', 'signup', 'forgotPassword']

		test.each(formTypes)('sets authFormType to %s', newType => {
			authSlice.setAuthFormType(newType)
			expect(mockSet).toHaveBeenCalledWith({ authFormType: newType })
		})
	})
})

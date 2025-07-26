import { renderHook } from '@testing-library/react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import { IRecaptcha } from '@/types/common'

import { useWithRecaptcha } from './useWithRecaptcha'

jest.mock('react-google-recaptcha-v3')

describe('useWithRecaptcha', () => {
	const mockExecute = jest.fn()
	const action = 'action'

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('throws if executeRecaptcha is not ready', async () => {
		;(useGoogleReCaptcha as jest.Mock).mockReturnValue({
			executeRecaptcha: undefined,
		})

		const { result } = renderHook(() => useWithRecaptcha(action))

		await expect(result.current.withRecaptcha({ foo: 'bar' })).rejects.toThrow(
			'reCAPTCHA not ready'
		)
	})

	it('calls executeRecaptcha and add token to payload', async () => {
		const fakeToken = 'token'

		mockExecute.mockResolvedValueOnce(fakeToken)
		;(useGoogleReCaptcha as jest.Mock).mockReturnValue({
			executeRecaptcha: mockExecute,
		})

		const { result } = renderHook(() => useWithRecaptcha(action))
		const inputPayload = { foo: 'bar' }

		type Output = typeof inputPayload & IRecaptcha

		const output: Output = await result.current.withRecaptcha(inputPayload)

		expect(mockExecute).toHaveBeenCalledWith(action)
		expect(output).toEqual({ foo: 'bar', recaptchaToken: fakeToken })
	})
})

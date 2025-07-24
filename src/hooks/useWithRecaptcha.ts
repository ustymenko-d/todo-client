'use client'

import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import { IRecaptcha } from '@/types/common'

export const useWithRecaptcha = () => {
	const { executeRecaptcha } = useGoogleReCaptcha()

	const withRecaptcha = async <T>(payload: T): Promise<T & IRecaptcha> => {
		if (!executeRecaptcha) throw new Error('reCAPTCHA not ready')
		const recaptchaToken = await executeRecaptcha('auth')
		return { ...payload, recaptchaToken }
	}

	return { withRecaptcha }
}

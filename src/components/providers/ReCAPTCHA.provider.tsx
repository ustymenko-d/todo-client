'use client'

import { ReactNode } from 'react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

const ReCAPTCHAProvider = ({ children }: { children: ReactNode }) => (
	<GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}>
		{children}
	</GoogleReCaptchaProvider>
)

export default ReCAPTCHAProvider

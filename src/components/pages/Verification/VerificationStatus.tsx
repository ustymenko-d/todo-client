'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import AuthAPI from '@/api/auth.api'
import { CardDescription } from '@/components/ui/card'
import { IResponseStatus } from '@/types/common'

const REDIRECT_DELAY = 15000
const INITIAL_SECONDS = REDIRECT_DELAY / 1000
const messages = {
	verifying: 'Verifying…',
	success: 'Email successfully verified',
	failure: 'Verification failed',
}

const VerificationStatus = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const verificationToken = searchParams.get('verificationToken')

	const [isVerifying, setIsVerifying] = useState(false)
	const [verificationResult, setVerificationResult] =
		useState<IResponseStatus | null>(null)
	const [secondsRemaining, setSecondsRemaining] = useState(INITIAL_SECONDS)

	const handleVerification = useCallback(async () => {
		if (!verificationToken) return

		setIsVerifying(true)

		try {
			setVerificationResult(await AuthAPI.verifyEmail(verificationToken))
		} finally {
			setIsVerifying(false)
		}
	}, [verificationToken])

	useEffect(() => {
		handleVerification()
	}, [handleVerification])

	useEffect(() => {
		if (verificationResult?.success) {
			setSecondsRemaining(INITIAL_SECONDS)

			const countdown = setInterval(() => {
				setSecondsRemaining((prev) => Math.max(prev - 1, 0))
			}, 1000)

			const redirectTimeout = setTimeout(() => {
				router.push('/')
			}, REDIRECT_DELAY)

			return () => {
				clearTimeout(redirectTimeout)
				clearInterval(countdown)
			}
		}
	}, [verificationResult, router])

	const statusMessage = isVerifying
		? messages.verifying
		: verificationResult?.success
		? messages.success
		: messages.failure

	return (
		<CardDescription>
			{statusMessage}
			<br />
			{verificationResult?.success && (
				<>
					Redirecting to the home page in&nbsp;
					<strong>
						{secondsRemaining}&nbsp;second{secondsRemaining !== 1 && 's'}
					</strong>
					.
				</>
			)}
		</CardDescription>
	)
}

export default VerificationStatus

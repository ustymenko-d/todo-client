'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import AuthAPI from '@/api/auth.api'
import { CardDescription } from '@/components/ui/card'
import { IResponseStatus } from '@/types/common'

const REDIRECT_DELAY = 15000
const INITIAL_SECONDS = REDIRECT_DELAY / 1000

const VerificationStatus = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const verificationToken = searchParams.get('verificationToken')

	const [verificationResult, setVerificationResult] =
		useState<IResponseStatus | null>(null)
	const [secondsRemaining, setSecondsRemaining] = useState(INITIAL_SECONDS)

	const handleVerification = async (token: string) => {
		setVerificationResult(await AuthAPI.verifyEmail(token))
	}

	useEffect(() => {
		if (verificationToken) handleVerification(verificationToken)
	}, [verificationToken])

	useEffect(() => {
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
	}, [router])

	const statusMessage =
		verificationResult === null
			? 'Verifying…'
			: verificationResult.success
			? 'Email successfully verified'
			: 'Verification failed'

	return (
		<CardDescription>
			{statusMessage}
			<br />
			Redirecting to the home page in&nbsp;
			<strong>
				{secondsRemaining}&nbsp;second{secondsRemaining !== 1 && 's'}
			</strong>
			.
		</CardDescription>
	)
}

export default VerificationStatus

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import AuthAPI from '@/api/auth.api'
import { CardDescription } from '@/components/ui/card'
import { IResponseStatus } from '@/types/common'

const REDIRECT_DELAY = 15000

const VerificationStatus = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const verificationToken = searchParams.get('verificationToken')
	const [verify, setVerify] = useState<IResponseStatus | null>(null)

	const [secondsRemaining, setSecondsRemaining] = useState(
		REDIRECT_DELAY / 1000
	)

	useEffect(() => {
		const verify = async () => {
			if (verificationToken)
				setVerify(await AuthAPI.verifyEmail(verificationToken))
		}

		verify()
	}, [verificationToken])

	useEffect(() => {
		const interval = setInterval(() => {
			setSecondsRemaining((prev) => Math.max(prev - 1, 0))
		}, 1000)

		const timeout = setTimeout(() => {
			router.push('/')
		}, REDIRECT_DELAY)

		return () => {
			clearTimeout(timeout)
			clearInterval(interval)
		}
	}, [verify, router])

	return (
		<CardDescription>
			{verify?.success ? 'Verified' : 'Failed'}
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

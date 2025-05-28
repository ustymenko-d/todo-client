'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { CardDescription } from '@/components/ui/card'
import useAccountInfo from '@/hooks/useAccountInfo'

const REDIRECT_DELAY = 15000

const VerificationStatus = ({ message }: { message: string }) => {
	const router = useRouter()
	const { data } = useAccountInfo()
	const [secondsRemaining, setSecondsRemaining] = useState(
		REDIRECT_DELAY / 1000
	)

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
	}, [data?.isVerified, router])

	return (
		<CardDescription>
			{data?.isVerified ? 'Your email has been verified.' : message}
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

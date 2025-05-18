'use client'

import { CardDescription } from '@/components/ui/card'
import useAppStore from '@/store/store'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const REDIRECT_DELAY = 15 * 1000

const VerificationStatus = ({ message }: { message: string }) => {
	const router = useRouter()
	const accountInfo = useAppStore((state) => state.accountInfo)
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
	}, [accountInfo?.isVerified, router])

	return (
		<CardDescription className='text-base'>
			{accountInfo?.isVerified ? 'Your email has been verified.' : message}
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

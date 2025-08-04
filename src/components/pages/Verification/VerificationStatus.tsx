'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import AuthAPI from '@/api/auth.api'
import { CardDescription } from '@/components/ui/card'
import { TResponseState } from '@/types/common'

const REDIRECT_DELAY = 15000
const INITIAL_SECONDS = REDIRECT_DELAY / 1000
const messages = {
	default: undefined,
	pending: 'Verifying…',
	success: 'Email successfully verified',
	error: 'Verification failed',
}

const VerificationStatus = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const verificationToken = searchParams.get('verificationToken')

	const [status, setStatus] = useState<TResponseState>('default')
	const [secondsRemaining, setSecondsRemaining] = useState(INITIAL_SECONDS)

	useEffect(() => {
		const verify = async () => {
			if (!verificationToken) return

			try {
				setStatus('pending')
				const { success, message } = await AuthAPI.verifyEmail(verificationToken)

				if (!success) throw new Error(message ?? 'Error during verification')

				setStatus('success')
				toast.success(message)
			} catch (error) {
				setStatus('error')
				toast.error('Verification failed')
				console.error('Verification failed:', error)
			}
		}

		verify()
	}, [verificationToken])

	useEffect(() => {
		if (status === 'success') {
			setSecondsRemaining(INITIAL_SECONDS)

			const countdown = setInterval(() => {
				setSecondsRemaining(prev => Math.max(prev - 1, 0))
			}, 1000)

			const redirectTimeout = setTimeout(() => {
				router.push('/')
			}, REDIRECT_DELAY)

			return () => {
				clearTimeout(redirectTimeout)
				clearInterval(countdown)
			}
		}
	}, [status, router])

	return (
		<CardDescription>
			{status ? messages[status] : ''}
			<br />
			{status === 'success' && (
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

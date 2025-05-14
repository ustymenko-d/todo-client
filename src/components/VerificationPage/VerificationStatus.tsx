'use client'

import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import useAppStore from '@/store/store'
import { buttonVariants } from '../ui/button'
import Link from 'next/link'
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
		<Card className='sm:w-96'>
			<CardHeader className='text-center'>
				<CardTitle className='text-2xl font-bold'>
					Email verification status:
				</CardTitle>
				<CardDescription className='text-base'>
					{accountInfo?.isVerified ? 'Your email has been verified.' : message}
					<br />
					Redirecting to the home page in&nbsp;
					<strong>
						{secondsRemaining}&nbsp;second{secondsRemaining !== 1 && 's'}
					</strong>
					.
				</CardDescription>
			</CardHeader>

			<CardFooter>
				<Link
					href='/'
					className={cn(buttonVariants({ variant: 'default' }), 'w-full')}>
					Return Home
				</Link>
			</CardFooter>
		</Card>
	)
}

export default VerificationStatus

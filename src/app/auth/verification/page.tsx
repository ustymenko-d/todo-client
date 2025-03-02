'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { buttonVariants } from '@/components/ui/button'
import Loader from '@/components/ui/Loader'
import AuthService from '@/services/api/auth'
import { BadgeCheck, BadgeX } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

type ResponseStatus = 'pending' | 'success' | 'error'

const VerificationPage = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [loading, setLoading] = useState<boolean>(false)
	const [status, setStatus] = useState<ResponseStatus>('pending')

	const verifyEmail = useCallback(async () => {
		setLoading(true)
		try {
			const verificationToken = searchParams.get('verificationToken')
			if (!verificationToken) throw new Error('No verification token found')

			const response = await AuthService.verifyEmail(
				`verificationToken=${verificationToken}`
			)

			setStatus(response.success ? 'success' : 'error')
			toast.success('Your account has been successfully verified!', {
				description:
					'You will be automatically redirected to the main page in 3 seconds.',
			})
		} catch (error) {
			setStatus('error')
			toast.error('Something went wrong!')
			console.error('Sign up error:', error)
		} finally {
			setLoading(false)
			setTimeout(() => {
				router.replace('/')
			}, 3000)
		}
	}, [router, searchParams])

	useEffect(() => {
		verifyEmail()
	}, [verifyEmail])

	if (loading || status === 'pending') return <Loader />

	return (
		<Alert className='max-w-3xl'>
			{status === 'success' ? (
				<BadgeCheck className='w-6 h-6' />
			) : (
				<BadgeX className='w-6 h-6' />
			)}
			<AlertTitle className='text-xl font-medium'>
				{status === 'success'
					? 'Thank you for verifying your account'
					: 'Something went wrong while verifying your account.'}
			</AlertTitle>
			<AlertDescription className='flex flex-wrap items-center justify-between text-base gap-y-1 gap-x-4'>
				<span>
					You will be automatically redirected to the main page in 3 seconds.
				</span>
				<Link
					className={buttonVariants({ variant: 'default' })}
					href='/'
					replace>
					Go to main page
				</Link>
			</AlertDescription>
		</Alert>
	)
}

export default VerificationPage

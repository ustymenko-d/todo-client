'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import AuthAPI from '@/api/auth.api'
import LoadingButton from '@/components/ui/LoadingButton'
import { Separator } from '@/components/ui/separator'
import UnverifiedInfo from '@/components/UnverifiedInfo'
import { TResponseState } from '@/types/common'

const Verification = () => {
	const [status, setStatus] = useState<TResponseState>('default')

	const handleResendVerification = async () => {
		try {
			setStatus('pending')
			const { success, message } = await AuthAPI.resendVerificationEmail()

			if (!success) throw new Error(message ?? 'Error during logout')

			setStatus('success')
			setTimeout(() => setStatus('default'), 3000)
			toast.success(message)
		} catch (error) {
			setStatus('error')
			console.error('Failed to resend verification email:', error)
		}
	}
	return (
		<>
			<h2 className='text-xl font-semibold'>Email verification</h2>
			<Separator />

			<UnverifiedInfo />

			<div className='flex flex-col items-start gap-1'>
				<p className='text-base'>Can&apos;t find the verification email?</p>

				<LoadingButton
					variant='outline'
					loading={status === 'pending'}
					disabled={status === 'success'}
					onClick={handleResendVerification}>
					Resend verification email
				</LoadingButton>
			</div>
		</>
	)
}

export default Verification

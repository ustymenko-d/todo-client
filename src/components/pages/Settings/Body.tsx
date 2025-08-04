'use client'

import { ReactNode } from 'react'

import Loader from '@/components/ui/Loader'
import VerificationBadge from '@/components/ui/VerificationBadge'
import useAccountInfo from '@/hooks/useAccountInfo'

import DeleteSection from './components/DeleteSection'
import ErrorPlaceholder from './components/ErrorPlaceholder'
import Verification from './components/Verification'

const Body = () => {
	const { data, isLoading, isError, refetch } = useAccountInfo()

	const handleRefetch = () => {
		if (isError) refetch()
	}

	const renderInfoRow = (label: string, children: ReactNode) => (
		<div className='flex flex-col'>
			<span className='text-muted-foreground'>{label}</span>
			{children}
		</div>
	)

	if (isLoading) return <Loader className='pt-4 text-lg' />

	if (isError) return <ErrorPlaceholder handleRefresh={handleRefetch} />

	return (
		<div className='flex flex-col gap-2 pt-4'>
			{renderInfoRow('Username:', <span>{data?.username}</span>)}
			{renderInfoRow(
				'Email:',
				<div className='flex items-center gap-2'>
					<span id='email'>{data?.email}</span>
					<VerificationBadge />
				</div>
			)}

			{!data?.isVerified && <Verification />}

			<DeleteSection />
		</div>
	)
}

export default Body

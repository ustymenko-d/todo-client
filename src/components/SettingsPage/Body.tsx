'use client'

import useAccountInfo from '@/hooks/useAccountInfo'

import Loader from '../ui/Loader'
import VerificationBadge from '../ui/VerificationBadge'
import DeleteSection from './components/DeleteSection'
import ErrorPlaceholder from './components/ErrorPlaceholder'
import UnverifiedInfo from './components/UnverifiedInfo'

const Body = () => {
	const { data, isLoading, isError, refetch } = useAccountInfo()

	const handleRefetch = () => {
		if (isError) refetch()
	}

	const renderInfoRow = (label: string, children: React.ReactNode) => (
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

			{!data?.isVerified && <UnverifiedInfo />}

			<DeleteSection />
		</div>
	)
}

export default Body

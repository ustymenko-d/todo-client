'use client'

import RefreshButton from '@/components/ui/RefreshButton'
import { Skeleton } from '@/components/ui/skeleton'
import VerificationBadge from '@/components/ui/VerificationBadge'
import useAccountInfo from '@/hooks/useAccountInfo'

const AccountInfo = () => {
	const { data, isLoading, isError, refetch } = useAccountInfo()

	const handleRefetch = () => {
		if (isError) refetch()
	}

	if (isLoading) {
		return (
			<div className='flex flex-col items-start gap-1'>
				<div className='flex items-center gap-1'>
					<Skeleton className='h-4 w-[80px]' />
					<Skeleton className='h-[20px] w-[20px] rounded-full' />
				</div>
				<Skeleton className='h-4 w-[150px]' />
			</div>
		)
	}

	if (isError) return <RefreshButton handleRefresh={handleRefetch} />

	return (
		<>
			<div className='flex items-center gap-2'>
				<span className='font-medium'>{data?.username}</span>
				<VerificationBadge />
			</div>
			<span className='text-sm font-light opacity-70'>{data?.email}</span>
		</>
	)
}

export default AccountInfo

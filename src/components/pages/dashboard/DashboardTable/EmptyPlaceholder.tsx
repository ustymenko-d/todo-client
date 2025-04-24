'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LoadingButton from '@/components/ui/LoadingButton'
import { toast } from 'sonner'

const EmptyPlaceholder = () => {
	const router = useRouter()
	const [loading, setLoading] = useState<boolean>(false)

	const handleRefresh = () => {
		try {
			setLoading(true)
			router.refresh()
		} catch {
			toast.error('Something went wrong!')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='mt-4 w-full min-h-40 flex flex-col gap-3 items-center justify-center border rounded-md'>
			<h2>Failed to upload tasks</h2>
			<LoadingButton
				loading={loading}
				variant='outline'
				onClick={handleRefresh}>
				Try again
			</LoadingButton>
		</div>
	)
}

export default EmptyPlaceholder

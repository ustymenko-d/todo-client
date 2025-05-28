import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import LoadingButton from '@/components/ui/LoadingButton'

const EmptyPlaceholder = () => {
	const router = useRouter()

	const [loading, setLoading] = useState(false)

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
		<div className='flex flex-col items-center justify-center w-full gap-3 mt-4 border rounded-md min-h-40'>
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

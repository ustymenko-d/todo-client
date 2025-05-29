import { RefreshCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

const ErrorPlaceholder = () => {
	const router = useRouter()
	const handleRefresh = () => router.refresh()

	return (
		<div className='flex flex-col items-center justify-center w-full gap-3 mt-4 border rounded-md min-h-40'>
			<h2>Something went wrong!</h2>
			<Button
				variant='outline'
				onClick={handleRefresh}>
				<RefreshCcw
					size={16}
					strokeWidth={1.25}
					className='opacity-60'
				/>
				Refresh
			</Button>
		</div>
	)
}

export default ErrorPlaceholder

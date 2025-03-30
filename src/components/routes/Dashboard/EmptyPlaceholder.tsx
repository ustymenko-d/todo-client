'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Button } from '../../ui/button'
import { RotateCcw } from 'lucide-react'

const baseUrl = '/dashboard?page=1&limit=25&topLayerTasks=true'

const EmptyPlaceholder = () => {
	const router = useRouter()
	const pathname = usePathname()

	const handleRefresh = () => {
		if (pathname === baseUrl) {
			router.refresh()
		} else {
			router.push(baseUrl)
		}
	}

	return (
		<div className='flex items-center justify-center my-4 duration-200 border rounded-md min-h-20 hover:bg-muted'>
			<Button
				variant={'outline'}
				onClick={handleRefresh}>
				<span>Try again</span>
				<RotateCcw
					size={18}
					strokeWidth={1.25}
				/>
			</Button>
		</div>
	)
}

export default EmptyPlaceholder

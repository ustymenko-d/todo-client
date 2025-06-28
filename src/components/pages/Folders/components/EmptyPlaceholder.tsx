'use client'

import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import useAppStore from '@/store/store'

const EmptyPlaceholder = () => {
	const openEditor = useAppStore((s) => s.openFolderEditor)

	const handleCreateFolder = () => openEditor('create', null)

	return (
		<div className='flex flex-col items-center justify-center w-full gap-3 mt-4 border rounded-md min-h-40'>
			<h2>You haven&apos;t created any folders yet</h2>
			<Button
				variant='outline'
				onClick={handleCreateFolder}>
				<Plus className='opacity-60' />
				Create folder
			</Button>
		</div>
	)
}

export default EmptyPlaceholder

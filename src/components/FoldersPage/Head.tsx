'use client'

import useAppStore from '@/store/store'
import PageHead from '@/components/PageHead'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

const Head = () => {
	const openEditor = useAppStore((state) => state.openFolderEditor)
	const folders = useAppStore((state) => state.foldersWithTasks)
	const hasFolders = folders.length > 0

	const handleOpenEditor = () => {
		openEditor('create', null)
	}

	return (
		<div className='flex flex-wrap items-end justify-between gap-x-4 gap-y-2'>
			<PageHead
				title='Manage and organize your folders'
				description='You can view the list of tasks contained in folders, edit them, and drag them between folders'
			/>

			{!!hasFolders && (
				<Button
					variant='outline'
					onClick={handleOpenEditor}>
					<Plus className='opacity-60' />
					Create folder
				</Button>
			)}
		</div>
	)
}

export default Head

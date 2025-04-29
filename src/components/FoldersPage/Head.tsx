'use client'

import { Button } from '@/components/ui/button'
import useAppStore from '@/store/store'
import { Plus } from 'lucide-react'

const Head = () => {
	const openEditor = useAppStore((state) => state.openFolderEditor)
	const accountInfo = useAppStore((state) => state.accountInfo)
	const hasFolders =
		accountInfo?.folders?.length && accountInfo?.folders?.length > 0

	return (
		<div className='flex flex-wrap gap-x-4 gap-y-2 justify-between items-end'>
			<div className='flex flex-col'>
				<h1 className='text-xl font-semibold tracking-tight'>
					Manage and organize your folders
				</h1>
				<p className='text-base text-muted-foreground'>
					Here&apos;s a list of your folders:
				</p>
			</div>

			{!!hasFolders && (
				<Button
					variant='outline'
					onClick={() => openEditor('create', null)}>
					<Plus className='opacity-60' />
					Create folder
				</Button>
			)}
		</div>
	)
}

export default Head

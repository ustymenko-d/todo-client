'use client'

import { Button } from '@/components/ui/button'
import useAppStore from '@/store/store'
import { Plus } from 'lucide-react'
import PageHead from '@/components/PageHead'

const Head = () => {
	const openEditor = useAppStore((state) => state.openFolderEditor)
	const accountInfo = useAppStore((state) => state.accountInfo)
	const hasFolders =
		accountInfo?.folders?.length && accountInfo?.folders?.length > 0

	return (
		<div className='flex flex-wrap items-end justify-between gap-x-4 gap-y-2'>
			<PageHead subject='folders' />

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

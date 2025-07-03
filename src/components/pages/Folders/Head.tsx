'use client'

import { Plus } from 'lucide-react'

import PageHead from '@/components/PageHead'
import { Button } from '@/components/ui/button'
import Loader from '@/components/ui/Loader'
import useFetch from '@/hooks/folders/useFetch'
import useAppStore from '@/store/store'

const Head = () => {
	const { data } = useFetch({ page: 1, limit: 25 })

	const openEditor = useAppStore((s) => s.openFolderEditor)
	const isFetching = useAppStore((s) => s.isFetching)

	const handleOpenEditor = () => openEditor('create', null)

	return (
		<div className='flex flex-wrap items-end justify-between mb-4 gap-x-4 gap-y-2'>
			<PageHead
				title='Manage and organize your folders'
				description='You can view the list of tasks contained in folders, edit them, and drag them between folders'
				className='basis-full xl:basis-auto'
			/>

			{!!data?.total && (
				<Button
					variant='outline'
					onClick={handleOpenEditor}
					className='xl:order-1'>
					<Plus className='opacity-60' />
					Create folder
				</Button>
			)}

			{isFetching && <Loader className='justify-end mr-2 xl:h-9 xl:ml-auto' />}
		</div>
	)
}

export default Head

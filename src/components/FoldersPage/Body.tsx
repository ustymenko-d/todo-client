'use client'

import useAppStore from '@/store/store'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import FoldersService from '@/services/folders.service'
import EmptyPlaceholder from './EmptyPlaceholder'
import FolderCard from './components/FolderCard'

const Body = () => {
	const accountInfo = useAppStore((state) => state.accountInfo)
	const openEditor = useAppStore((state) => state.openFolderEditor)
	const setAccountInfo = useAppStore((state) => state.setAccountInfo)
	const [loadingArray, setLoadingArray] = useState<string[]>([])
	const isFolderLoading = useCallback(
		(id: string) => loadingArray.includes(id),
		[loadingArray]
	)

	const handleDeleteFolder = async (id: string) => {
		try {
			setLoadingArray((prev) => [...prev, id])
			const { data } = await FoldersService.deleteFolder(id)
			const { success, message } = data
			if (success) {
				toast.success(message)
				if (accountInfo) {
					setAccountInfo((prev) => ({
						...prev!,
						folders: prev?.folders?.filter((folder) => folder.id !== id),
					}))
				}
			}
		} catch (error) {
			setLoadingArray((prev) => prev.filter((element) => element !== id))
			toast.error('Something went wrong!')
			console.error('Error:', error)
		} finally {
			setLoadingArray((prev) => prev.filter((element) => element !== id))
		}
	}

	if (!accountInfo?.folders?.length) return <EmptyPlaceholder />

	return (
		<div className='mt-4 w-full flex flex-col gap-2 lg:gap-4'>
			{accountInfo?.folders?.map((folder) => (
				<FolderCard
					key={folder.id}
					folder={folder}
					isLoading={isFolderLoading(folder.id)}
					onEdit={() => openEditor('edit', folder)}
					onDelete={() => handleDeleteFolder(folder.id)}
				/>
			))}
		</div>
	)
}

export default Body

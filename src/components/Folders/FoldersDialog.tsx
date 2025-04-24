'use client'

import { useCallback, useState } from 'react'
import useAppStore from '@/store/store'
import FoldersService from '@/services/folders.service'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import Editor from './components/Editor'
import { IFolder } from '@/types/folders'
import { Plus } from 'lucide-react'
import FolderCard from './components/FolderCard'

const FoldersDialog = () => {
	const isOpen = useAppStore((state) => state.isOpenFoldersDialog)
	const setIsOpen = useAppStore((state) => state.setIsOpenFoldersDialog)
	const folders = useAppStore((state) => state.folders)
	const openEditor = useAppStore((state) => state.openFolderEditor)
	const setFolders = useAppStore((state) => state.setFolders)
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
				setFolders(folders?.filter((folder: IFolder) => folder.id !== id) || [])
			}
		} catch (error) {
			setLoadingArray((prev) => prev.filter((element) => element !== id))
			toast.error('Something went wrong!')
			console.error('Error:', error)
		} finally {
			setLoadingArray((prev) => prev.filter((element) => element !== id))
		}
	}

	return (
		<>
			<Dialog
				open={isOpen}
				onOpenChange={setIsOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Folders</DialogTitle>
						<DialogDescription>
							Manage and organize your folders.
						</DialogDescription>
					</DialogHeader>

					<div className='flex flex-col gap-2'>
						<Button
							variant='outline'
							onClick={() => openEditor('create', null)}>
							<Plus className='opacity-60' />
							Create folder
						</Button>
						{folders?.map((folder) => (
							<FolderCard
								key={folder.id}
								folder={folder}
								isLoading={isFolderLoading(folder.id)}
								onEdit={() => openEditor('edit', folder)}
								onDelete={() => handleDeleteFolder(folder.id)}
							/>
						))}
					</div>
				</DialogContent>
			</Dialog>

			<Editor />
		</>
	)
}

export default FoldersDialog

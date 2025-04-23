'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import useAppStore from '@/store/store'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, PenLine, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import FolderService from '@/services/Axios/folder.service'
import { useState } from 'react'
import Editor from './components/Editor'
import { IFolder } from '@/types/folder'

const FoldersDialog = () => {
	const isOpen = useAppStore((state) => state.isOpenFoldersDialog)
	const setIsOpen = useAppStore((state) => state.setIsOpenFoldersDialog)
	const folders = useAppStore((state) => state.folders)
	const openEditor = useAppStore((state) => state.openFolderEditor)
	const setFolders = useAppStore((state) => state.setFolders)
	const [loadingArray, setLoadingArray] = useState<string[]>([])

	const handleDeleteFolder = async (id: string) => {
		setLoadingArray((state) => [...state, id])
		try {
			const { data } = await FolderService.deleteFolder(id)
			const { success, message } = data
			if (success) {
				toast.success(message)
				setFolders(folders?.filter((folder: IFolder) => folder.id !== id) || [])
			}
		} catch (error) {
			setLoadingArray((state) => state.filter((element) => element !== id))
			toast.error('Something went wrong!')
			console.error('Error:', error)
		} finally {
			setLoadingArray((state) => state.filter((element) => element !== id))
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
						{folders?.map((folder) => {
							const { id, name } = folder
							const isLoading = loadingArray.includes(id)
							return (
								<Card key={id}>
									<CardHeader className='flex-row flex-wrap items-center justify-between gap-4'>
										<CardTitle>{name}</CardTitle>
										<div className='flex gap-2 items-center'>
											<Button
												size='icon'
												variant='outline'
												onClick={() => openEditor('edit', folder)}>
												<PenLine />
											</Button>
											<Button
												size='icon'
												variant='destructive'
												disabled={isLoading}
												onClick={() => handleDeleteFolder(id)}>
												{isLoading ? (
													<Loader2
														strokeWidth={1.5}
														className='animate-spin'
													/>
												) : (
													<Trash2 />
												)}
											</Button>
										</div>
									</CardHeader>
								</Card>
							)
						})}
					</div>
				</DialogContent>
			</Dialog>

			<Editor />
		</>
	)
}

export default FoldersDialog

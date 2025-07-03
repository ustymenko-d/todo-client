'use client'

import { ListCheck, Loader2, PenLine, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import FoldersAPI from '@/api/folders.api'
import DeleteDialog from '@/components/DeleteDialog'
import { queryClient } from '@/components/providers/Query.provider'
import { MOCK_TASK } from '@/const'
import useAppStore from '@/store/store'
import { TResponseState } from '@/types/common'
import { IFolder } from '@/types/folders'

import TooltipButton from './TooltipButton'

const FolderActions = ({
	folder,
	handleShowTasks,
}: {
	folder: IFolder
	handleShowTasks: () => void
}) => {
	const openFolderEditor = useAppStore((state) => state.openFolderEditor)
	const openTaskEditor = useAppStore((state) => state.openTaskEditor)

	const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
	const [deleteStatus, setDeleteStatus] = useState<TResponseState>('default')

	const isDeleting = deleteStatus === 'pending'
	const isDeleted = deleteStatus === 'success'

	const { id } = folder

	const handleCreateTask = () =>
		openTaskEditor('create', { ...MOCK_TASK, folderId: id })

	const handleEdit = () => openFolderEditor('edit', folder)

	const handleDeleteFolder = async () => {
		setDeleteStatus('pending')

		try {
			const { success, message } = await FoldersAPI.deleteFolder(id)

			if (!success) throw new Error(message ?? 'Delete folder failed')

			setDeleteStatus('success')
			toast.success(message)
			queryClient.invalidateQueries({ queryKey: ['folders'] })
		} catch (error) {
			setDeleteStatus('error')
			console.error('Delete Folder Error:', error)
		}
	}

	return (
		<div className='flex items-center gap-1'>
			<TooltipButton
				size='icon'
				variant='outline'
				label='Create new task'
				onClick={handleCreateTask}>
				<Plus />
			</TooltipButton>

			<TooltipButton
				size='icon'
				variant='outline'
				label='Show tasks'
				onClick={handleShowTasks}>
				<ListCheck />
			</TooltipButton>

			<TooltipButton
				size='icon'
				variant='outline'
				label='Rename folder'
				onClick={handleEdit}>
				<PenLine />
			</TooltipButton>

			<TooltipButton
				size='icon'
				variant='destructive'
				label='Delete folder'
				disabled={isDeleting || isDeleted}
				onClick={() => setOpenDeleteDialog(true)}>
				{isDeleting ? (
					<Loader2
						strokeWidth={1.5}
						className='animate-spin'
					/>
				) : (
					<Trash2 />
				)}
			</TooltipButton>

			<DeleteDialog
				handleDelete={handleDeleteFolder}
				loading={isDeleting}
				disabled={isDeleted}
				deleteTarget='folder'
				open={openDeleteDialog}
				onOpenChange={setOpenDeleteDialog}
			/>
		</div>
	)
}

export default FolderActions

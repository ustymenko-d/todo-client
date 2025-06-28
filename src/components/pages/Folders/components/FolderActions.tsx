'use client'

import { ListCheck, Loader2, PenLine, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import FoldersAPI from '@/api/folders.api'
import DeleteDialog from '@/components/DeleteDialog'
import { queryClient } from '@/components/providers/Query.provider'
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
	const openEditor = useAppStore((state) => state.openFolderEditor)

	const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
	const [status, setStatus] = useState<TResponseState>('default')

	const { id } = folder

	const handleEdit = () => openEditor('edit', folder)

	const handleDeleteFolder = async () => {
		setStatus('pending')

		try {
			const { success, message } = await FoldersAPI.deleteFolder(id)

			if (!success) throw new Error(message ?? 'Delete folder failed')

			setStatus('success')
			toast.success(message)
			queryClient.invalidateQueries({ queryKey: ['folders'] })
		} catch (error) {
			setStatus('error')
			console.error('Delete Folder Error:', error)
		}
	}

	return (
		<div className='flex items-center gap-1'>
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
				label='Rename'
				onClick={handleEdit}>
				<PenLine />
			</TooltipButton>

			<TooltipButton
				size='icon'
				variant='destructive'
				label='Delete'
				disabled={status === 'pending' || status === 'success'}
				onClick={() => setOpenDeleteDialog(true)}>
				{status === 'pending' ? (
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
				loading={status === 'pending'}
				disabled={status === 'success'}
				deleteTarget='folder'
				open={openDeleteDialog}
				onOpenChange={setOpenDeleteDialog}
			/>
		</div>
	)
}

export default FolderActions

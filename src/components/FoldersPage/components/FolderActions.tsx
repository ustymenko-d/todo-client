import { ListCheck, Loader2, PenLine, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import DeleteDialog from '@/components/DeleteDialog'
import { queryClient } from '@/components/providers/Query.provider'
import FoldersService from '@/services/folders.service'
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
	const [loading, setLoading] = useState<TResponseState>('default')

	const { id } = folder

	const handleEdit = () => openEditor('edit', folder)

	const handleDeleteFolder = async () => {
		try {
			setLoading('pending')

			const { data } = await FoldersService.deleteFolder(id)
			const { success, message } = data

			if (success) {
				setLoading('success')
				toast.success(message)
				queryClient.invalidateQueries({ queryKey: ['folders'] })
			}
		} catch (error) {
			setLoading('error')
			toast.error('Something went wrong!')
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
				disabled={loading === 'pending' || loading === 'success'}
				onClick={() => setOpenDeleteDialog(true)}>
				{loading === 'pending' ? (
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
				loading={loading === 'pending'}
				disabled={loading === 'success'}
				deleteTarget='folder'
				open={openDeleteDialog}
				onOpenChange={setOpenDeleteDialog}
			/>
		</div>
	)
}

export default FolderActions

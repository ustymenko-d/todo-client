import { useState } from 'react'
import useAppStore from '@/store/store'
import FoldersService from '@/services/folders.service'
import useUpdate from '@/hooks/folders/useUpdate'
import { toast } from 'sonner'
import TooltipButton from './TooltipButton'
import DeleteDialog from '@/components/DeleteDialog'
import { ListCheck, Loader2, PenLine, Trash2 } from 'lucide-react'
import { IFolderWithTasks } from '@/types/folders'
import { TResponseState } from '@/types/common'

const FolderActions = ({
	folder,
	showTasks,
}: {
	folder: IFolderWithTasks
	showTasks: () => void
}) => {
	const openEditor = useAppStore((state) => state.openFolderEditor)
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
	const [loading, setLoading] = useState<TResponseState>('default')
	const { id } = folder

	const { handleUpdateFolders } = useUpdate()

	const handleEdit = () => {
		openEditor('edit', folder)
	}

	const handleDeleteFolder = async () => {
		try {
			setLoading('pending')
			const { data } = await FoldersService.deleteFolder(id)
			const { success, message, folder } = data
			if (success) {
				toast.success(message)
				handleUpdateFolders('delete', folder)
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
				onClick={showTasks}>
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

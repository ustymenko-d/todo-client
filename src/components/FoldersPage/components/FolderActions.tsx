import { useState } from 'react'
import useAppStore from '@/store/store'
import FoldersService from '@/services/folders.service'
import { toast } from 'sonner'
import TooltipButton from './TooltipButton'
import DeleteDialog from '@/components/DeleteDialog'
import { ListTodo, Loader2, PenLine, Trash2 } from 'lucide-react'
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
	const setFoldersWithTasks = useAppStore((state) => state.setFoldersWithTasks)
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
	const [loading, setLoading] = useState<TResponseState>('default')
	const { id } = folder

	const handleEdit = () => {
		openEditor('edit', folder)
	}

	const handleDeleteFolder = async () => {
		try {
			setLoading('pending')
			const { data } = await FoldersService.deleteFolder(id)
			const { success, message } = data
			if (success) {
				toast.success(message)
				setFoldersWithTasks((prev) => prev.filter((f) => f.id !== id))
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
				<ListTodo />
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

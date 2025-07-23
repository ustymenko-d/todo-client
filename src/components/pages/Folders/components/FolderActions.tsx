'use client'

import { ListCheck, Loader2, PenLine, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

import DeleteDialog from '@/components/DeleteDialog'
import { MOCK_TASK } from '@/const'
import useActions from '@/hooks/folders/useActions'
import useAppStore from '@/store/store'
import { TResponseState } from '@/types/common'
import { IFolder } from '@/types/folders'

import TooltipButton from './TooltipButton'

type Props = {
	folder: IFolder
	handleShowTasks: () => void
}

const FolderActions = ({ folder, handleShowTasks }: Props) => {
	const openFolderEditor = useAppStore(state => state.openFolderEditor)
	const openTaskEditor = useAppStore(state => state.openTaskEditor)

	const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
	const [status, setStatus] = useState<TResponseState>('default')

	const isDeleting = status === 'pending'
	const deleted = status === 'success'

	const { handleFolderAction: deleteFolder } = useActions('delete', folder)

	const actionBtns = useMemo(
		() => [
			{
				icon: <Plus />,
				label: 'Create task',
				onClick: () => openTaskEditor('create', { ...MOCK_TASK, folderId: folder.id }),
			},
			{
				icon: <ListCheck />,
				label: 'Show tasks',
				onClick: handleShowTasks,
			},
			{
				icon: <PenLine />,
				label: 'Rename folder',
				onClick: () => openFolderEditor('edit', folder),
			},
		],
		[folder, handleShowTasks, openFolderEditor, openTaskEditor]
	)

	return (
		<div className='flex items-center gap-1'>
			{actionBtns.map(({ icon, label, onClick }) => (
				<TooltipButton
					key={'FolderActions_' + label}
					size='icon'
					variant='outline'
					label={label}
					onClick={onClick}>
					{icon}
				</TooltipButton>
			))}

			<TooltipButton
				size='icon'
				variant='destructive'
				label='Delete folder'
				disabled={isDeleting || deleted}
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
				handleDelete={() => deleteFolder(setStatus)}
				loading={isDeleting}
				disabled={deleted}
				deleteTarget='folder'
				open={openDeleteDialog}
				onOpenChange={setOpenDeleteDialog}
			/>
		</div>
	)
}

export default FolderActions

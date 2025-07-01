import { Fragment, useState } from 'react'
import { PropsWithChildren } from 'react'

import DeleteDialog from '@/components/DeleteDialog'
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from '@/components/ui/context-menu'
import useActions from '@/hooks/tasks/useActions'
import useAppStore from '@/store/store'
import { TTask } from '@/types/tasks'

interface IContextMenuProps extends PropsWithChildren {
	task: TTask
	inTable?: boolean
}

const TaskContextMenu = ({
	task,
	children,
	inTable = false,
}: IContextMenuProps) => {
	const openTaskEditor = useAppStore((s) => s.openTaskEditor)
	const openTaskDialog = useAppStore((s) => s.openTaskDialog)

	const [openAlert, setOpenAlert] = useState(false)
	const [deleteLoading, setDeleteLoading] = useState(false)
	const [togglingLoading, setTogglingLoading] = useState(false)

	const { handleTaskAction: chengeTaskStatus } = useActions(
		'changeStatus',
		task
	)

	const { handleTaskAction: deleteTask } = useActions('delete', task)

	const handleOpenDetails = () => openTaskDialog(task)
	const openDeleteDialog = () => setTimeout(() => setOpenAlert(true), 0)

	return (
		<>
			<ContextMenu>
				<ContextMenuTrigger
					onClick={handleOpenDetails}
					asChild>
					{inTable ? children : <div>{children}</div>}
				</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem
						onSelect={() => setTimeout(() => openTaskEditor('edit', task), 0)}>
						Edit task
					</ContextMenuItem>
					<ContextMenuItem
						onSelect={() =>
							setTimeout(() => openTaskEditor('create', task), 0)
						}>
						Add Subtask
					</ContextMenuItem>
					<ContextMenuItem
						onClick={() => chengeTaskStatus(setTogglingLoading)}
						disabled={togglingLoading}>
						Toggle status
					</ContextMenuItem>
					<ContextMenuSeparator />
					<ContextMenuItem
						onSelect={openDeleteDialog}
						disabled={deleteLoading}>
						Delete
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>

			<DeleteDialog
				handleDelete={() => deleteTask(setDeleteLoading)}
				loading={deleteLoading}
				deleteTarget='task'
				open={openAlert}
				onOpenChange={setOpenAlert}
			/>
		</>
	)
}

export default TaskContextMenu

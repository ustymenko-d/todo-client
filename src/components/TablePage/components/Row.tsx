'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAppStore from '@/store/store'
import TasksService from '@/services/tasks.service'
import { Cell, flexRender, Row as TanstackRow } from '@tanstack/react-table'
import { toast } from 'sonner'
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import Details from '@/components/Tasks/Details'
import DeleteDialog from '@/components/DeleteDialog'
import { TResponseState } from '@/types/common'
import { TTask } from '@/types/tasks'

const Row = ({ row }: { row: TanstackRow<TTask> }) => {
	const task = row.original
	const router = useRouter()
	const openTaskEditor = useAppStore((state) => state.openTaskEditor)
	const [dialogState, setDialogState] = useState<{
		openAlert: boolean
		loading: TResponseState
	}>({
		openAlert: false,
		loading: 'default',
	})

	const handleTaskAction = useCallback(
		async (action: 'delete' | 'toggleStatus') => {
			try {
				setDialogState((prev) => ({ ...prev, loading: 'pending' }))
				const actionFn =
					action === 'delete'
						? TasksService.deleteTask
						: TasksService.toggleStatus

				const { data } = await actionFn(task.id)

				if (data.success) {
					toast.success(
						action === 'delete'
							? 'Task successfully deleted'
							: 'Task status successfully changed'
					)
					setDialogState((prev) => ({ ...prev, loading: 'success' }))
					router.refresh()
				} else {
					toast.error('Something went wrong!')
				}
			} catch (error) {
				setDialogState((prev) => ({ ...prev, loading: 'error' }))
				console.error(`Error while performing task action: ${action}`, error)
				toast.error('Something went wrong!')
			}
		},
		[task.id, router]
	)

	const openDeleteDialog = () =>
		setTimeout(
			() => setDialogState((prev) => ({ ...prev, openAlert: true })),
			0
		)

	return (
		<>
			<DeleteDialog
				handleDelete={() => handleTaskAction('delete')}
				loading={dialogState.loading === 'pending'}
				disabled={dialogState.loading === 'success'}
				deleteTarget='task'
				open={dialogState.openAlert}
				onOpenChange={(openAlert: boolean) =>
					setDialogState((prev) => ({ ...prev, openAlert }))
				}
			/>

			<ContextMenu>
				<Dialog>
					<DialogTrigger asChild>
						<ContextMenuTrigger asChild>
							<TableRow>
								{row.getVisibleCells().map((cell: Cell<TTask, unknown>) => (
									<TableCell
										key={cell.id}
										className='border-r cursor-pointer last:border-none select-none'>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						</ContextMenuTrigger>
					</DialogTrigger>
					<Details task={row.original} />
				</Dialog>
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
					<ContextMenuItem onClick={() => handleTaskAction('toggleStatus')}>
						Toggle status
					</ContextMenuItem>
					<ContextMenuSeparator />
					<ContextMenuItem onSelect={openDeleteDialog}>Delete</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
		</>
	)
}

export default Row

'use client'

import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { Cell, flexRender, Row } from '@tanstack/react-table'
import { useCallback, useState } from 'react'
import TasksService from '@/services/Axios/tasks.service'
import { toast } from 'sonner'
import { usePathname, useRouter } from 'next/navigation'
import useAppStore from '@/store/store'
import Details from '@/components/Tasks/Details'
import DeleteDialog from '@/components/DeleteDialog'
import { TTask } from '@/types/tasks'

const RowElement = ({ row }: { row: Row<TTask> }) => {
	const task = row.original
	const router = useRouter()
	const pathname = usePathname()
	const [dialogState, setDialogState] = useState({
		openAlert: false,
		loading: false,
	})
	const openTaskEditor = useAppStore((state) => state.openTaskEditor)

	const handleTaskAction = useCallback(
		async (action: 'delete' | 'toggleStatus') => {
			try {
				setDialogState((prev) => ({ ...prev, loading: true }))
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

					if (pathname === '/dashboard') {
						router.push(`?page=1&limit=25`)
					}
				} else {
					toast.error('Something went wrong!')
				}
			} catch (error) {
				console.error(`Error while performing task action: ${action}`, error)
				toast.error('Something went wrong!')
			} finally {
				setDialogState((prev) => ({ ...prev, loading: false }))
			}
		},
		[task.id, pathname, router]
	)

	const handleDeleteOpen = () =>
		setTimeout(() => setDialogState({ ...dialogState, openAlert: true }), 0)

	return (
		<>
			<DeleteDialog
				handleDelete={() => handleTaskAction('delete')}
				loading={dialogState.loading}
				open={dialogState.openAlert}
				onOpenChange={(open: boolean) =>
					setDialogState({ ...dialogState, openAlert: open })
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
					<ContextMenuItem onSelect={handleDeleteOpen}>Delete</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
		</>
	)
}

export default RowElement

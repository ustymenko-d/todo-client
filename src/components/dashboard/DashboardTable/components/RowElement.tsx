'use client'

import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from '@/components/ui/context-menu'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { Cell, flexRender, Row } from '@tanstack/react-table'
import { useCallback, useState } from 'react'
import TasksService from '@/services/Axios/tasks.service'
import { toast } from 'sonner'
import { usePathname, useRouter } from 'next/navigation'
import { ITask } from '@/types/tasks'
import useAppStore from '@/store/store'
import LoadingButton from '@/components/ui/LoadingButton'

const RowElement = ({ row }: { row: Row<ITask> }) => {
	const task = row.original
	const router = useRouter()
	const pathname = usePathname()
	const [dialogState, setDialogState] = useState({
		openAlert: false,
		loading: false,
	})

	const setTaskEditorSettings = useAppStore(
		(state) => state.setTaskEditorSettings
	)

	const openTaskEditor = useCallback(
		(mode: 'edit' | 'create') => {
			setTaskEditorSettings({ open: true, mode, selectedTask: task })
		},
		[setTaskEditorSettings, task]
	)

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
			<AlertDialog
				open={dialogState.openAlert}
				onOpenChange={(open) =>
					setDialogState({ ...dialogState, openAlert: open })
				}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you sure you want to delete this task?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete your
							task.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							asChild
							onClick={() => handleTaskAction('delete')}>
							<LoadingButton
								className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
								loading={dialogState.loading}
								variant='destructive'>
								Delete
							</LoadingButton>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<ContextMenu>
				<ContextMenuTrigger asChild>
					<TableRow>
						{row.getVisibleCells().map((cell: Cell<ITask, unknown>) => (
							<TableCell
								key={cell.id}
								className='border-r last:border-none'>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</TableCell>
						))}
					</TableRow>
				</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem
						onSelect={() => setTimeout(() => openTaskEditor('edit'), 0)}>
						Edit task
					</ContextMenuItem>
					<ContextMenuItem
						onSelect={() => setTimeout(() => openTaskEditor('create'), 0)}>
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

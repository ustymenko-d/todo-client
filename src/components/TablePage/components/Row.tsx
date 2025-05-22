'use client'

import { useState } from 'react'
import useAppStore from '@/store/store'
import { Cell, flexRender, Row as TanstackRow } from '@tanstack/react-table'
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { TableCell, TableRow } from '@/components/ui/table'
import DeleteDialog from '@/components/DeleteDialog'
import { TTask } from '@/types/tasks'
import { cn } from '@/lib/utils'
import useActions from '@/hooks/tasks/useActions'

const depthBgMap: Record<number, string> = {
	0: 'bg-white dark:bg-neutral-900',
	1: 'bg-neutral-100 dark:bg-neutral-800',
	2: 'bg-neutral-200 dark:bg-neutral-700',
	3: 'bg-neutral-300 dark:bg-neutral-600',
	4: 'bg-neutral-400 dark:bg-neutral-500',
}

const Row = ({ row }: { row: TanstackRow<TTask> }) => {
	const task = row.original
	const openTaskEditor = useAppStore((state) => state.openTaskEditor)
	const openTaskDialog = useAppStore((state) => state.openTaskDialog)
	const [openAlert, setOpenAlert] = useState(false)
	const [deleteLoading, setDeleteLoading] = useState(false)
	const [togglingLoading, setTogglingLoading] = useState(false)

	const { handleTaskAction: chengeTaskStatus } = useActions(
		'changeStatus',
		task
	)

	const { handleTaskAction: deleteTask } = useActions('delete', task)

	const handleOpenDetails = () => {
		openTaskDialog(task)
	}

	const openDeleteDialog = () => setTimeout(() => setOpenAlert(true), 0)

	return (
		<>
			<ContextMenu>
				<ContextMenuTrigger asChild>
					<TableRow
						onClick={handleOpenDetails}
						className={cn(depthBgMap[row.depth])}>
						{row.getVisibleCells().map((cell: Cell<TTask, unknown>) => (
							<TableCell
								key={cell.id}
								className='border-r cursor-pointer select-none last:border-none'>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</TableCell>
						))}
					</TableRow>
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

export default Row

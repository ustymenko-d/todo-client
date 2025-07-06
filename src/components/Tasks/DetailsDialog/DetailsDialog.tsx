'use client'

import { useState } from 'react'

import DeleteDialog from '@/components/DeleteDialog'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import useFetch from '@/hooks/folders/useFetch'
import useActions from '@/hooks/tasks/useActions'
import useAppStore from '@/store/store'
import { TTask } from '@/types/tasks'
import { formatDate, formatValue } from '@/utils/formatting'

import InfoBlock from './components/InfoBlock'

const DetailsDialog = () => {
	const { data } = useFetch({ page: 1, limit: 25 })
	const { folders } = data ?? {}

	const open = useAppStore((s) => s.taskDialogSettings.open)
	const task = useAppStore((s) => s.taskDialogSettings.task)
	const openTaskEditor = useAppStore((s) => s.openTaskEditor)
	const closeTaskDialog = useAppStore((s) => s.closeTaskDialog)

	const [deleting, setDeleting] = useState(false)
	const [toggling, setToggling] = useState(false)

	const { handleTaskAction: changeStatus } = useActions(
		'changeStatus',
		task as TTask
	)

	const { handleTaskAction: deleteTask } = useActions('delete', task as TTask)

	if (!task) return null

	const { title, description, completed, startDate, folderId, expiresDate } =
		task

	const taskFolder = folders?.find((folder) => folder.id === folderId)

	const handleStatusChange = () => changeStatus(setToggling)
	const handleEdit = () => openTaskEditor('edit', task)
	const handleAddSubtask = () => openTaskEditor('create', task)
	const handleDelete = () => deleteTask(setDeleting)

	return (
		<Dialog
			open={open}
			onOpenChange={closeTaskDialog}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title || 'Task title'}</DialogTitle>
				</DialogHeader>

				<div className='flex flex-col gap-3 pt-4'>
					<InfoBlock label='Description:'>
						<DialogDescription className='text-current'>
							{description || 'No description provided.'}
						</DialogDescription>
					</InfoBlock>

					<div
						role='group'
						aria-labelledby='status-label'
						className='flex flex-col gap-2'>
						<h4 className='text-muted-foreground'>Status:</h4>
						<div className='flex items-center space-x-2'>
							<Switch
								id='task-status'
								checked={completed}
								disabled={toggling}
								onCheckedChange={handleStatusChange}
							/>
							<Label
								htmlFor='task-status'
								className='text-base cursor-pointer'>
								{completed ? 'Completed' : 'In Progress'}
							</Label>
						</div>
					</div>

					{startDate && (
						<InfoBlock label='Start date:'>
							<span>{formatDate(startDate)}</span>
						</InfoBlock>
					)}

					{expiresDate && (
						<InfoBlock label='Expires date:'>
							<span>{formatDate(expiresDate)}</span>
						</InfoBlock>
					)}

					{folderId && (
						<InfoBlock label='Folder:'>
							<span>{formatValue(taskFolder?.name)}</span>
						</InfoBlock>
					)}
				</div>

				<DialogFooter className='gap-2 sm:space-x-0'>
					<Button
						variant='outline'
						onClick={handleAddSubtask}>
						Add subtask
					</Button>
					<Button
						variant='outline'
						onClick={handleEdit}>
						Edit
					</Button>
					<DeleteDialog
						handleDelete={handleDelete}
						loading={deleting}
						needTrigger
						deleteTarget='task'
					/>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default DetailsDialog
